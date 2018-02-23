import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    menu(){
      this.transitionToRoute('navigate');
    },
    goto(route){
      this.transitionToRoute(route);
    },
    favorite(){
      alert("favorite pressed!");
    },
    more(){
      this.transitionToRoute('candidates');
    },
  }
});
