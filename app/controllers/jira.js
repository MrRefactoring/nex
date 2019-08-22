import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  viewType:'Search',
  groupFilter:'SYSTEMS ENGINEER',
  hrFilter:'ALL',
  expFilter:'Mid Level 1 (3-4)',
  mgr2Filter:'ALL',
  yearFilter:'ALL',
  qtrFilter: 'ALL',
  domainList:['ADAS','SYSTEMS ENGINEER','DRE','RESIDENT','PRODUCT DESIGN ENGINEER','VALIDATION',
    'INFOTAINMENT','POWERTRAIN','IT','SOFTWARE','MECHANICAL','WIRING/EDS','CONNECTIVITY',
    'POWER ELECTRONICS DESIGN/CONTROL','AEROSPACE-DEFENSE SYSTEMS',
    'ENTRY PLUS','ENTRY LEVEL','INTERNSHIP','OTHER','RECENT GRADUATE'],
  expList:['ALL','Entry Level','Entry Plus','Junior (1-2 years)','Mid Level 1 (3-4)','Mid Level 2 (5-7)', 'Senior (8+)'],
  hrList:['ALL','julia.taylor','lexie.fiema','megan.tomasi'],
  mgr2List:['ALL','john.podolan','jeff.lindgren','aarathi.padmanabhan','laya.ramos','sanjay.pinjarkar','aneil.shah'],
  mgr5List:['ALL','joe.issa','jason.kotsonas','brad.white','samir.zotti','chet.olszewski','sarvesh.sharma'],
  yearList:['ALL','2019','2018','2017','2016','2015'],
  qtrList: ['ALL','Q1','Q2','Q3','Q4'],
  actions: {
    missingHRScreenBy(){
      let qr = defaultFilter() + ' AND "HR Screen By" is EMPTY';

      qr = qr + hrScreenBy(this);
      qr = qr + orderBy();
      openQuery(qr);
    },

    openActiveQtr(){
      openQuery(defaultFilter() + active() + dateQtr(this) + orderBy2());
    },
    openAllQtr(){
      openQuery(defaultFilter() + dateQtr(this) + orderBy2());
    },

    open2019Active(){
      openQuery(defaultFilter() + active() + dateGT('2019') + orderBy2());
    },

    openBlankLinkedIn(){
      openQuery(defaultFilter() + active() + ' AND "LinkedIn URL" is EMPTY'+
        yearFilter(this) + orderBy2());
    },
    openOtherLinkedIn(){
      openQuery(defaultFilter() + active() + ' AND "LinkedIn URL" ~ "https://example.com"'+
        yearFilter(this) + orderBy2());
    },

    openMissingComments(){
      let qr = defaultFilter()+
        ' AND status in (Active, "Verbal Offer", "EAR Submitted") AND "HR Screening Status" = "Missing Comments"';

      qr = qr + hrScreenBy(this);
      qr = qr + orderBy();
      openQuery(qr);
    },
    openScreenCompletedNewton(){
      let qr = defaultFilter()+
        ' AND "HR Screening Status" = "Screening Completed" AND "Location Preference" is EMPTY';

      qr = qr + hrScreenBy(this) + orderBy();
      openQuery(qr);
    },
    openScreenCompletedNotesJira(){
      let qr = defaultFilter()+ hrScreenComplete()+ 'AND "Location Preference" is not EMPTY';
      qr = qr + hrScreenBy(this) + orderBy();
      openQuery(qr);
    },
    openScreenCompletedJira(){
      let qr = defaultFilter()+ hrScreenComplete() + hrScreenBy(this) + orderBy();
      openQuery(qr);
    },
    openScreenScheduled(){
      let qr = defaultFilter()+ ' AND "HR Screening Status" = "Screening Scheduled"' + active();

      qr=qr+dateGT('2019');
      qr = qr + hrScreenBy(this) + orderBy();
      openQuery(qr);
     },
    openNoScreen(){
      let qr = defaultFilter() + ' AND "HR Screening Status" = "Not Screened"';
      qr=qr+dateGT('2019')+ hrScreenBy(this) + orderBy();
      openQuery(qr);
     },
    openUnit2WorthReview(){
      let qr = defaultFilter() + ' AND "Unit 2 - Interest" = "Worth Review"'+active();

      qr = qr + managerFilter(this);
      qr = qr + orderBy();
      openQuery(qr);
    },
    openUnit2Interview(){
      let qr = defaultFilter() + ' AND "Unit 2 - Interest" = "Worth Interviewing"'+active();
      qr = qr + managerFilter(this)+orderBy();

      openQuery(qr);
    },
    openUnit5Interview(){
      let qr = defaultFilter() + ' AND "Unit 5 - Interest" = "Worth Interviewing"'+active();
      qr = qr + managerFilter(this)+orderBy();
      openQuery(qr);
    },
    openUnit2Hireable(){
      let qr=defaultFilter() + ' AND "Unit 2 - Interest" = "Hirable"'+ active();
      qr = qr + managerFilter(this)+orderBy();
      openQuery(qr);
    },
    openActiveUnit2Rej(){
      openQuery(defaultFilter() + ' AND "Unit 2 - Interest" not in (Hirable,Backburner,"Not Reviewed","On Hold",' +
        '"Worth Interviewing")' + active() + orderBy());
    },
    openActiveUnit2RejBCA(){
      openQuery(defaultFilter() + ' AND "Unit 2 - Interest" in ("Rejected - Better candidates available with similar skillset")'+
        active() + orderBy());
    },
    openActiveUnit2NotRej(){
      openQuery(defaultFilter() + ' AND "Unit 2 - Interest" in (Hirable,Backburner,"Not Reviewed","On Hold",' +
        '"Worth Interviewing")'+ active() + orderBy());
    },

    openActive(){
      openQuery(defaultFilter() + active()+ yearFilter(this) + orderBy2());
    },
    openUnavailable(){
      openQuery(defaultFilter() + yearFilter(this) +
        ' AND status = "Company-Wide Unavailable"' + orderBy2());
    },
    openRejected(){
      openQuery(defaultFilter() + yearFilter(this) +
        ' AND status = "Company-Wide Rejected"' + orderBy2());
    },
    openHired(){
      openQuery(defaultFilter() + yearFilter(this) +
        ' AND status = Hired' + orderBy2());
    },
    openNewActive(){
      openQuery(defaultFilter() + _new() + active() +
        ' AND "Date Added to Newton" >= 2019-01-01' + orderBy2());
    },
    openSearchHire(param){

      let qr = 'project = REC AND "Domain Skills" = "'+this.get('groupFilter')+ '"'+
        expFilter(this)+ active();
      if (param==='unit2Hireable') qr=qr+' AND "Unit 2 - Interest" = Hirable';
      if (param==='unit2Active') qr=qr+' AND "Unit 2 - Interest" in (Hirable,"Not Reviewed","On Hold","Worth Interviewing","Backburner")';
      qr = qr + ' ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC';
      openQuery(qr);
    },

    setView(newView){
      this.set('viewType',newView);
    }
  }
});

