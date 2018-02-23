import Ember from 'ember';
import {getToday, getTodaySortable, truncText} from '../utils/functions';

export default Ember.Controller.extend({
  import:'',
  processed:'',
  debug:false,
  actions: {
    import(data){
      //customer,project,date,name,mgr,task,billable,status,memo,hours,type
      let customer = '';
      let project = '';
      let date = '';
      let name='';
      let mgr = '';
      let task = '';
      let billable = '';
      let status = '';
      let memo = '';
      let hours = '';
      let type = '';
      let dept='';

      /// For Report
      let flexEarned={};
      let flexUsed={};
      let nameList={};
      let mgrList={};
      let mgrLookup={};

      // For Importing Data
      let str1='';
      let str2 = '';
      let strDetail='';
      let txt = '';
      let lines = data.split('\n');
      let count = 1;
      let context=this;   //need to use this in inner functions
      let dbReq=null;

      str2 = str2 + "New Import: " + getTodaySortable() + '\n';

      // Read each line and split CSV at the commas
      lines.forEach(function (line) {
        let header=false;
        hours=0;
        line = line.replace(/","/g,"^");  //change <","> to <^>
        line = line.replace(/"/g,"");       //remove <">
        let importData = line.split('^');  //split on <^>
        let i = 0;  // data field count

        // Read [0customer,1project,2date,3name,4mgr,5task,6billable,7status,8memo,9hours,10dept,11type]
        importData.forEach(function (item) {
          item=item.trim();
          item = item.replace(/, /g,"_"); //replace <,>with <_>
          if (i === 0) {
            customer = item;
          }
          else if (i === 1) {
            project = item;
          }
          else if (i === 2) {
            date = item;
          }
          else if (i === 3) {
            name = item;
          }
          else if (i === 4) {
            mgr = item;
          }
          else if (i === 5) {
            task = item;
          }
          else if (i === 6) {
            billable= item;
          }
          else if (i === 7) {
            status = item;
          }
          else if (i === 8) {
            memo = item;
          }
          else if (i === 9) {
            hours = item;
          }
          else if (i === 10) {
            dept = item;
          }
          else if (i === 11) {
            type = item;
          }

          i++;
        });

        if (name==='User') header=true;

        // Create Record if not matched
        if (!header) {
          if (count<=10) {
            str2 = str2 + count + ` ADDED: ${name},${project},${date},${hours},${mgr}\n`;
          }
          str1 = str1 + count + ` ADDED: ${name},${project},${date},${hours},${mgr}\n`;
          if (count===1){
            strDetail=strDetail+'FLEX TIME IMPORT DETAIL:\n';
            strDetail=strDetail+'CUSTOMER: '+customer+'\n';
            strDetail=strDetail+'PROJECT: '+project+'\n';
            strDetail=strDetail+'DATE: '+date+'\n';
            strDetail=strDetail+'NAME: '+name+'\n';
            strDetail=strDetail+'MGR: '+mgr+'\n';
            strDetail=strDetail+'TASK: '+task+'\n';
            strDetail=strDetail+'BILLABLE: '+billable+'\n';
            strDetail=strDetail+'STATUS: '+status+'\n';
            strDetail=strDetail+'MEMO: '+memo+'\n';
            strDetail=strDetail+'HOURS: '+hours+'\n';
            strDetail=strDetail+'DEPT: '+dept+'\n';
            strDetail=strDetail+'TYPE: '+type+'\n';
          }
          count++;

          //update Name and Manager List
          nameList[name]=name;
          mgrList[mgr]=mgr;
          mgrLookup[name]=mgr;

          if (project==='~FXearned - Flex Time Earned') {
            addVal(flexEarned,name,hours);
          }
          else if (project==='~FXused - Flex Time Used') {
            addVal(flexUsed,name,hours);
          }
        }
      });
      if (this.get('debug')) alert(strDetail);
      this.set('processed',str1);

      // Final List
      let report='<h2>FLEX TIME REPORT '+getToday()+'</h2>';
      Object.keys(mgrList).forEach(function(mgr) {
        //report=report+'<b>Manager: '+mgr+'</b><br>';
        report=report+'<table style="width:50%">';
        report=report+'<tr>'+'<th style="width:30%">'+'Manager: '+mgr+'</th>';
        report=report+'<th style="width:10%">NET</th>';
        report=report+'<th style="width:10%">EARNED</th>';
        report=report+'<th style="width:10%">USED</th>';
        report=report+'</tr>';
        Object.keys(nameList).forEach(function (name) {
          let used = flexUsed[name];
          let earned = flexEarned[name];
          if (typeof used === 'undefined') {
            used = 0;
          }
          if (typeof earned === 'undefined') {
            earned = 0;
          }
          let net = earned - used;

          if (mgrLookup[name]===mgr) {
            //report = report + truncText(name,40) + ' NET =  ' + net + '&emsp; &emsp; [ Earned=' + earned + ' Used=' + used +  '] <br>';
            report=report+'<tr>';
            let style='';
            if (parseInt(net)<0) {style=' style="color:red"';}
            else if (parseInt(net)>24) {style=' style="color:blue"';}

            report=report+'<td'+style+'>'+name+'</td>';
            report=report+'<td'+style+'>'+net+'</td>';
            report=report+'<td'+style+'>'+earned+'</td>';
            report=report+'<td'+style+'>'+used+'</td>';
            report=report+'</tr>';
          }
        });
        report = report + '</table>'+'<br>';
      });
      this.set('report', report);
    },
    clear() {
      this.set('import', '');
    },
    test() {
    },
    process([file]) {
      let self = this;
      let reader = new FileReader();

      reader.onload = function (e) {
        self.send('import', reader.result);
      };
      reader.readAsText(file);
    }
  }
});

function addItem(assoc,key){
  if (assoc.hasOwnProperty(key)) {
    assoc[key] = assoc[key] + 1;
  }
  else {
    assoc[key] = 1;
  }
}

function addVal(assoc,key,val){
  if (assoc.hasOwnProperty(key)) {
    assoc[key] = assoc[key] + parseFloat(val);
  }
  else {
    assoc[key] = parseFloat(val);
  }
}

function sorted(assoc) {
  let str='';
  let arr = []; // Array
  let count=0;

  // Save in Array
  Object.keys(assoc).forEach(function (item) {
    arr.push({name:item, val:assoc[item]});
    count=count+assoc[item];
  });

  //Sort
  let sorted = arr.sort(function(a, b) {
    return b.val - a.val;
  });

  sorted.forEach(function (item) {
    str = str + item.name + " : " + item.val+ ' ('+parseFloat(100.0*item.val/count).toFixed(1)+"%)<br>";
  });

  return str;
}
