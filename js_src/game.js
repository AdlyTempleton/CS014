  import {MessageHandler} from './msg.js'
  import * as u from './util.js';
  import ROT from 'rot-js';
  import * as modes from './mode.js'

  export let Game = {

    msg: MessageHandler,
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
      this._randomSeed = 5 + Math.floor(Math.random()*100000);
      //this._randomSeed = 76250;
      console.log("using random seed "+this._randomSeed);
      ROT.RNG.setSeed(this._randomSeed);

      u.utilLogHelloWorld();

      this.setupDisplays();
      this.setupModes();
      this.switchModes('startup')
    },

    setupDisplays: function(){
      for (var display_key in this.display) {
        this.display[display_key].o = new ROT.Display({
          width: this.display[display_key].w,
          height: this.display[display_key].h,
          spacing: this.DISPLAY_SPACING});
      }
      console.dir(this.display);
      this.msg.init(this.getDisplay('log'));

    },
    switchModes: function(newModeName){
      console.log("Switching " + newModeName)
      if(this.curMode){
        this.curMode.exit(this);
      }
      this.curMode = this.modes[newModeName]

      if(this.curMode){
        this.curMode.enter(this);
      }
    },

    setupModes: function(){
      this.modes = {};
      this.modes.startup = new modes.StartupMode(this);
      this.modes.win = new modes.WinMode(this);
      this.modes.lose = new modes.LoseMode(this);
      this.modes.play = new modes.PlayMode(this);
    },

    bindEvent: function(eventType){
      window.addEventListener(eventType, (evt) => {
        this.eventHandler(eventType, evt);
      });
    },

    eventHandler: function(eventType, e){
      if(this.curMode){
        if(this.curMode.handleInput(eventType, e)){
          this.render();
        }
      }
    },

    getDisplay: function (displayId) {
      return this.display[displayId].o;
    },

    render: function() {
      this.renderMain();
    },

    renderAvatar: function(){
      display.drawText(2, 2, "You are a bard")
    },

    renderLog: function(){
      msg.render();
    },

    renderMain: function() {
      this.curMode.render(this.display.main.o, this);

    }
  };
