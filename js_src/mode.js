import Game from './util.js'
import * as d from './data.js'
import {MessageHandler} from './msg.js'
import {Symbol} from './symbol.js'
import {TILES} from './tile.js'

class Mode {

  constructor(g){
    this.game = g;
  }

  enter() {
    this.game.msg.send(`Entering ${this.constructor.name}`)

  }

  exit(){}

  handleInput(eventType, e){}

  render(display){
  }

}

export class PlayMode extends Mode {


    enter(){
      super.enter();
      this.avatarSymbol = new Symbol('@','#dd4');
    }
    render(display){

      display.clear();
      console.dir(d.DATA);
      d.DATA.currentMap().drawOn(display, d.DATA.playerLocation.x,d.DATA.playerLocation.y);
      this.avatarSymbol.drawOn(display, Math.round(display.getOptions().width / 2), Math.round(display.getOptions().height / 2));
    }

    handleInput(eventType, e){
      if(eventType == "keyup"){
        switch(e.keyCode){
          case 27:
            this.game.switchModes('menu');
            return true;
        }
      }

      if(eventType == "keydown"){
        //Moving code
        //A map from key codes to coordinates to move
        var moveKeys = {65: {x: -1, y:0}, 87: {x: 0, y:-1}, 68: {x: 1, y:0}, 83: {x: 0, y:1}};

        if(e.keyCode in moveKeys){
          var newLoc = {x:d.DATA.playerLocation.x, y:d.DATA.playerLocation.y};

          newLoc.x += moveKeys[e.keyCode].x;
          newLoc.y += moveKeys[e.keyCode].y;
          if(d.DATA.currentMap().isTilePassable(newLoc)){
            d.DATA.playerLocation = newLoc;
            if(d.DATA.currentMap().getTile(newLoc) == TILES.STAIRS){
              this.game.switchModes('win');
            }
          }

        }
        return true;
      }

  }
}

export class WinMode extends Mode{
    render(display){
      display.clear()
      display.drawText(2, 2, "You have successfully rejoined the party.");
    }
}

export class LoseMode extends Mode{
  render(display){
    display.clear()
    display.drawText(2, 2, "You have died.");
  }
}

export class MenuMode extends Mode{

  enter() {
    super.enter();
    if (window.localStorage.getItem(this.game.SAVE_LOCATION)) {
      this.hasFile = true;
    }
  }

  render(display){

    display.clear();
    display.drawText(2,2, "Press N to start a new game");

    display.drawText(2,3, "Press ESC to return to play");
    if(this.game.isPlaying){
      display.drawText(2,4, "Press S to save your game");
    }
    if(this.hasFile){
      display.drawText(2,5, "Press L to load saved game");
    }
  }

  handleInput(eventType, e){
    if(eventType == "keyup"){
      switch (e.keyCode) {
        //ESC
        case 27:
          this.game.switchModes('play');
          return true;
        //N
        case 78:
          d.DATA.clear();
          this.game.setupGame();
          this.game.switchModes('play');
          return true;
        //S
        case 83:
          d.DATA.handleSave(this.game);
          MessageHandler.send("Game saved");
          this.game.switchModes('play');
          return true;
        //L
        case 76:
          d.handleLoad(this.game);
          MessageHandler.send("Game loaded");
          this.game.switchModes('play');
          return true;

      }
    }
    return false;
  }
}

export class StartupMode extends Mode {
  render(display){
    display.clear();
    display.drawText(2,2, "You are a bard in a D&D party. Like all bards, you have always been happy to take a supporting role and hide behind the strength of the other party members. That is, until a snowstorm seperated you from the rest of the party. You must quickly learn to use your mismatched build, your grab bag of skills and your raw bardic charm to survive independently and rejoin the party.");
    display.drawText(2,10, "Press ENTER to continue")
  }

  handleInput(eventType, e){

    if(eventType == "keyup" && e.keyCode == 13){
      this.game.switchModes('menu');
      return true;
    }
  }
}
