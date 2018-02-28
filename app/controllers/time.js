import Ember from 'ember';
import {getToday, getTodaySortable, truncText} from '../utils/functions';

export default Ember.Controller.extend({
  processed:'',
  debug:false,
  timeData: '',
  refresh:false,
  searchWeek:'02/19/2018 - 02/25/2018',
  weekList: ['01/01/2018 - 01/07/2018','01/08/2018 - 01/14/2018','01/15/2018 - 01/21/2018','01/22/2018 - 01/28/2018',
    '01/29/2018 - 02/04/2018','02/05/2018 - 02/11/2018','02/12/2018 - 02/18/2018','02/19/2018 - 02/25/2018',
    '02/26/2018 - 03/04/2018','03/05/2018 - 03/11/2018','03/12/2018 - 03/18/2018','03/19/2018 - 03/25/2018',
  ],
  update: Ember.computed('searchWeek', function () {
    this.send('filter');
    return this.get('searchWeek');
  }),
  actions: {
    loadData(data){
      this.set('timeData',data);
      this.send('filter');
    },
    filter(){
      //unit,name,agency,project,emp_type,emp_band,date,billable,status,
      // memo,duration,mgr,rej_comments,run_date1,run_date2,create_date,week,last_edit
      let self=this;
      let data=this.get('timeData');

      let unit = '';
      let name='';
      let project = '';
      let date = '';
      let billable = '';
      let status = '';
      let memo = '';
      let hours = '';
      let mgr = '';
      let week = '';

      /// For Report
      let hoursWorked={};
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

        // Read "0Unit","1Name","2Agency","3Project","4Emp Type","5Emp Band","6Date","7Billable","8Status",
        // "9Memo","10Duration","11Mgr","12Rejection Comment","13(1)Run Date ","14(2)Run Date ",
        // "15Creation Date","16Week","17Last Edit Date"

        importData.forEach(function (item) {
          item=item.trim();
          item = item.replace(/, /g,"_"); //replace <,>with <_>
          if (i === 0) {
            unit = item;
          }
          else if (i === 1) {
            name = item;
          }
          else if (i === 2) {
            //agency
          }
          else if (i === 3) {
            project = item;
          }
          else if (i === 4) {
            //emp_type;
          }
          else if (i === 5) {
            //emp_band;
          }
          else if (i === 6) {
            date= item;
          }
          else if (i === 7) {
            billable = item;
          }
          else if (i === 8) {
            status = item;
          }
          else if (i === 9) {
            memo = item;
          }
          else if (i === 10) {
            hours = item;
          }
          else if (i === 11) {
            mgr = item;
          }
          else if (i === 12) {
            //rej comments
          }
          else if (i === 13) {
            //export date 1
          }
          else if (i === 14) {
            //export date 2
          }
          else if (i === 15) {
            //creation date
          }
          else if (i === 16) {
            week = item;
          }
          else if (i === 17) {
            //last edit
          }

          i++;
        });

        if (name==='User') header=true;

        // Create Record if not matched
        if (!header && week===self.get('searchWeek') && project !=='~FXearned - Flex Time Earned') {
          if (count<=10) {
            str2 = str2 + count + ` ADDED: ${name},${project},${date},${hours},${mgr},${week}\n`;
          }
          str1 = str1 + count + ` ADDED: ${name},${project},${date},${hours},${mgr},${week}\n`;
          if (count===1){
            strDetail=strDetail+'TIMECARD IMPORT DETAIL:\n';
            strDetail=strDetail+'UNIT: '+unit+'\n';
            strDetail=strDetail+'NAME: '+name+'\n';
            strDetail=strDetail+'PROJECT: '+project+'\n';
            strDetail=strDetail+'DATE: '+date+'\n';
            strDetail=strDetail+'BILLABLE: '+billable+'\n';
            strDetail=strDetail+'STATUS: '+status+'\n';
            strDetail=strDetail+'MEMO: '+memo+'\n';
            strDetail=strDetail+'HOURS: '+hours+'\n';
            strDetail=strDetail+'MGR: '+mgr+'\n';
            strDetail=strDetail+'WEEK: '+week+'\n';
          }
          count++;

          //update Name and Manager List
          nameList[name]=name;
          mgrList[mgr]=mgr;
          mgrLookup[name]=mgr;

          addVal(hoursWorked,name,hours);
        }
      });
      if (this.get('debug')) alert(strDetail);
      this.set('processed',str1);

      // Final List
      let report='<h2>TIMECARD REPORT '+getToday()+' [week: '+self.get('searchWeek')+']</h2>';
      Object.keys(mgrList).forEach(function(mgr) {
        //report=report+'<b>Manager: '+mgr+'</b><br>';
        report=report+'<table style="width:50%">';
        report=report+'<tr>'+'<th style="width:30%">'+'Manager: '+mgr+'</th>';
        report=report+'<th style="width:10%">HRS WORKED</th>';
        report=report+'<th style="width:10%">TBD</th>';
        report=report+'<th style="width:10%">TBD</th>';
        report=report+'</tr>';
        Object.keys(nameList).forEach(function (name) {
          let hrs = hoursWorked[name];
          if (typeof hrs === 'undefined') {
            used = 0;
          }
          if (typeof hrs === 'undefined') {
            earned = 0;
          }

          if (mgrLookup[name]===mgr) {
            //report = report + truncText(name,40) + ' NET =  ' + net + '&emsp; &emsp; [ Earned=' + earned + ' Used=' + used +  '] <br>';
            report=report+'<tr>';
            let style='';
            if (parseInt(hrs)<36) {style=' style="color:red"';}
            else if (parseInt(hrs)>44) {style=' style="color:blue"';}

            report=report+'<td'+style+'>'+name+'</td>';
            report=report+'<td'+style+'>'+hrs+'</td>';
            report=report+'<td'+style+'>'+hrs+'</td>';
            report=report+'<td'+style+'>'+hrs+'</td>';
            report=report+'</tr>';
          }
        });
        report = report + '</table>'+'<br>';
      });
      this.set('report', report);
    },
    process([file]) {
      let self = this;
      let reader = new FileReader();

      reader.onload = function (e) {
        self.send('loadData', reader.result);
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
