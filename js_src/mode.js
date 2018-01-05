class Mode {

  constructor(){
    console.log("created " + this.constructor.name);
  }

  enter() {}

  exit(){}

  handleInput(){}

  render(display){
    display.drawText(2, 2, "rendering " + this.constructor.name)

  }

}

export class PlayMode extends Mode {
}

export class WinMode extends Mode{}

export class LoseMode extends Mode{}

export class StartupMode extends Mode {
  render(display){

    display.drawText(2,2, "You are a bard in a D&D party. Like all bards, you have always been happy to take a supporting role and hide behind the strength of the other party members. That is, until a snowstorm seperated you from the rest of the party. You must quickly learn to use your mismatched build, your grab bag of skills and your raw bardic charm to survive independently and rejoin the party.");

    display.drawText(2,10, "Press ENTER to continue")
  }
}
