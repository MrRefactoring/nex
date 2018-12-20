import { computed } from '@ember/object';
import Controller from '@ember/controller';
import {getTodaySortable} from '../utils/functions';

export default Controller.extend({
  processed:'',
  debug:false,
  imported:false,

  hideDisabled:true,
  timeData: '',
  refresh:false,
  mgr:'ALL',
  mgrList:['ALL'],
  nameList:'',
  report:'',
  update: computed('mgr', 'hideDisabled', 'type', function () {
    this.send('filter');
    console.log('update');
    return this.get('hideDisabled');
  }),
  actions: {
    loadData(data){
      console.log('loadData');
      this.set('timeData',data);
      this.set('imported',true);
      this.send('getEmployees',data);
      this.send('filter');
    },
    getEmployees(data){
      console.log('getEmployees');
      let nameList={};
      let mgrList={};
      let mgrLookup={};

      let lines = data.split('\n');
      lines.forEach(function (line) {
        let name = '';
        let mgr = '';
        line = line.replace(/","/g, "^");  //change <","> to <^>
        line = line.replace(/"/g, "");       //remove <">
        let importData = line.split('^');  //split on <^>
        let i = 0;  // data field count

        importData.forEach(function (item) {
          item = item.trim();
          item = item.replace(/, /g, "_"); //replace <,>with <_>

          if (i === 1) {
            name = item;
          }
          else if (i === 11) {
            mgr = item;
          }
          i++;
        });
        if (name !== 'User') {
          nameList[name] = name;
          mgrList[mgr] = mgr;
          mgrLookup[name] = mgr;
        }
      });
      this.set('nameList',getKeys(nameList));
      this.set('mgrList',['ALL'].concat(getKeys(mgrList)));
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
      let submitDate = '';

      /// For Report
      let billedHrs={};
      let totalHrs={};
      let approvedHrs={};
      let nameList=this.get('nameList');
      let mgrList=this.get('mgrList');
      let mgrLookup={};
      let vacation={};
      let personal={};
      let holidays={};
      let netFlex={};
      let flexUsed={};
      let flexEarned={};
      let nonBillable={};
      let training={};
      let submitCount={};
      let submitTimeDelta={};

      // For Importing Data
      let str1='';
      let str2 = '';
      let strDetail='';
      let txt = '';
      let lines = data.split('\n');
      let count = 1;
      let context=this;   //need to use this in inner functions
      let dbReq=null;

      // TOTALS
      let empCount = 0;
      let billedCount=0;
      let vacCount=0;
      let submitDelta=0;

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
          else if (i === 18) {
            //country code
          }
          else if (i === 19) {
            //country
          }
          else if (i === 20) {
            submitDate = item;
          }

          i++;
        });

        if (name === 'User') header = true;

        if (!header) {
          mgrLookup[name] = mgr;  //build manager lookup table

          // Get mm/dd/yyyy
          let dateData = date.split('/');
          let mm = parseInt(dateData[0]);
          let dd = parseInt(dateData[1]);
          let yyyy = parseInt(dateData[2]);

          // Get week start/ending date
          let weekData = week.split(' - ');
          let weekStart = weekData[0];
          let weekEnd = weekData[1];
          submitDelta = deltaDate(weekEnd,submitDate);
          submitDelta=submitDelta-1;  // Monday is OK for week ending Sunday
          if (submitDelta<0) {submitDelta=0;}
        }

        // Save data for current week / YTD
        let matched=(!header);

        if (matched) {
          if (count <= 10) {
            str2 = str2 + count + ` ADDED: ${name},${project},${date},${hours},${mgr},${week}\n`;
          }
          str1 = str1 + count + ` ADDED: ${name},${project},${date},${hours},${mgr},${week},${billable}\n`;
          if (count === 1) {
            strDetail = strDetail + 'TIMECARD IMPORT DETAIL:\n';
            strDetail = strDetail + 'UNIT: ' + unit + '\n';
            strDetail = strDetail + 'NAME: ' + name + '\n';
            strDetail = strDetail + 'PROJECT: ' + project + '\n';
            strDetail = strDetail + 'DATE: ' + date + '\n';
            strDetail = strDetail + 'BILLABLE: ' + billable + '\n';
            strDetail = strDetail + 'STATUS: ' + status + '\n';
            strDetail = strDetail + 'MEMO: ' + memo + '\n';
            strDetail = strDetail + 'HOURS: ' + hours + '\n';
            strDetail = strDetail + 'MGR: ' + mgr + '\n';
            strDetail = strDetail + 'WEEK: ' + week + '\n';
          }
          count++;

          if (project === '~VA999 - Vacation') {
            addVal(vacation, name, hours);
          }
          else if (project === '~HL999 - Holiday') {
            addVal(holidays, name, hours);
          }
          else if (project === '~PE999 - Personal time') {
            addVal(personal, name, hours);
          }
          else if (project === '~TR999 - Training') {
            addVal(training, name, hours);
          }
          else if (project === '~FXused - Flex Time Used') {
            subVal(netFlex, name, hours);
            addVal(flexUsed, name, hours);
          }
          else if (project === '~FXearned - Flex Time Earned') {
            addVal(netFlex, name, hours);
            addVal(flexEarned, name,hours);
          }
          else if (project === '~TR999 - Training') {
            addVal(training, name, hours);
          }
          else if (billable === 'No') {
            addVal(nonBillable, name, hours);
          }
          else if (billable === 'Yes') {
            addVal(billedHrs, name, hours);
          }

          // Total Hours
          if (project !== '~FXearned - Flex Time Earned') {
            if (status === 'Approved') {
              addVal(approvedHrs, name, hours);
            }

            // TOTAL HRS
            addVal(totalHrs,name,hours);

            //Submit Deltas
            addVal(submitCount,name,1);
            addVal(submitTimeDelta,name,submitDelta);
          }
        }
      });
      if (this.get('debug')) {
        alert(strDetail);
      }
      this.set('processed', str1);

      // Final List
      let report = '';
      mgrList.forEach(function (mgr) {
        if (self.get('mgr') === 'ALL' || self.get('mgr') === mgr) {

          let header = '';
          let tableData = '';
          // Create Header Rows
          header = header + '<table style="width:70%">';
          header = header + '<tr>' + '<th style="width:25%">' + 'Manager: ' + mgr + '</th>';
          header = header + '<th style="text-align: center;width:5%">APPROVED</th>';
          header = header + '<th style="text-align: center;width:5%">Total</th>';
          header = header + '<th style="text-align: center;width:5%">Billed</th>';
          header = header + '<th style="text-align: center;width:5%">Non-Bill</th>';
          header = header + '<th style="text-align: center;width:5%">Submits</th>';
          header = header + '<th style="text-align: center;width:5%">Total Delta</th>';
          header = header + '<th style="text-align: center;width:5%">Avg Delay</th>';

          header = header + '</tr>';

          nameList.forEach(function (name) {
            if (mgrLookup[name] === mgr) {
              let style = ' style="text-align:center"';
              let nameStyle='';
              let partial=false;

              if (parseInt(get(approvedHrs[name])) < 1600) {
                  nameStyle = ' style="color:red"';
                  partial=true;
              }
              else if (parseInt(get(approvedHrs[name])) > 2000) {
                  nameStyle = ' style="color:blue"';
              }

              if (true){
                let disabled= (self.get('hideDisabled') && name.includes('(Disabled)'));
                if (!self.get('hideDisabled') || !disabled) {

                  // Set Total Counts
                  empCount++;
                  billedCount=billedCount+get(billedHrs[name]);
                  vacCount=vacCount+get(vacation[name])+get(personal[name]);

                  //Set Avg Submit Time
                  let submitAvg=0.0;
                  if (submitCount[name]>1) {
                    submitAvg=parseFloat(submitTimeDelta[name]/submitCount[name]);
                    submitAvg=submitAvg.toFixed(1);
                  }

                  // Create Table Row
                  tableData = tableData + '<tr>';
                  tableData = tableData + '<td' + nameStyle + '>' + name + '</td>';
                  tableData = tableData + '<td' + style + '><b>' + get(approvedHrs[name]) + '</b></td>';
                  tableData = tableData + '<td' + style + '>' + get(totalHrs[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(billedHrs[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(nonBillable[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(submitCount[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(submitTimeDelta[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + submitAvg + '</td>';

                  tableData = tableData + '</tr>';
                }
              }
            }
          });

          if (tableData !== '') {
            report = report + header + tableData + '</table>' + '<br>';
          }
        }
      });

      // compute totals
      let vacDays = 0.0;
      if (empCount>0) {
        vacDays = vacCount/empCount/8.0;
        vacDays = vacDays.toFixed(1);
      }


      this.set('report',{table:report, empCount:empCount, billedCount:billedCount, vacCount:vacCount,
                          vacDays:vacDays});
    },
    process([file]) {
      let self = this;
      let reader = new FileReader();

      reader.onload = function (e) {
        self.send('loadData', reader.result);
      };
      reader.readAsText(file);
    },
    setType(txt){
      this.set('type',txt);
    }
  }
});

function addItem(assoc, key) {
  if (assoc.hasOwnProperty(key)) {
    assoc[key] = assoc[key] + 1;
  }
  else {
    assoc[key] = 1;
  }
}

function addVal(assoc, key, val) {
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

function get(val){
  if (typeof val === 'undefined') {return 0;}
  else return val;
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

function getKeys(assoc){
  let arr = []; // Array

  // Save in Array
  Object.keys(assoc).forEach(function (item) {
    arr.push(item);
  });
  return arr;
}

function deltaDate(dateFrom, dateTo){
  let date1 = dateFrom.split('/');
  let mmFrom = parseInt(date1[0]);
  let ddFrom = parseInt(date1[1]);
  let yyyyFrom = parseInt(date1[2]);

  let date2 = dateTo.split('/');
  let mmTo = parseInt(date2[0]);
  let ddTo = parseInt(date2[1]);
  let yyyyTo = parseInt(date2[2]);

  let delta=365*(yyyyTo-yyyyFrom)+30*(mmTo-mmFrom)+ddTo-ddFrom;
  return delta;
}
