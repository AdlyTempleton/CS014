/**
 * A list of mixins for entities
 */
import * as d from "./data.js";
import { TILES } from "./tile.js";
import { Game } from "./game.js";
import { Stats } from "./stats.js";
import { TIMER } from "./timing.js";
import { MessageHandler } from "./msg.js";
import { Symbol } from "./symbol.js";
import { expForLevel } from "./util.js";
import { CLONE } from "./stats.js";
import { dist } from "./util.js";
import { dirToPoint } from "./util.js";
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

export let Spellbook = {
  META: { mixinName: "Spellbook" },
  LISTENERS: {
    bumped: function(evtData) {
      if (evtData.entity == d.DATA.getAvatar()) {
        Game.switchModes("spell");
        this.destroy();
      }
    }
  }
};

export let StatusAffected = {
  META: {
    mixinName: "StatusAffected",
    initialize: function() {
      this.state.StatusAffected.status = null;
      this.state.StatusAffected.duration = null;
    }
  },
  METHODS: {
    getStatus: function() {
      return this.state.StatusAffected.status;
    },
    act: function() {
      TIMER.engine.lock();
      if (this.getStatus() != null) {
        this.getStatus().act.call(this);

        if (--this.state.StatusAffected.duration <= 0) {
          this.getStatus().remove(this);
          this.state.StatusAffected.status = null;
        }
      } else {
        this.raiseMixinEvent("act", {});
      }
      TIMER.engine.unlock();
    },
    getSymbol: function() {
      if (this.getStatus() != null) {
        var old = this.symbol;
        return new Symbol(old.char, old.fgColor, this.getStatus().getColor());
      } else {
        return this.symbol;
      }
    }
  },
  LISTENERS: {
    general: function(evtData, evtType) {
      if (
        this.state.StatusAffected.status &&
        this.state.StatusAffected.status.LISTENERS[evtType]
      ) {
        this.state.StatusAffected.status.LISTENERS[evtType].call(this, evtData);
      }
    },
    inflictStatus: function(evtData) {
      if (
        this.getStatus() == null ||
        this.getStatus().getPriority() > evtData.status.getPriority()
      ) {
        if (this.getStatus() != null) {
          this.getStatus().remove(this);
        }

        this.state.StatusAffected.status = evtData.status;
        this.state.StatusAffected.duration = evtData.duration;

        this.getStatus().inflict(this);
      }
    }
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
          if (d.DATA.currentMap().isTilePassable(newLoc)) {
            this.moveTo(newLoc);
          }
        }
      } else {
        if (d.DATA.currentMap().isTilePassable(newLoc)) {
          this.moveTo(newLoc);
        }
      }
    }
  }
};