function openQuery(query){
  window.open('https://esgautomotive.atlassian.net/issues/?jql='+query);
}

function defaultFilter(){
  return 'project = REC';
}

function orderBy(){
  return ' ORDER BY cf[11113] ASC, "Date Added to Newton" DESC, cf[10858] DESC, key DESC';
}

function orderBy2(){
  return ' ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC';
}

function dateGT(year){
  return ' AND "Date Added to Newton" >= '+year+'-01-01';
}

function dateQtr(context){
  let year=context.get('yearFilter');

  if (year!=='ALL'){
    if (context.get('qtrFilter')==='ALL')
    {
      return ' AND "Date Added to Newton" >= '+year+'-01-01 AND "Date Added to Newton" <= '+year+'-12-31 ';
    }
    else if (context.get('qtrFilter')==='Q1')
    {
      return ' AND "Date Added to Newton" >= '+year+'-01-01 AND "Date Added to Newton" < '+year+'-04-01 ';
    }
    else if (context.get('qtrFilter')==='Q2')
    {
      return ' AND "Date Added to Newton" >= '+year+'-04-01 AND "Date Added to Newton" < '+year+'-07-01 ';
    }
    else if (context.get('qtrFilter')==='Q3')
    {
      return ' AND "Date Added to Newton" >= '+year+'-07-01 AND "Date Added to Newton" < '+year+'-10-01 ';
    }
    else if (context.get('qtrFilter')==='Q4')
    {
      return ' AND "Date Added to Newton" >= '+year+'-10-01 AND "Date Added to Newton" <= '+year+'-12-31 ';
    }
  }
  else return '';
}

function active(){
  return ' AND status = Active';
}

function activeUnit2(){
  return ' AND "Unit 2 - Interest" in ("Not Reviewed", "Worth Interviewing", Hirable)'
}

function hrScreenBy(context){
  if (context.get('hrFilter')!=='ALL') {
    return ' AND "HR Screen By" = ' + context.get('hrFilter');
  }
  else {
    return '';
  }
}

function hrScreenComplete(){
  return ' AND "HR Screening Status" = "Screening Completed"';
}

function _new(){
  return ' AND "Domain Skills" = New';
}

function expFilter(context){
  if (context.get('expFilter')!=='ALL'){
    let expFilter=context.get('expFilter').replace('+','%2B');
    return ' AND "Experience" = "'+expFilter+'"';
  }
  else {
    return '';
  }
}

function managerFilter(context){
  if (context.get('mgr2Filter')!=='ALL'){
    return ' AND "Unit 2 - Manager" = '+this.get('mgr2Filter');
  }
  else {
    return '';
  }
}

function yearFilter(context){
  if (context.get('yearFilter')!=='ALL'){
    return ' AND "Date Added to Newton" >= ' + context.get('yearFilter') + '-01-01'+
      ' AND "Date Added to Newton" <= ' + context.get('yearFilter') + '-12-31';
  }
  else {
    return '';
  }
}
