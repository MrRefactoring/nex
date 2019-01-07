import { computed } from '@ember/object';
import Controller from '@ember/controller';
import {getTodaySortable} from '../utils/functions';

export default Controller.extend({
  processed:'',
  debug:false,
  imported:false,

  excludePartial:true,
  shortOnly:false,
  hideDisabled:true,
  csv:false,
  timeData: '',
  refresh:false,
  mgr:'ALL',
  unitFilter:'ALL',
  mgrList:['ALL'],
  nameList:'',
  type:'YTD',
  report:'',
  searchWeek:'02/26/2018 - 03/04/2018',
  searchMonth:1,
  mmSearch:'01',
  ddSearch:'01',
  yySearch:'2018',
  weekList18: ['01/01/2018 - 01/07/2018','01/08/2018 - 01/14/2018','01/15/2018 - 01/21/2018','01/22/2018 - 01/28/2018',
    '01/29/2018 - 02/04/2018','02/05/2018 - 02/11/2018','02/12/2018 - 02/18/2018','02/19/2018 - 02/25/2018',
    '02/26/2018 - 03/04/2018','03/05/2018 - 03/11/2018','03/12/2018 - 03/18/2018','03/19/2018 - 03/25/2018',
    '03/26/2018 - 04/01/2018','04/02/2018 - 04/08/2018','04/09/2018 - 04/15/2018','04/16/2018 - 04/22/2018',
    '04/23/2018 - 04/29/2018','04/30/2018 - 05/06/2018','05/07/2018 - 05/13/2018','05/14/2018 - 05/20/2018',
    '05/21/2018 - 05/27/2018','05/28/2018 - 06/03/2018','06/04/2018 - 06/10/2018','06/11/2018 - 06/17/2018',
    '06/18/2018 - 06/24/2018','06/25/2018 - 07/01/2018','07/02/2018 - 07/08/2018','07/09/2018 - 07/15/2018',
    '07/16/2018 - 07/22/2018','07/23/2018 - 07/29/2018','07/30/2018 - 08/05/2018','08/06/2018 - 08/12/2018',
    '08/13/2018 - 08/19/2018','08/20/2018 - 08/26/2018','08/27/2018 - 09/02/2018','09/03/2018 - 09/09/2018',
    '09/10/2018 - 09/16/2018','09/17/2018 - 09/23/2018','09/24/2018 - 09/30/2018','10/01/2018 - 10/07/2018',
    '10/08/2018 - 10/14/2018','10/15/2018 - 10/21/2018','10/22/2018 - 10/28/2018','10/29/2018 - 11/04/2018',
    '11/05/2018 - 11/11/2018','11/12/2018 - 11/18/2018','11/19/2018 - 11/25/2018','11/26/2018 - 12/02/2018',
    '12/03/2018 - 12/09/2018','12/10/2018 - 12/16/2018','12/17/2018 - 12/23/2018','12/24/2018 - 12/30/2018',
  ],
  weekList19: ['01/01/2019 - 01/06/2019','01/07/2019 - 01/13/2019','01/14/2019 - 01/20/2019','01/21/2019 - 01/27/2019',
    '01/28/2019 - 02/03/2019','02/04/2019 - 02/10/2019','02/11/2019 - 02/17/2019','02/18/2019 - 02/24/2019',
    '02/25/2019 - 03/03/2019','03/04/2019 - 03/10/2019','03/11/2019 - 03/17/2019','03/18/2019 - 03/24/2019',
    '03/25/2019 - 03/31/2019','04/01/2019 - 04/07/2019','04/08/2019 - 04/14/2019','04/15/2019 - 04/21/2019',
    '04/22/2019 - 04/28/2019','04/29/2019 - 05/05/2019','05/06/2019 - 05/12/2019','05/13/2019 - 05/19/2019',
    '05/20/2019 - 05/26/2019','05/27/2019 - 06/02/2019','06/03/2019 - 06/09/2019','06/10/2019 - 06/16/2019',
    '06/17/2019 - 06/23/2019','06/24/2019 - 06/30/2019','07/01/2019 - 07/07/2019','07/08/2019 - 07/14/2019',
    '07/15/2019 - 07/21/2019','07/22/2019 - 07/28/2019','07/29/2019 - 08/04/2019','08/05/2019 - 08/11/2019',
    '08/12/2019 - 08/18/2019','08/19/2019 - 08/25/2019','08/26/2019 - 09/01/2019','09/02/2019 - 09/08/2019',
    '09/09/2019 - 09/15/2019','09/16/2019 - 09/22/2019','09/23/2019 - 09/29/2019','09/30/2019 - 10/06/2019',
    '10/07/2019 - 10/13/2019','10/14/2019 - 10/20/2019','10/21/2019 - 10/27/2019','10/28/2019 - 11/03/2019',
    '11/04/2019 - 11/10/2019','11/11/2019 - 11/17/2019','11/18/2019 - 11/24/2019','11/25/2019 - 12/01/2019',
    '12/02/2019 - 12/08/2019','12/09/2019 - 12/15/2019','12/16/2019 - 12/22/2019','12/23/2019 - 12/29/2019',
  ],
  monthList:[1,2,3,4,5,6,7,8,9,10,11,12],
  yearList:['2018','2019'],
  mmList:['01','02','03','04','05','06','07','08','09','10','11','12'],
  ddList:['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20',
          '21','22','23','24','25','26','27','28','29','30','31'],
  yyList:['2018','2019','2020'],
  units:['ALL','Unit 1 - RF','Unit 2 - AS','Unit 5 - JI'],
  update: computed('searchWeek', 'searchMonth','searchDate','yySearch','mgr','shortOnly', 'hideDisabled',
    'excludePartial', 'type', 'unitFilter', function () {
    console.log('Update');
    this.send('filter');
    return this.get('shortOnly');
  }),
  searchDate: computed('mmSearch', 'ddSearch','yySearch', function () {
      return this.get('mmSearch')+'/'+this.get('ddSearch')+'/'+this.get('yySearch');
    }),
  weekList: computed('yySearch', function () {
    if (this.get('yySearch')==='2018') {return this.get('weekList18');}
    else return this.get('weekList19');
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
      let unpaid={};
      let submittedHrs={};
      let rejectedHrs={};
      let draftHrs={};
      let billingDays={};
      let billingCount={};
      let csvReport='';

      // For Importing Data
      let str1='';
      let str2 = '';
      let strDetail='';
      let lines = data.split('\n');
      let count = 1;

      // TOTALS
      let vacCount=0;
      let lostCount=0;
      let billDaysCount=0;
      let billDaysTotal=0.0;
      let billHrCount=0;
      let billHrTotal=0.0;

      let vacTot=0;
      let billTot=0;
      let persTot=0;
      let trainTot=0;
      let flexEarnTot=0;
      let flexUsedTot=0;
      let holTot=0;
      let empTot=0;
      let unpaidTot=0;

      // flags
      let byDay = this.get('type')==='DAY';
      let byWeek = this.get('type')==='WEEK';
      let byMonth = this.get('type')==='MONTH';
      let byYTD = this.get('type')==='YTD';

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

        let dateData = date.split('/');
        let mm = parseInt(dateData[0]);
        let dd = parseInt(dateData[1]);
        let yyyy = parseInt(dateData[2]);

        if (name === 'User') header = true;

        let dateMatch=(byWeek && week===self.get('searchWeek')) ||
          (byDay && date===self.get('searchDate')) ||
          (byYTD) ||
          (byMonth && self.get('searchMonth')===mm);

        let unitMatch=(self.get('unitFilter')==='ALL' || self.get('unitFilter')===unit);

        // Save data for current week / YTD
        let matched=(!header) && dateMatch && unitMatch;

        if (matched) {
          mgrLookup[name] = mgr;  //build manager lookup table

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
          else if (project === '~UT999 - Unpaid Time Off') {
            addVal(unpaid, name, hours);
          }
          else if (project === '~LOA999 - Leave of Absence') {
            addVal(unpaid, name, hours);  //LOA = unpaid
          }
          else if (project === '~OH999 - Overhead') {
            // do nothing
          }
          else if (project === '~IV999 - Interviewing') {
            // do nothing
          }
          else if (billable === 'No') {
            addVal(nonBillable, name, hours);
          }
          else if (billable === 'Yes') {
            addVal(billedHrs, name, hours);
            if (hours>5) {
              addVal(billingDays,name,1);
              addVal(billingCount,name,hours);
            }
          }

          // Total Hours
          if (project !== '~FXearned - Flex Time Earned') {
            if (status === 'Approved') {
              addVal(approvedHrs, name, hours);
            }
            else if (status === 'Draft') {
              addVal(draftHrs, name, hours);
            }
            else if (status === 'Rejected') {
              addVal(rejectedHrs, name, hours);
            }
            else if (status === 'Submitted') {
              addVal(submittedHrs, name, hours);
            }

            // TOTAL HRS
            addVal(totalHrs,name,hours);
          }
        }
      });
      if (this.get('debug')) {
        alert(strDetail);
      }
      this.set('processed', str1);

      // Final List
      let report = '';
      let csvData='';

      mgrList.forEach(function (mgr) {
        if (self.get('mgr') === 'ALL' || self.get('mgr') === mgr) {

          let header = '';
          let tableData = '';

          // Create Header Rows
          header = header + '<table style="width:70%">';
          header = header + '<tr>' + '<th style="width:25%">' + 'Manager: ' + mgr + '</th>';
          header = header + '<th style="text-align: center;width:5%">APPROVED</th>';
          header = header + '<th style="text-align: center;width:5%">Submit</th>';
          header = header + '<th style="text-align: center;width:5%">Draft</th>';
          header = header + '<th style="text-align: center;width:5%">Rej</th>';
          header = header + '<th style="text-align: center;width:5%">Total</th>';
          header = header + '<th style="text-align: center;width:5%">Billed</th>';
          header = header + '<th style="text-align: center;width:5%">Vac</th>';
          header = header + '<th style="text-align: center;width:5%">Per</th>';
          header = header + '<th style="text-align: center;width:5%">Hol</th>';
          header = header + '<th style="text-align: center;width:5%">Net Flex</th>';
          header = header + '<th style="text-align: center;width:5%">Flex Earned</th>';
          header = header + '<th style="text-align: center;width:5%">Flex Taken</th>';
          header = header + '<th style="text-align: center;width:5%">Train</th>';
          header = header + '<th style="text-align: center;width:5%">UnPaid</th>';
          header = header + '<th style="text-align: center;width:5%">Other Unbilled</th>';
          header = header + '<th style="text-align: center;width:5%">Bill Days</th>';
          header = header + '<th style="text-align: center;width:5%">Bill Avg</th>';
          header = header + '</tr>';

          let csvHeader= 'Employee,Manager,APPROVED,submit,Draft,Rej,Total,Billed,Vac,Per,Hol,Net Flex,Flex Earned,Flex Taken,'+
            'Train,Unpaid,Other Unbilled,Bill Days,Bill Avg<br>';

          nameList.forEach(function (name) {
            if (mgrLookup[name] === mgr) {
              let style = ' style="text-align:center"';
              let nameStyle='';
              let partial=false;

              if (self.get('type')==='WEEK') {
                if (parseInt(get(approvedHrs[name])) < 36) {
                  nameStyle = ' style="color:red"';
                  partial=true;
                }
                else if (parseInt(get(approvedHrs[name])) > 45) {
                  nameStyle = ' style="color:blue"';
                }
              }

              else if (self.get('type')==='MONTH') {
                if (parseInt(get(approvedHrs[name])) < 160) {
                  nameStyle = ' style="color:red"';
                  partial=true;
                }
                else if (parseInt(get(approvedHrs[name])) > 200) {
                  nameStyle = ' style="color:blue"';
                }
              }

              else if (self.get('type')==='DAY') {
                if (parseInt(get(approvedHrs[name])) < 6) {
                  nameStyle = ' style="color:red"';
                  partial=true;
                }
                else if (parseInt(get(approvedHrs[name])) > 9) {
                  nameStyle = ' style="color:blue"';
                }
              }

              else if (self.get('type')==='YTD') {
                if (parseInt(get(approvedHrs[name])) < 1600) {
                  nameStyle = ' style="color:red"';
                  partial=true;
                }
                else if (parseInt(get(approvedHrs[name])) > 2000) {
                  nameStyle = ' style="color:blue"';
                }
              }

              if (!self.get('shortOnly') || partial){   // Reject Partial if needed
                let disabled= (self.get('hideDisabled') && name.includes('(Disabled)'));
                let excluded= (self.get('excludePartial') && partial );
                if (!disabled && !excluded) {

                  // Set Averages
                  let billAvg=0.0;
                  if (get(billingDays[name])>0) {
                    billAvg = get(billingCount[name])/parseFloat(get(billingDays[name]));
                    billAvg=billAvg.toFixed(2);
                  }

                  // Set Billing Data (after averages are known)
                  let billDays = parseFloat(get(billingDays[name]));

                  // Set Total Counts
                  vacCount=vacCount+get(vacation[name])+get(personal[name]);
                  lostCount=lostCount+get(vacation[name])+get(personal[name])+
                    get(nonBillable[name])+get(flexUsed[name])+get(holidays[name]);

                  empTot++;
                  vacTot+=get(vacation[name]);
                  persTot+=get(personal[name]);
                  trainTot+=get(training[name]);
                  flexEarnTot+=get(flexEarned[name]);
                  flexUsedTot+=get(flexUsed[name]);
                  holTot+=get(holidays[name]);
                  trainTot+=get(training[name]);
                  billTot+=get(billedHrs[name]);
                  unpaidTot+=get(unpaid[name]);

                  if (byDay || (byWeek && billDays>4) || (byMonth && billDays>16) || (byYTD && billDays>185)) {
                    billDaysTotal = billDaysTotal + billDays;
                    billDaysCount++;
                  }

                  if (billAvg>7.5) {
                    billHrTotal = billHrTotal + parseFloat(billAvg);
                    billHrCount++;
                  }

                  // Create Table Row
                  tableData = tableData + '<tr>';
                  tableData = tableData + '<td' + nameStyle + '>' + name + '</td>';
                  tableData = tableData + '<td' + style + '><b>' + get(approvedHrs[name]) + '</b></td>';
                  tableData = tableData + '<td' + style + '>' + get(submittedHrs[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(draftHrs[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(rejectedHrs[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(totalHrs[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(billedHrs[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(vacation[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(personal[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(holidays[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(netFlex[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(flexEarned[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(flexUsed[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(training[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(unpaid[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(nonBillable[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + get(billingDays[name]) + '</td>';
                  tableData = tableData + '<td' + style + '>' + billAvg + '</td>';
                  tableData = tableData + '</tr>';


                  csvData = csvData + name + ',';
                  csvData = csvData + mgr + ',';
                  csvData = csvData + get(approvedHrs[name]) + ',';
                  csvData = csvData + get(submittedHrs[name]) + ',';
                  csvData = csvData + get(draftHrs[name]) + ',';
                  csvData = csvData + get(rejectedHrs[name]) + ',';
                  csvData = csvData + get(totalHrs[name]) + ',';
                  csvData = csvData + get(billedHrs[name]) + ',';
                  csvData = csvData + get(vacation[name]) + ',';
                  csvData = csvData + get(personal[name]) + ',';
                  csvData = csvData + get(holidays[name]) + ',';
                  csvData = csvData + get(netFlex[name]) + ',';
                  csvData = csvData + get(flexEarned[name]) + ',';
                  csvData = csvData + get(flexUsed[name]) + ',';
                  csvData = csvData + get(training[name]) + ',';
                  csvData = csvData + get(unpaid[name]) + ',';
                  csvData = csvData + get(nonBillable[name]) + ',';
                  csvData = csvData + get(billingDays[name]) + ',';
                  csvData = csvData + billAvg + '<br>';


                }
              }
            }
          });

          if (tableData !== '') {
            report = report + header + tableData + '</table>' + '<br>';
          }

          csvReport = csvHeader+csvData;
        }
      });

      // compute totals
      let vacDays = 0.0;
      if (empTot>0) {
        vacDays = vacCount/empTot/8.0;
        vacDays = vacDays.toFixed(2);
      }

      let lostDays = 0.0;
      if (empTot>0) {
        lostDays = lostCount/empTot/8.0;
        lostDays = lostDays.toFixed(2);
      }

      let billAvg=0.0;
      if (billHrCount>0){
        billAvg = billHrTotal/billHrCount;
        billAvg=billAvg.toFixed(2);
      }

      let billAvgEmp=0.0;
      if (empTot>0){
        billAvgEmp = billTot/empTot;
        billAvgEmp=billAvgEmp.toFixed(0);
      }

      let billDays=0.0;
      if (billDaysCount>0){
        billDays = billDaysTotal/billDaysCount;
        billDays=billDays.toFixed(1);
      }

      let flexUsedAvg=0.0;
      if (empTot>0){
        flexUsedAvg = flexUsedTot/empTot/8.0;
        flexUsedAvg=flexUsedAvg.toFixed(1);
      }

      let flexEarnAvg=0.0;
      if (empTot>0){
        flexEarnAvg = flexEarnTot/empTot/8.0;
        flexEarnAvg=flexEarnAvg.toFixed(1);
      }

      let persAvg=0.0;
      if (empTot>0){
        persAvg = persTot/empTot/8.0;
        persAvg=persAvg.toFixed(1);
      }

      let vacAvg=0.0;
      if (empTot>0){
        vacAvg = vacTot/empTot/8.0;
        vacAvg=vacAvg.toFixed(1);
      }

      let holAvg=0.0;
      if (empTot>0){
        holAvg = holTot/empTot/8.0;
        holAvg=holAvg.toFixed(1);
      }

      let trainAvg=0.0;
      if (empTot>0){
        trainAvg = trainTot/empTot/8.0;
        trainAvg=trainAvg.toFixed(1);
      }

      let unpaidAvg=0.0;
      if (empTot>0){
        unpaidAvg = unpaidTot/empTot/8.0;
        unpaidAvg=unpaidAvg.toFixed(1);
      }

      this.set('report',{table:report, billCount:billHrCount, vacCount:vacCount,
        vacDays:vacDays, lostDays:lostDays, billAvg:billAvg, billDays:billDays,
        flexUsedTotal:flexUsedTot, flexEarnedTotal:flexEarnTot,vacTotal:vacTot,persTotal:persTot,
        flexUsedAvg:flexUsedAvg, flexEarnedAvg:flexEarnAvg,vacAvg:vacAvg,persAvg:persAvg,
        holTotal:holTot, holAvg:holAvg,trainTotal:trainTot, trainAvg:trainAvg, billTot:billTot.toFixed(0),
        empTotal:empTot, unpaidTotal:unpaidTot, unpaidAvg:unpaidAvg, lineCount:count, billAvgEmp:billAvgEmp,
        csvReport: csvReport
      });
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
