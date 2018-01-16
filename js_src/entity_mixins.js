let _exampleMixin = {

  META: {
    mixinName: "_exampleMixin",
    mixingGroupName: "ExampleMixinGroup",
    mixinNamespace: "_ExampleMixin",
    stateModel: {
      foo: 10
    },
    initialize: function(){}
  },
  METHODS: {
    method1: function(p){}
  }

}

export let TimeTracker = {
  META: {
    mixinName: "TimeTracker",
    mixingGroupName: "Tracker",
    stateModel: {timeTaken: 0},
  },
  METHODS: {
    getTime: function(){
      return this.state.TimeTracker.timeTaken;
    },
    setTime: function(t){
      this.state.TimeTracker.timeTaken = t;
    },
    addTime: function(t){
      thisstate.TimeTracker.timeTaken ++;
    }
  }
}
