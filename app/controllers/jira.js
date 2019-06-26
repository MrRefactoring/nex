import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  viewType:'ESG',
  groupFilter:'SYSTEMS ENGINEER',
  hrFilter:'ALL',
  expFilter:'Entry Plus',
  mgr2Filter:'ALL',
  domainList:['SYSTEMS ENGINEER','DRE','RESIDENT','PRODUCT DESIGN ENGINEER','IT','VALIDATION','POWERTRAIN',
    'SOFTWARE','MECHANICAL','WIRING','CONNECTIVITY', 'ENTRY PLUS','ENTRY LEVEL','INTERNSHIP','OTHER'],
  expList:['Entry Level','Entry Plus','Junior (1-2 years)','Mid Level 1 (3-4)','Mid Level 2 (5-7)', 'Senior (8+)'],
  hrList:['ALL','julia.taylor','lexie.fiema','megan.tomasi'],
  mgr2List:['ALL','john.podolan','jeff.lindgren','aarathi.padmanabhan','laya.ramos','sanjay.pinjarkar','aneil.shah'],
  actions: {
    open2019Active(){
      openQuery('project = REC AND status = Active AND "Unit 2 - Interest " in ("Not Reviewed", "Worth Interviewing", Hirable) AND "Date Added to Newton" >= 2019-01-01 ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC')
    },
    openMissingComments(){
      let qr='project = REC AND status in (Active, "Verbal Offer", "EAR Submitted") AND "HR Screening Status" = "Missing Comments"';

      if (this.get('hrFilter')!=='ALL'){
        qr=qr+' AND "HR Screen By" = '+this.get('hrFilter');
      }
      qr=qr+ ' ORDER BY cf[11113] ASC, "Date Added to Newton" DESC, cf[10858] DESC, key DESC';
      openQuery(qr);
    },
    openScreenScheduled(){
      let qr='project = REC AND "HR Screening Status" = "Screening Scheduled" AND "Date Added to Newton" >= 2019-01-01 AND status = Active';

      if (this.get('hrFilter')!=='ALL'){
        qr=qr+' AND "HR Screen By" = '+this.get('hrFilter');
      }
      qr=qr+ ' ORDER BY cf[11113] ASC, "Date Added to Newton" DESC, cf[10858] DESC, key DESC';
      openQuery(qr);
     },
    openNoScreen(){
      let qr='project = REC AND "HR Screening Status" = "Not Screened" AND "Date Added to Newton" >= 2019-01-01';

      if (this.get('hrFilter')!=='ALL'){
        qr=qr+' AND "HR Screen By" = '+this.get('hrFilter');
      }
      qr=qr+ ' ORDER BY cf[11113] ASC, "Date Added to Newton" DESC, cf[10858] DESC, key DESC';
      openQuery(qr);
     },
    openUnit2WorthReview(){
      let qr='project = REC AND "Unit 2 - Interest " = "Worth Review" AND status = Active';

      if (this.get('mgr2Filter')!=='ALL'){
        qr=qr+' AND "Unit 2 - Manager" = '+this.get('mgr2Filter');
      }
      qr=qr+ ' ORDER BY cf[11113] ASC, "Date Added to Newton" DESC, cf[10858] DESC, key DESC';
      openQuery(qr);
    },
    openUnit2Interview(){
      let qr='project = REC AND "Unit 2 - Interest " = "Worth Interviewing" AND status = Active';

      if (this.get('mgr2Filter')!=='ALL'){
        qr=qr+' AND "Unit 2 - Manager" = '+this.get('mgr2Filter');
      }
      qr=qr+ ' ORDER BY cf[11113] ASC, "Date Added to Newton" DESC, cf[10858] DESC, key DESC';
      openQuery(qr);
    },
    openUnit2Hireable(){
      let qr='project = REC AND "Unit 2 - Interest " = "Hirable" AND status = Active';

      if (this.get('mgr2Filter')!=='ALL'){
        qr=qr+' AND "Unit 2 - Manager" = '+this.get('mgr2Filter');
      }
      qr=qr+ ' ORDER BY cf[11113] ASC, "Date Added to Newton" DESC, cf[10858] DESC, key DESC';
      openQuery(qr);
    },
    openActive(){
      openQuery('project = REC AND status = Active ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC')
    },
    openUnavailable(){
      openQuery('project = REC AND status = "Company-Wide Unavailable" ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC')
    },
    openRejected(){
      openQuery('project = REC AND status = "Company-Wide Rejected" ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC')
    },
    openHired(){
      openQuery('project = REC AND status = Hired ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC')
    },
    openNew(){
      openQuery('project = REC AND "Domain Skills" = New AND "Date Added to Newton" >= 2019-01-01 ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC');
    },
    openSearchHire(param){
      let qr = 'project = REC AND "Domain Skills" = "'+this.get('groupFilter')+ '" AND "Experience" = "'+this.get('expFilter')+
        '" AND status = Active';
      if (param==='unit2Hireable') qr=qr+' AND "Unit 2 - Interest " = Hirable';
      if (param==='unit2Active') qr=qr+' AND "Unit 2 - Interest " in (Hirable,"Not Reviewed","On Hold","Worth Interviewing","Backburner")';
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
