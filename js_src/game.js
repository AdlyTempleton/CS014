
import * as u from './util.js';
import ROT from 'rot-js';
import * as modes from './mode.js'

export let Game = {

  display: {
    SPACING: 1.1,
    main: {
      w: 80,
      h: 24,
      o: null
    }
  },

  init: function() {
    this._randomSeed = 5 + Math.floor(Math.random()*100000);
    //this._randomSeed = 76250;
    console.log("using random seed "+this._randomSeed);
    ROT.RNG.setSeed(this._randomSeed);

    u.utilLogHelloWorld();

    this.display.main.o = new ROT.Display({
      width: this.display.main.w,
      height: this.display.main.h,
      spacing: this.display.SPACING});

    this.setupModes();
    this.switchModes('startup')
  },

  switchModes: function(newModeName){

    if(this.curMode){
      this.curMode.exit();
    }
    this.curMode = this.modes[newModeName]

    if(this.curMode){
      this.curMode.enter();
    }
  },

  setupModes: function(){
    this.modes = {};
    this.modes.startup = new modes.StartupMode();
    this.modes.win = new modes.WinMode();
    this.modes.lose = new modes.LoseMode();
    this.modes.play = new modes.PlayMode();
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  render: function() {
    this.renderMain();
  },

  renderMain: function() {
    this.curMode.render(this.display.main.o);

  }
};
