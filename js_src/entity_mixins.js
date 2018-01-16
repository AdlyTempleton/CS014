import * as d from "./data.js";

import { TILES } from "./tile.js";
let _exampleMixin = {
  META: {
    mixinName: "_exampleMixin",
    mixingGroupName: "ExampleMixinGroup",
    mixinNamespace: "_ExampleMixin",
    stateModel: {
      foo: 10
    },
    initialize: function() {}
  },
  METHODS: {
    method1: function(p) {}
  },
  LISTENERS: {
    event: function() {}
  }
};

export let CorporealMover = {
  META: {
    mixinName: "CorporealMover",
    mixingGroupName: "Mover",
    stateModel: {}
  },
  METHODS: {
    tryMove: function(dx, dy) {
      var newLoc = { x: this.getPos().x, y: this.getPos().y };
      newLoc.x += dx;
      newLoc.y += dy;

      if (d.DATA.currentMap().isTilePassable(newLoc)) {
        //d.DATA.cameraLocation = newLoc;

        this.moveTo(newLoc);
        d.DATA.cameraLocation = this.getPos();

        this.raiseMixinEvent("postMove", {});
      }
    }
  }
};

export let TimeTracker = {
  META: {
    mixinName: "TimeTracker",
    mixingGroupName: "Tracker",
    stateModel: { timeTaken: 0 }
  },
  METHODS: {
    getTime: function() {
      return this.state.TimeTracker.timeTaken;
    },
    setTime: function(t) {
      this.state.TimeTracker.timeTaken = t;
    },
    addTime: function(t) {
      this.state.TimeTracker.timeTaken++;
    }
  },
  LISTENERS: {
    postMove: function(evtData) {
      this.addTime();
    }
  }
};
