import { MessageHandler } from "./msg.js";
import * as u from "./util.js";
import ROT from "rot-js";
import * as modes from "./mode.js";
import * as d from "./data.js";
import { mapFactory } from "./map.js";
import { EntityFactory } from "./entities.js";
import { TIMER } from "./timing.js";

import { STAT_NAMES } from "./stats.js";
import { expForLevel } from "./util.js";
import { Dungeon } from "./dungeon.js";

export let Game = {
  msg: MessageHandler,
  isPlaying: false,
  SAVE_LOCATION: "wanderingbard",
  DISPLAY_SPACING: 1.1,
  display: {
    main: {
      w: 80,
      h: 24,
      o: null
    },
    avatar: {
      w: 20,
      h: 24,
      o: null
    },
    log: {
      w: 100,
      h: 6,
      o: null
    },
    spell: {
      w: 20,
      h: 29,
      o: null
    }
  },

  init: function() {
    TIMER.init();

    this._randomSeed = 5 + Math.floor(Math.random() * 100000);
    //this._randomSeed = 76250;
    console.log("using random seed " + this._randomSeed);
    ROT.RNG.setSeed(this._randomSeed);

    this.setupDisplays();
    this.setupModes();
    d.DATA.init(this);
    this.switchModes("startup");
  },

  setupDisplays: function() {
    for (var display_key in this.display) {
      this.display[display_key].o = new ROT.Display({
        width: this.display[display_key].w,
        height: this.display[display_key].h,
        spacing: this.DISPLAY_SPACING
      });
    }
    this.msg.init(this.getDisplay("log"));
  },

  levelUp: function(avatar) {
    avatar.state.level += 1;
    avatar.state.exp -= u.expForLevel(avatar.state.level);
    this.switchModes("level");
  },

  setupGame: function() {
    console.log("Setting up game");
    this.setupMap();

    var avatar = EntityFactory.create("avatar");
    d.DATA.state.avatarId = avatar.getId();
    d.DATA.currentMap().addEntityAtRandomPos(avatar);
    d.DATA.state.cameraLocation = avatar.getPos();

    this.isPlaying = true;

    TIMER.engine.start();
  },

  setupMap: function() {
    d.DATA.dungeon = new Dungeon(20);
    var map = d.DATA.dungeon.getMap(1);
    d.DATA.dungeonLevel = 1;
    d.DATA.state.currentMapId = map.getId();
  },

  switchModes: function(newModeName) {
    if (this.curMode) {
      this.curMode.exit(this);
    }
    this.curMode = this.modes[newModeName];

    if (this.curMode) {
      this.curMode.enter(this);
    }
  },

  setupModes: function() {
    this.modes = {};
    this.modes.startup = new modes.StartupMode(this);
    this.modes.win = new modes.WinMode(this);
    this.modes.lose = new modes.LoseMode(this);
    this.modes.play = new modes.PlayMode(this);
    this.modes.menu = new modes.MenuMode(this);
    this.modes.help = new modes.HelpMode(this);
    this.modes.level = new modes.LevelMode(this);
    this.modes.spell = new modes.SpellMode(this);
  },

  bindEvent: function(eventType) {
    window.addEventListener(eventType, evt => {
      this.eventHandler(eventType, evt);
    });
  },

  eventHandler: function(eventType, e) {
    if (this.curMode) {
      if (this.curMode.handleInput(eventType, e)) {
        this.render();
      }
    }
  },

  getDisplay: function(displayId) {
    return this.display[displayId].o;
  },

  render: function() {
    this.renderMain();
    this.renderAvatar(this.getDisplay("avatar"));
    this.renderLog(this.getDisplay("log"));
    this.renderSpell(this.getDisplay("spell"));
  },

  renderAvatar(display) {
    display.clear();
    if (d.DATA.getAvatar() == undefined) {
      return;
    }
    display.drawText(2, 2, "Class: Bard");
    display.drawText(2, 3, `Time: ${d.DATA.getAvatar().getTime()}`);
    display.drawText(
      2,
      4,
      `HP: ${d.DATA.getAvatar().getCurHp()}/${d.DATA.getAvatar().getMaxHp()}`
    );
    var stats = d.DATA.getAvatar().getStats();
    var y = 5;

    for (var i = 0; i < STAT_NAMES.length; i++) {
      var statName = STAT_NAMES[i];
      display.drawText(
        2,
        5 + i,
        `${statName}:  ${
          stats.getStat(statName) < 10 ? "0" : ""
        }${stats.getStat(statName)} (${
          stats.getModifier(statName) >= 0 ? "+" : ""
        }${stats.getModifier(statName)})`
      );
    }

    display.drawText(
      2,
      13,
      `Pickpocketing: ${d.DATA.getPlayerSkill("pickpocket")}`
    );
    display.drawText(2, 14, `Fencing: ${d.DATA.getPlayerSkill("fencing")}`);
    display.drawText(2, 15, `Music: ${d.DATA.getPlayerSkill("music")}`);

    var level = d.DATA.getAvatar().state.level;
    var maxExp = expForLevel(level + 1);
    display.drawText(2, 11, `EXP: ${d.DATA.getAvatar().state.exp} / ${maxExp}`);
    display.drawText(2, 12, `Level ${level}`);
  },

  renderSpell: function(display) {
    display.drawText(2, 2, "Spells:");
    for (var i = 1; i <= 9; i++) {
      if (d.DATA.state.spells[i] == undefined) {
        display.drawText(2, 2 + 2 * i, `{Spell ${i}: EMPTY}`);
      } else {
        display.drawText(
          2,
          2 + 2 * i,
          `Spell ${i}: (${d.DATA.state.spellCharges[i]} / 3)`
        );
        display.drawText(2, 3 + 2 * i, d.DATA.state.spells[i].getName());
      }
    }
  },

  renderLog: function(display) {
    this.msg.render();
  },

  toJSON: function() {
    return this._randomSeed;
  },

  fromJSON: function(json) {
    this._randomSeed = JSON.parse(json);
  },

  renderMain: function() {
    this.curMode.render(this.display.main.o, this);
  }
};
