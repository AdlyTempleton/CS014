/**
 * A list of mixins for entities
 */
import * as d from "./data.js";
import { TILES } from "./tile.js";
import { Game } from "./game.js";
import { Stats } from "./stats.js";
import { TIMER } from "./timing.js";
import { MessageHandler } from "./msg.js";
import { expForLevel } from "./util.js";
import { dist } from "./util.js";
import ROT from "rot-js";

/**
 * Example Template for entity mixins
 */
let _exampleMixin = {
  //Metadata
  META: {
    mixinName: "_exampleMixin",
    mixingGroupName: "ExampleMixinGroup",
    mixinNamespace: "_ExampleMixin",
    //Initial state, values stored here will be initialized as constants for each new entity
    //Only simple values stored here
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
          damageAmt: this.hasOwnProperty("getAttack")
            ? this.getAttack()
            : this.state.MeeleeAttacker.attack,
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
    act: function(event) {
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
      var newLoc = {
        x: this.getPos().x,
        y: this.getPos().y
      };
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

          var data = { entity: this, canMove: false };
          entityAtNewLoc.raiseMixinEvent("bumped", {
            entity: this
          });
          if (data.canMove) {
            this.moveTo(newLoc);
          }
        } else {
          this.moveTo(newLoc);
        }
      }
    }
  }
};

export let Wander = {
  META: {
    mixinName: "AIWander",
    mixinGroup: "AI"
  },
  METHODS: {
    act() {
      var moves = [
        {
          x: 1,
          y: 0
        },
        {
          x: -1,
          y: 0
        },
        {
          x: 0,
          y: 1
        },
        {
          x: 0,
          y: -1
        }
      ];

      var data = { cancel: false };
      this.raiseMixinEvent("movementOverride", data);
      if (data.cancel) {
        return;
      }

      var move = moves.random();
      this.tryMove(move.x, move.y);
    }
  }
};

export let RandomizedStats = {
  //Two places to initialize: if init happens before or after Stats mixin
  META: {
    mixinName: "RandomizedStats",
    mixinGroup: "stats",
    initialize: function(template) {
      this.state.RandomizedStats.statLevel = template.statLevel;
      if (this.getStats()) {
        this.getStats().randomize(template.statLevel);
      }
    }
  },
  LISTENERS: {
    setStats: function(e) {
      if (this.state.RandomizedStats.statLevel) {
        e.o.randomize;
      }
    }
  }
};

export let StatsMixin = {
  META: {
    mixinName: "StatsMixin",
    mixinGroup: "stats",
    initialize: function() {
      this.state.StatsMixin.stats = new Stats();
      this.raiseMixinEvent("setStats", { o: this.state.StatsMixin.stats });
    }
  },
  METHODS: {
    getStats: function() {
      return this.state.StatsMixin.stats;
    },
    getSpeed: function() {
      return 100 - 10 * this.getStats().getModifier("Dex");
    },
    getAttack: function() {
      var r = Math.max(
        this.getStats().getModifier("Str"),
        this.getStats().getModifier("Dex")
      );
      return Math.max(1, r);
    }
  }
};

export let DropsExp = {
  META: {
    mixinName: "DropsExp",
    mixinGroup: "EnemyAttributes",
    initialize: function(template) {
      this.state.DropsExp.exp = template.exp || 500;
    }
  },
  LISTENERS: {
    killed: function(evt) {
      evt.entity.raiseMixinEvent("gainExp", {
        entity: this,
        amt: this.state.DropsExp.exp
      });
    }
  }
};

export let PlayerActor = {
  META: {
    mixinName: "PlayerActor",
    mixinGroup: "AI"
  },
  METHODS: {
    act: function() {
      TIMER.engine.lock();
      Game.render();
    }
  }
};

export let WanderAttackNearby = {
  META: {
    mixinName: "AIWander",
    mixinGroup: "AI"
  },
  LISTENERS: {
    act: function() {
      var moves = [
        {
          x: 1,
          y: 0
        },
        {
          x: -1,
          y: 0
        },
        {
          x: 0,
          y: 1
        },
        {
          x: 0,
          y: -1
        }
      ];

      var move = moves.random();

      var data = { cancel: false };
      this.raiseMixinEvent("movementOverride", data);
      if (data.cancel) {
        return;
      }

      //If the player is nearby, move to them
      var xToPlayer = d.DATA.getAvatar().getPos().x - this.getPos().x;
      var yToPlayer = d.DATA.getAvatar().getPos().y - this.getPos().y;
      if (
        (Math.abs(xToPlayer) == 1 && yToPlayer == 0) ||
        (Math.abs(yToPlayer) == 1 && xToPlayer == 0)
      ) {
        move = {
          x: xToPlayer,
          y: yToPlayer
        };
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
      console.log("Setting max hp");
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
        this.raiseMixinEvent("killed", {
          entity: evtData.damageSrc
        });
        evtData.damageSrc.raiseMixinEvent("kills", {
          entity: this
        });
      }
    },
    killed: function(evtData) {
      this.destroy();
    }
  }
};

export let FearsLight = {
  META: {
    mixinName: "FearsLight"
  },
  LISTENERS: {
    movementOverride: function(evtData) {
      var lights = d.DATA.currentMap().getEntitiesOfType("light");

      for (var i = 0; i < lights.length; i++) {
        var light = lights[i];
        if (dist(light.getPos(), this.getPos()) < 8) {
          var xDiff = this.getPos().x - light.getPos().x;
          var yDiff = this.getPos().y - light.getPos().y;

          if (Math.abs(xDiff) > Math.abs(yDiff)) {
            this.tryMove(Math.sign(xDiff), 0);
          } else {
            this.tryMove(0, Math.sign(yDiff));
          }

          evtData.cancel = true;
        }
      }
    }
  }
};

export let Vanishing = {
  META: {
    mixinName: "Vanishing",
    initialize: function(template) {
      this.state.Vanishing.time = template.vanishingTime || 50;
    }
  },
  LISTENERS: {
    act: function() {
      this.state.Vanishing.time--;
      if (this.state.Vanishing.time == 0) {
        this.destroy();
      }
    }
  }
};

export let Overwalkable = {
  META: {
    mixinName: "Overwalkable"
  },
  LISTENERS: {
    bumped: function(evtData) {
      evtData.canMove = true;
      this.destroy();
    }
  }
};

export let AvatarMixin = {
  META: {
    mixinName: "AvatarMisc",
    mixingGroupName: "Misc",
    initialize: function() {
      this.state.exp = 0;
      this.state.level = 1;
    }
  },
  LISTENERS: {
    postMove: function() {
      d.DATA.state.cameraLocation = this.getPos();
    },
    //Levelup code
    gainExp(evt) {
      this.state.exp += evt.amt;
      if (this.state.exp >= expForLevel(this.state.level + 1)) {
        Game.levelUp(this);
      }
    }
  }
};

export let TimeTracker = {
  META: {
    mixinName: "TimeTracker",
    mixingGroupName: "Tracker",
    stateModel: {
      timeTaken: 0
    }
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
