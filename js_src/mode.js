import Game from "./util.js";
import * as d from "./data.js";
import { MessageHandler } from "./msg.js";
import { Symbol } from "./symbol.js";
import { TILES } from "./tile.js";
import { EntityFactory } from "./entities.js";
import { BINDINGS } from "./key.js";
import { TIMER } from "./timing.js";

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
    TIMER.engine.unlock();
  }

  exit() {
    TIMER.engine.lock();
  }
  render(display) {
    display.clear();
    d.DATA.currentMap().drawOn(
      display,
      d.DATA.state.cameraLocation.x,
      d.DATA.state.cameraLocation.y
    );
    //d.DATA.getAvatar()Symbol.drawOn(display, Math.round(display.getOptions().width / 2), Math.round(display.getOptions().height / 2));
  }
  renderAvatar(display) {
    display.drawText(2, 2, "Class: Bard");
    display.drawText(2, 4, `Time: ${d.DATA.getAvatar().getTime()}`);
    display.drawText(
      2,
      6,
      `HP: ${d.DATA.getAvatar().getCurHp()}/${d.DATA.getAvatar().getMaxHp()}`
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
        d.DATA.getAvatar().tryMove(
          moveKeys[e.keyCode].x,
          moveKeys[e.keyCode].y
        );

        TIMER.engine.unlock();
        if (
          d.DATA.currentMap().getTile(d.DATA.getAvatar().getPos()) ==
          TILES.STAIRS
        ) {
          if (d.DATA.dungeonLevel == d.DATA.dungeon.getSize()) {
            this.game.switchModes("win");
          } else {
            d.DATA.currentMap().removeEntity(d.DATA.getAvatar());
            d.DATA.state.dungeonLevel++;
            var map = d.DATA.dungeon.getMap(d.DATA.state.dungeonLevel);
            d.DATA.state.currentMapId = map.getId();
            map.addEntityAt(d.DATA.getAvatar(), map.getRandomPointInRoom());
            d.DATA.state.cameraLocation = d.DATA.getAvatar().getPos();
            MessageHandler.send(
              `Advancing to floor ${d.DATA.state.dungeonLevel}`
            );
          }
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
