import Controller from '@ember/controller';

export default Controller.extend({
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
