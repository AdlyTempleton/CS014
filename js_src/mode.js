import Game from './util.js'

class Mode {

  constructor(g){
    this.game = g;
    console.log("created " + this.constructor.name);
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

    render(display){

      display.clear();
      display.drawText(2, 2, "Press W to win, press L to lose");
    }

    handleInput(eventType, e){
      if(eventType == "keyup" && e.keyCode == 87){
        this.game.switchModes('win')
        return true;
      }

      if(eventType == "keyup" && e.keyCode == 76){
        this.game.switchModes('lose')
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

export class StartupMode extends Mode {
  render(display){
    display.clear();
    display.drawText(2,2, "You are a bard in a D&D party. Like all bards, you have always been happy to take a supporting role and hide behind the strength of the other party members. That is, until a snowstorm seperated you from the rest of the party. You must quickly learn to use your mismatched build, your grab bag of skills and your raw bardic charm to survive independently and rejoin the party.");
    display.drawText(2,10, "Press ENTER to continue")
  }

  handleInput(eventType, e){

    console.log(e.event);
    console.log(e.keyCode);
    if(eventType == "keyup" && e.keyCode == 13){
      this.game.switchModes('play');
      return true;
    }
  }
}
