import Game from "./util.js";
import * as d from "./data.js";
import { MessageHandler } from "./msg.js";
import { Symbol } from "./symbol.js";
import { TILES } from "./tile.js";
import { EntityFactory } from "./entities.js";
import { BINDINGS } from "./key.js";

class Mode {
  constructor(g) {
    this.game = g;
  }

  enter() {
    this.game.msg.send(`Entering ${this.constructor.name}`);
  }

  exit() {}

  handleInput(eventType, e) {}

  render(display) {}

  renderAvatar(display) {}
}

export class PlayMode extends Mode {
  enter() {
    super.enter();
  }
  render(display) {
    display.clear();
    d.DATA.currentMap().drawOn(
      display,
      d.DATA.cameraLocation.x,
      d.DATA.cameraLocation.y
    );
    //this.avatarSymbol.drawOn(display, Math.round(display.getOptions().width / 2), Math.round(display.getOptions().height / 2));
  }

  takeTurns() {
    var entities = d.DATA.currentMap().getAllEntities();

    for (let ei = 0; ei < entities.length; ei++) {
      let entity = entities[ei];
      if (entity.hasOwnProperty("takeTurn")) {
        entity.takeTurn({ avatar: this.avatar });
      }
    }
  }

  renderAvatar(display) {
    display.drawText(2, 2, "Class: Bard");
    display.drawText(2, 4, `Time: ${this.avatar.getTime()}`);
    display.drawText(
      2,
      6,
      `HP: ${this.avatar.getCurHp()}/${this.avatar.getMaxHp()}`
    );
  }

  handleInput(eventType, e) {
    if (eventType == "keyup") {
      switch (e.keyCode) {
        case BINDINGS.MENU.id:
          this.game.switchModes("menu");
          return true;
      }
    }

    if (eventType == "keydown") {
      if (e.keyCode == BINDINGS.KEY_HELP.id) {
        this.game.switchModes("help");
        return true;
      }

      //Moving code
      //A map from key codes to coordinates to move
      //var moveKeys = {2: {x: -1, y:0}};
      var moveKeys = {
        65: { x: -1, y: 0 },
        87: { x: 0, y: -1 },
        68: { x: 1, y: 0 },
        83: { x: 0, y: 1 }
      };

      if (e.keyCode in moveKeys) {
        this.avatar.tryMove(moveKeys[e.keyCode].x, moveKeys[e.keyCode].y);

        this.takeTurns();
        if (d.DATA.currentMap().getTile(this.avatar.getPos()) == TILES.STAIRS) {
          this.game.switchModes("win");
        }
      }
      return true;
    }
  }
}

export class WinMode extends Mode {
  render(display) {
    display.clear();
    display.drawText(2, 2, "You have successfully rejoined the party.");
  }
}

export class LoseMode extends Mode {
  render(display) {
    display.clear();
    display.drawText(2, 2, "You have died.");
  }
}

export class HelpMode extends Mode {
  render(display) {
    display.clear();
    var i = 2;
    for (var k in BINDINGS) {
      if (BINDINGS.hasOwnProperty(k)) {
        display.drawText(2, i++, BINDINGS[k].name);
        display.drawText(6, i++, BINDINGS[k].desc, "#f00");
      }
    }
  }

  handleInput(eventType, e) {
    if (eventType == "keydown" && e.keyCode == BINDINGS.KEY_HELP.id) {
      this.game.switchModes("play");
      return true;
    }
  }
}

export class MenuMode extends Mode {
  enter() {
    super.enter();
    if (window.localStorage.getItem(this.game.SAVE_LOCATION)) {
      this.hasFile = true;
    }
  }

  render(display) {
    display.clear();
    display.drawText(2, 2, "Press N to start a new game");

    display.drawText(2, 3, "Press ESC to return to play");
    if (this.game.isPlaying) {
      display.drawText(2, 4, "Press S to save your game");
    }
    if (this.hasFile) {
      display.drawText(2, 5, "Press L to load saved game");
    }
  }

  handleInput(eventType, e) {
    if (eventType == "keyup") {
      switch (e.keyCode) {
        //ESC
        case BINDINGS.MENU.id:
          this.game.switchModes("play");
          return true;
        //N
        case BINDINGS.NEW_GAME.id:
          d.DATA.clear();
          this.game.setupGame();
          this.game.switchModes("play");
          return true;
        //S
        case BINDINGS.SAVE_GAME.id:
          d.DATA.handleSave(this.game);
          MessageHandler.send("Game saved");
          this.game.switchModes("play");
          return true;
        //L
        case BINDINGS.LOAD_GAME.id:
          d.handleLoad(this.game);
          MessageHandler.send("Game loaded");
          this.game.switchModes("play");
          return true;
      }
    }
    return false;
  }
}

export class StartupMode extends Mode {
  render(display) {
    display.clear();
    display.drawText(
      2,
      2,
      "You are a bard in a D&D party. Like all bards, you have always been happy to take a supporting role and hide behind the strength of the other party members. That is, until a snowstorm seperated you from the rest of the party. You must quickly learn to use your mismatched build, your grab bag of skills and your raw bardic charm to survive independently and rejoin the party."
    );
    display.drawText(2, 10, "Press ENTER to continue");
  }

  handleInput(eventType, e) {
    if (eventType == "keyup" && e.keyCode == BINDINGS.START_GAME.id) {
      this.game.switchModes("menu");
      return true;
    }
  }
}