export let EthrealMover = {
  META: {
    mixinName: "EthrealMover",
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
};

export let Wander = {
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

export let Buffable = {
  META: {
    mixinName: "Buffable",
    initialize: function() {
      this.state.Buffable.buffs = [];
    }
  },
  METHODS: {
    //Returns the mapping of buffs and durations
    getBuffsData: function() {
      return this.state.Buffable.buffs;
    },
    //Returns a simple list of buffs
    getBuffs: function() {
      var buffData = getBuffsData();
      var r = [];
      for (var i = 0; i < buffData.length; i++) {
        r.push(buffData[i]["buff"]);
      }
      return r;
    }
  },
  LISTENERS: {
    addBuff: function(buff, duration) {
      buff.add.call(this);
      this.getBuffsData().push({ buff: buff, duration: duration });
    },
    act: function() {
      var buffData = getBuffsData();
      var newBuffData = [];
      for (var i = 0; i < buffData.length; i++) {
        var buff = buffData[i];
        //Remove buffs while iterating by filtering into new list
        if (--buff["duration"] > 0) {
          newBuffData.push(buff);
        } else {
          buff["buff"].remove.call(this);
        }
      }
      this.state.Buffable.buffs = newBuffData;
    },
    general: function(evtData, evtType) {
      var buffs = getBuffs();
      for (var i = 0; i < buffs.length; i++) {
        var buff = buffs[i];
        if (buff.LISTENERS && buff.LISTENERS[evtType]) {
          buff.LISTENERS[evtType].call(this, evtData);
        }
      }
    }
  }
};

export let Pickpocketable = {
  META: {
    mixinName: "Pickpocketable",
    mixinGroup: "pickpocket",
    initialize: function(template) {
      this.state.Pickpocketable.pickpocketItemChance =
        template.pickpocketItemChance || 9;
      this.state.Pickpocketable.hasItem =
        ROT.RNG.getUniformInt(0, 10) <
        this.state.Pickpocketable.pickpocketItemChance;
      this.state.Pickpocketable.pickpocketDefense =
        template.pickpocketDefense || 3;
    }
  },
  METHODS: {
    isPickpocketable: function() {
      return true;
    },
    hasPickpocketItem() {
      return this.state.Pickpocketable.hasItem;
    },
    getPickpocketDefense() {
      return this.state.Pickpocketable.pickpocketDefense;
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
      //Check to avoid cloning undefined during initialization
      if (this.state.StatsMixin.stats == undefined) {
        return undefined;
      }
      if (!this.state.StatsMixin.hasOwnProperty("getStat")) {
        this.state.StatsMixin.stats = CLONE(this.state.StatsMixin.stats);
      }
      return this.state.StatsMixin.stats;
    },
    getSpeed: function() {
      return 100 - 10 * this.getStats().getModifier("Dex");
    },
    getAttack: function() {
      var r = this.getStats().getModifier("Str");

      //Fencing
      if (this.isAvatar() && d.DATA.getPlayerSkill("fencing") > 0) {
        r +=
          d.DATA.getPlayerSkill("fencing") +
          this.getStats().getModifier("Dex") **
            (0.5 + 0.5 * d.DATA.getPlayerSkill("fencing"));
      }
      r = Math.round(r);

      return Math.max(1, r);
    }
  },
  LISTENERS: {
    modifyDamage: function(evt) {
      evt.amt = Math.max(1, evt.amt - this.getStats().getModifier("Con"));
    },
    bonusMaxHealth: function(evt) {
      evt.amt += 5 * this.getStats().getModifier("Con");
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

export let AttackNearby = {
  META: {
    mixinName: "AIAttackNearby",
    mixinGroup: "AI"
  },
  LISTENERS: {
    act: function() {
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
        this.tryMove(xToPlayer, yToPlayer);
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
    loseHp: function(dHp, src = null) {
      if (dHp < 0) {
        return;
      }
      this.state.HitPoints.curHp -= dHp;

      if (this.state.HitPoints.curHp <= 0) {
        this.raiseMixinEvent("killed", {
          entity: src
        });
        if (src != null) {
          src.raiseMixinEvent("kills", {
            entity: this
          });
        }
      }

      return true;
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
      var data = { amt: evtData.damageAmt };
      this.raiseMixinEvent("modifyDamage", data);
      this.loseHp(data.amt, evtData.damageSrc);
      evtData.damageSrc.raiseMixinEvent("damages", {
        entity: this,
        damageAmt: data.amt
      });
    },
    killed: function(evtData) {
      this.destroy();
    }
  }
};

export let Fears = {
  META: {
    mixinName: "Fears",
    initialize: function(template) {
      this.state.Fears.fears = template.fears || ["light"];
    }
  },
  LISTENERS: {
    movementOverride: function(evtData) {
      var targets = [];
      for (var i = 0; i < this.state.Fears.fears.length; i++) {
        targets = targets.concat(
          d.DATA.currentMap().getEntitiesOfType(this.state.Fears.fears[i])
        );
      }

      for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        if (dist(target.getPos(), this.getPos()) < 8) {
          var dir = dirToPoint(target.getPos(), this.getPos());
          this.tryMove(dir.x, dir.y);
          evtData.cancel = true;
        }
      }
    }
  }
};

export let Likes = {
  META: {
    mixinName: "Likes",
    initialize: function(template) {
      this.state.Likes.likes = template.likes || ["sound"];
    }
  },
  LISTENERS: {
    movementOverride: function(evtData) {
      var targets = [];

      for (var i = 0; i < this.state.Likes.likes.length; i++) {
        targets = targets.concat(
          d.DATA.currentMap().getEntitiesOfType(this.state.Likes.likes[i])
        );
      }
      for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        if (target != this && dist(target.getPos(), this.getPos()) < 15) {
          var dir = dirToPoint(this.getPos(), target.getPos());
          this.tryMove(dir.x, dir.y);
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
      this.state.skills = { pickpocket: 0, fencing: 0, music: 0 };
    }
  },
  METHODS: {
    destroy: function() {
      Game.switchModes("lose");
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
    },
    modifyDamage(evt) {
      //Fencing
      if (this.isAvatar() && d.DATA.getPlayerSkill("fencing") > 0) {
        var mod = Math.min(
          15,
          d.DATA.getPlayerSkill("fencing") +
            this.getStats().getModifier("Dex") **
              (1 + 0.2 * d.DATA.getPlayerSkill("fencing"))
        );
        if (ROT.RNG.getUniformInt(0, 20) < mod) {
          MessageHandler.send("Parried attack using fencing");
          evt.amt = 0;
        }
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
