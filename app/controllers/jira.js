import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  viewType:'ESG',
  groupFilter:'System/Component',
  expFilter:'Entry Plus',
  groupList:['System/Component','Validation','Powertrain','Software','Mechanical','Wiring','Connectivity',
  'Graduate+Experience','Internship','Other'],
  expList:['Entry Level','Entry Plus','Junior (1-2 years)','Mid Level 1 (3-4)','Mid Level 2 (5-7)', 'Senior (8+)'],
  actions: {
    open2019Active(){
      openQuery('project = REC AND status = Active AND "Unit 2 - Interest " in ("Not Reviewed", "Worth Interviewing", Hirable) AND "Date Added to Newton" >= 2019-01-01 ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC')
    },
    openMissingComments(){
      openQuery('project = REC AND status in (Active, "Verbal Offer", "EAR Submitted") AND "HR Screening Status" = "Missing Comments" ORDER BY cf[11113] ASC, "Date Added to Newton" DESC, cf[10858] DESC, key DESC')
    },
    openScreenScheduled(){
      openQuery('project = REC AND "HR Screening Status" = "Screening Scheduled" AND "Date Added to Newton" >= 2019-01-01 AND status = Active ORDER BY cf[11113] DESC, status DESC, cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC')
    },
    openNoScreen(){
      openQuery('project = REC AND "HR Screening Status" = "Not Screened" AND "Date Added to Newton" >= 2019-01-01 ORDER BY cf[10868] ASC, cf[10858] DESC, status ASC, assignee ASC, cf[10994] DESC, created DESC')
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
      openQuery('project = REC AND "Group" = New AND "Date Added to Newton" >= 2019-01-01 ORDER BY cf[10868] DESC, assignee ASC, cf[10994] DESC, created DESC');
    },
    openSearchHire(unit){
      let qr = 'project = REC AND "Group" = "'+this.get('groupFilter')+ '" AND "Experience" = "'+this.get('expFilter')+
        '" AND status = Active';
      if (unit==='2') qr=qr+' AND "Unit 2 - Interest " = Hirable';
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
