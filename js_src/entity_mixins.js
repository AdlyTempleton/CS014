import * as d from "./data.js";
import { TILES } from "./tile.js";

import { TIMER } from "./timing.js";
import { MessageHandler } from "./msg.js";
import ROT from "rot-js";
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

export let MeeleeAttacker = {
  META: {
    mixinName: "MeeleeAttacker",
    mixingGroupName: "bump",
    initialize: function(template) {
      this.state.MeeleeAttacker.attack = template.meeleeAttack || 1;
      this.state.MeeleeAttacker.friendlyTypes = template.friendlyTypes || [];
    }
  },
  LISTENERS: {
    bump: function(eventData) {
      var target = eventData.entity;
      if (this.state.MeeleeAttacker.friendlyTypes.indexOf(target.name) == -1) {
        target.raiseMixinEvent("damagedBy", {
          damageAmt: this.state.MeeleeAttacker.attack,
          damageSrc: this
        });
      }
    }
  }
};

export let Spawner = {
  META: {
    mixinName: "Spawner",
    mixinGroupName: "EnemyAttributes",
    initialize: function(template) {
      this.state.Spawner.spawnType = template.spawnType || "rat";
      this.state.Spawner.spawnFrequency = template.spawnFrequency || 10;
    }
  },
  LISTENERS: {
    postMove: function(event) {
      if (ROT.RNG.getUniformInt(1, this.state.Spawner.spawnFrequency) == 1) {
        var pos = d.DATA.currentMap().getRandomEmptyPointWithinCircle(
          this.getPos(),
          5
        );
        d.DATA.currentMap().spawnEntityAt("rat", pos);
      }
    }
  }
};

export let Logger = {
  META: {
    mixinName: "Logger",
    mininGroupName: "Logger"
  },
  LISTENERS: {
    kills: function(event) {
      MessageHandler.send(`Killed ${event.entity.name}`);
    },
    damages: function(event) {
      MessageHandler.send(
        `Attacking ${event.entity.name} for ${event.damageAmt}`
      );
    },
    damagedBy: function(event) {
      MessageHandler.send(
        `Attacked by ${event.damageSrc.name} for ${event.damageAmt}`
      );
    }
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
        var entityAtNewLoc = d.DATA.getEntityFromId(
          d.DATA.currentMap().getEntityAt(newLoc)
        );

        if (entityAtNewLoc) {
          this.raiseMixinEvent("bump", {
            entity: entityAtNewLoc
          });
          entityAtNewLoc.raiseMixinEvent("bumped", {
            entity: this
          });
        } else {
          this.moveTo(newLoc);
          this.raiseMixinEvent("postMove", {});
        }
      }
    }
  }
};

export let Wander = {
  META: { mixinName: "AIWander", mixinGroup: "AI" },
  METHODS: {
    act() {
      var moves = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ];

      var move = moves.random();
      this.tryMove(move.x, move.y);
    }
  }
};

export let PlayerActor = {
  META: { mixingName: "PlayerActor", mixinGroup: "AI" },
  METHODS: {
    act: function() {
      TIMER.engine.lock();
    }
  }
};

export let WanderAttackNearby = {
  META: { mixinName: "AIWander", mixinGroup: "AI" },
  LISTENERS: {
    act: function() {
      var moves = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ];

      var move = moves.random();

      //If the player is nearby, move to them
      var xToPlayer = d.DATA.getAvatar().getPos().x - this.getPos().x;
      var yToPlayer = d.DATA.getAvatar().getPos().y - this.getPos().y;
      if (
        (Math.abs(xToPlayer) == 1 && yToPlayer == 0) ||
        (Math.abs(yToPlayer) == 1 && xToPlayer == 0)
      ) {
        move = { x: xToPlayer, y: yToPlayer };
      }
      this.tryMove(move.x, move.y);
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
        entity: this,
        damageAmt: evtData.damageAmt
      });
      if (this.state.HitPoints.curHp <= 0) {
        this.raiseMixinEvent("killed", { entity: evtData.damageSrc });
        evtData.damageSrc.raiseMixinEvent("kills", { entity: this });
      }
    },
    killed: function(evtData) {
      this.destroy();
    }
  }
};

export let AvatarMixin = {
  META: {
    mixinName: "AvatarMisc",
    mixingGroupName: "Misc"
  },
  LISTENERS: {
    postMove: function() {
      d.DATA.cameraLocation = this.getPos();
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
