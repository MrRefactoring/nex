import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  addAll: false,
  onChange:'',
  list:[],

  actions: {
    onChange(newVal){
      //component passes in the new value
      //curry the new value to the action so it can be handled
      this.attrs.onChange(newVal);
    },
  },
});
