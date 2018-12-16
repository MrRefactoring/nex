import Route from '@ember/routing/route';

export default Route.extend({
  model: function(){

  },
  afterModel: function() {
    this.transitionTo('time');
  }
});
