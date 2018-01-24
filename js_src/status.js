import { dirToPoint } from "./util.js";
import { MessageHandler } from "./msg.js";

import * as d from "./data.js";
export let DAZED = {
  getColor() {
    return "#D3D3D3";
  },
  getPriority() {
    return 2;
  },
  LISTENERS: {},
  act() {},
  inflict(target) {},
  remove(target) {}
};

export let DAZZLED = {
  getColor() {
    return "#FF69B4";
  },
  getPriority() {
    return 5;
  },
  LISTENERS: {},
  act() {
    this.raiseMixinEvent("act");
  },
  inflict(target) {
    if (target.hasOwnProperty("getStats")) {
      target.getStats().decreaseStatBy("Str", 5);
    }
  },
  remove(target) {
    if (target.hasOwnProperty("getStats")) {
      target.getStats().increaseStatBy("Str", 5);
    }
  }
};

export let SLEEP = {
  getColor() {
    return "#000080";
  },
  getPriority() {
    return 2;
  },
  LISTENERS: {
    damagedBy: function(evtData) {
      evtData.amt *= 5;
      this.state.StatusAffected = null;
    }
  },
  act() {},
  inflict(target) {},
  remove(target) {}
};

export let DROWZY = {
  getColor() {
    return "#00FFFF";
  },
  getPriority() {
    return 4;
  },
  LISTENERS: {},
  act() {
    this.raiseMixinEvent("act");
  },
  inflict(target) {
    if (target.hasOwnProperty("getStats")) {
      target.getStats().decreaseStatBy("Dex", 10);
      target.getStats().decreaseStatBy("Wis", 10);
    }
  },
  remove(target) {
    if (target.hasOwnProperty("getStats")) {
      target.getStats().increaseStatBy("Dex", 10);
      target.getStats().increaseStatBy("Wis", 10);
    }
  }
};

export let FEAR = {
  getColor() {
    return "#800000";
  },
  getPriority() {
    return 3;
  },
  LISTENERS: {
    bump: function(evt) {
      if (evt.entity.getTypeName() == this.getTypeName()) {
        evt.entity.raiseMixinEvent("inflictStatus", {
          status: FEAR,
          duration: 20
        });
      }
    },
    bumped: function(evt) {
      if (evt.entity.getTypeName() == this.getTypeName()) {
        evt.entity.raiseMixinEvent("inflictStatus", {
          status: FEAR,
          duration: 20
        });
      }
    }
  },
  act() {
    //Based on entityMixin fear code
    var dir = dirToPoint(d.DATA.getAvatar().getPos(), this.getPos());
    this.tryMove(dir.x, dir.y);
  },
  inflict(target) {},
  remove(target) {}
};
