import Route from '@ember/routing/route';

export default Route.extend({
  activate: function() {
    document.title = "JIRA Filters";
  }
});
