import Ember from 'ember';
import {getToday, getTodaySortable, truncText} from '../utils/functions';

export default Ember.Controller.extend({
  processed:'',
  debug:false,
  imported:false,
  missing:false,
  timeData: '',
  refresh:false,
  searchWeek:'02/19/2018 - 02/25/2018',
  weekList: ['01/01/2018 - 01/07/2018','01/08/2018 - 01/14/2018','01/15/2018 - 01/21/2018','01/22/2018 - 01/28/2018',
    '01/29/2018 - 02/04/2018','02/05/2018 - 02/11/2018','02/12/2018 - 02/18/2018','02/19/2018 - 02/25/2018',
    '02/26/2018 - 03/04/2018','03/05/2018 - 03/11/2018','03/12/2018 - 03/18/2018','03/19/2018 - 03/25/2018',
  ],
  update: Ember.computed('searchWeek', 'missing', function () {
    this.send('filter');
    return this.get('missing');
  }),
  actions: {
    loadData(data){
      this.set('timeData',data);
      this.set('imported',true);
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
      let vacation={};
      let personal={};
      let holidays={};
      let netFlex={};
      let nonBillable={};
      let training={};
      let totalHrs={};

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
        if (!header && week===self.get('searchWeek')) {
          if (count<=10) {
            str2 = str2 + count + ` ADDED: ${name},${project},${date},${hours},${mgr},${week}\n`;
          }
          str1 = str1 + count + ` ADDED: ${name},${project},${date},${hours},${mgr},${week},${billable}\n`;
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

          if (project==='~VA999 - Vacation'){
            addVal(vacation, name, hours);
          }
          else if (project==='~HL999 - Holiday'){
            addVal(holidays, name, hours);
          }
          else if (project==='~PE999 - Personal time'){
            addVal(personal, name, hours);
          }
          else if (project==='~TR999 - Training'){
            addVal(training, name, hours);
          }
          else if (project==='~FXused - Flex Time Used'){
            subVal(netFlex, name, hours);
          }
          else if (project==='~FXearned - Flex Time Earned'){
            addVal(netFlex, name, hours);
          }
          else if (project==='~TR999 - Training'){
            addVal(training, name, hours);
          }
          else if (billable==='No'){
            addVal(nonBillable, name, hours);
          }
          else if (billable==='Yes'){
            addVal(hoursWorked, name, hours);
          }

          // Total Hours
          if (project!=='~FXearned - Flex Time Earned'){
            addVal(totalHrs, name, hours);
          }
        }
      });
      if (this.get('debug')) {alert(strDetail);}
      this.set('processed',str1);

      // Final List
      let report='';
      Object.keys(mgrList).forEach(function(mgr) {
        //report=report+'<b>Manager: '+mgr+'</b><br>';
        report=report+'<table style="width:50%">';
        report=report+'<tr>'+'<th style="width:30%">'+'Manager: '+mgr+'</th>';
        report=report+'<th style="width:10%">TOTAL HRS</th>';
        report=report+'<th style="width:10%">Billable</th>';
        report=report+'<th style="width:10%">Non-Bill</th>';
        report=report+'<th style="width:10%">VAC</th>';
        report=report+'<th style="width:10%">PE</th>';
        report=report+'<th style="width:10%">Hol</th>';
        report=report+'<th style="width:10%">Flex</th>';
        report=report+'<th style="width:10%">Training</th>';
        report=report+'</tr>';
        Object.keys(nameList).forEach(function (name) {
          let hrs = hoursWorked[name];
          let vac = vacation[name];
          let hol = holidays[name];
          let pe = personal[name];
          let flex = netFlex[name];
          let non = nonBillable[name];
          let total = totalHrs[name];
          let train = training[name];
          if (typeof hrs === 'undefined') {
            hrs = 0;
          }
          if (typeof vac === 'undefined') {
            vac = 0;
          }
          if (typeof hol === 'undefined') {
            hol = 0;
          }
          if (typeof pe === 'undefined') {
            pe = 0;
          }
          if (typeof flex === 'undefined') {
            flex = 0;
          }
          if (typeof non === 'undefined') {
            non = 0;
          }
          if (typeof total === 'undefined') {
            total = 0;
          }
          if (typeof train === 'undefined') {
            train = 0;
          }

          if (mgrLookup[name]===mgr) {
            //report = report + truncText(name,40) + ' NET =  ' + net + '&emsp; &emsp; [ Earned=' + earned + ' Used=' + used +  '] <br>';

            let style='';
            if (parseInt(total)<36) {style=' style="color:red"';}
            else if (parseInt(total)>44) {style=' style="color:blue"';}

            if (!self.get('missing') || (parseInt(total)<36))
            {
              report = report + '<tr>';
              report = report + '<td' + style + '>' + name + '</td>';
              report = report + '<td' + style + '>' + total + '</td>';
              report = report + '<td' + style + '>' + hrs + '</td>';
              report = report + '<td' + style + '>' + non + '</td>';
              report = report + '<td' + style + '>' + vac + '</td>';
              report = report + '<td' + style + '>' + pe + '</td>';
              report = report + '<td' + style + '>' + hol + '</td>';
              report = report + '<td' + style + '>' + flex + '</td>';
              report = report + '<td' + style + '>' + train + '</td>';
              report = report + '</tr>';
            }
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

function subVal(assoc,key,val){
  if (assoc.hasOwnProperty(key)) {
    assoc[key] = assoc[key] - parseFloat(val);
  }
  else {
    assoc[key] = -parseFloat(val);
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
