import Game from './util.js'
import * as d from './data.js'
import {MessageHandler} from './msg.js'
import {Symbol} from './symbol.js'

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
      this.game.isPlaying = true;
      this.avatarSymbol = new Symbol('@','#dd4');
    }
    render(display){

      display.clear();
      this.game.map.drawOn(display, 0, 0);
      this.avatarSymbol.drawOn(display,this.game.data.playerLocation.x,this.game.data.playerLocation.y);
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
        switch(e.keyCode){
          case 65:
            this.game.data.playerLocation.x -= 1;
            return true;
          case 87:
            this.game.data.playerLocation.y -= 1;
            return true;
          case 68:
            this.game.data.playerLocation.x += 1;
            return true;
          case 83:
              this.game.data.playerLocation.y += 1;
              return true;
        }
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
          this.game.data.clear();
          this.game.switchModes('play');
          return true;
        //S
        case 83:
          this.game.data.handleSave(this.game);
          MessageHandler.send("Game saved");
          this.game.switchModes('play');
          return true;
        //L
        case 76:
          this.game.data = d.handleLoad(this.game);
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
