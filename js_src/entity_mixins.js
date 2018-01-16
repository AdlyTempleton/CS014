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

export let HitPoints = {
  META: {
    mixinName: "HitPoints",
    mixinGroup: "HitPoints",
    stateModel: {
      curHp: 0,
      maxHp: 0
    },
    initialize: function(template) {
      this.state.HitPoints.maxHp = template.maxHp || 1;
      this.state.HitPoints.curHp = template.curHp || this.state.HitPoints.maxHp;
    }
  },
  METHODS: {
    setHp: function(newHp) {
      this.state.HitPoints.curHp = newHp;
    },
    gainHp: function(dHp) {
      if (dHp < 0) {
        return;
      }
      this.state.HitPoints.curHp = Math.min(
        this.state.HitPoints.curHp + dHp,
        this.state.HitPoints.maxHp
      );
    },
    loseHp: function(dHp) {
      if (dHp < 0) {
        return;
      }
      this.state.HitPoints.curHp -= dHp;
    },
    setMaxHp: function(newMaxHp) {
      this.state.HitPoints.maxHp = newMaxHp;
    },
    getCurHp: function() {
      return this.state.HitPoints.curHp;
    },
    getMaxHp: function() {
      return this.state.HitPoints.maxHp;
    }
  },
  LISTENERS: {
    damagedBy: function(evtData) {
      // handler for 'eventLabel' events
      this.loseHp(evtData.damageAmt);
      evtData.damageSrc.raiseMixinEvent("damages", {
        target: this,
        damageAmt: evtData.damageAmt
      });
      if (this.state.HitPoints.curHp <= 0) {
        this.raiseMixinEvent("killed", { killer: evtData.damageSrc });
        evtData.damageSrc.raiseMixinEvent("kills", { kills: this });
      }
    },
    killed: function(evtData) {
      // console.log(this.getName()+' killed');
      this.destroy();
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
