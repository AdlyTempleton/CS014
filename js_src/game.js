import { MessageHandler } from "./msg.js";
import * as u from "./util.js";
import ROT from "rot-js";
import * as modes from "./mode.js";
import * as d from "./data.js";
import { mapFactory } from "./map.js";
import { EntityFactory } from "./entities.js";
import { TIMER } from "./timing.js";

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

  setupGame: function() {
    console.log("Setting up game");
    this.setupMap();

    var avatar = EntityFactory.create("avatar");
    d.DATA.avatarId = avatar.getId();
    d.DATA.currentMap().addEntityAtRandomPos(avatar);
    d.DATA.cameraLocation = avatar.getPos();

    this.isPlaying = true;

    TIMER.engine.start();
  },

  setupMap: function() {
    var map = mapFactory({});
    map.build();
    map.populate();
    d.DATA.currentMapId = map.getId();
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
  },

  renderAvatar: function(display) {
    this.curMode.renderAvatar(display);
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
