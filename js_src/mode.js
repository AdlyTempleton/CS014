import Game from "./util.js";
import { tryMusic } from "./skills.js";
import * as d from "./data.js";
import { MessageHandler } from "./msg.js";
import { Symbol } from "./symbol.js";
import { TILES } from "./tile.js";
import { EntityFactory } from "./entities.js";
import { BINDINGS } from "./key.js";
import { TIMER } from "./timing.js";
import { expForLevel } from "./util.js";
import { getAllSpells } from "./spells.js";
import { PICKPOCKET_SPELL_DUMMY } from "./spells.js";
import ROT from "rot-js";

import { STAT_NAMES } from "./stats.js";

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
}

export class PlayMode extends Mode {
  constructor(game) {
    super(game);
    this.castSymbol = new Symbol("+", "#f00");
  }

  enter() {
    super.enter();
    TIMER.engine.unlock();
  }

  exit() {
    TIMER.engine.lock();
    d.DATA.state.castTarget = null;
  }
  render(display) {
    display.clear();
    d.DATA.currentMap().drawOn(
      display,
      d.DATA.state.cameraLocation.x,
      d.DATA.state.cameraLocation.y
    );
    if (d.DATA.state.castTarget != null) {
      let o = display.getOptions();
      let xStart = d.DATA.state.cameraLocation.x - Math.round(o.width / 2);
      let yStart = d.DATA.state.cameraLocation.y - Math.round(o.height / 2);
      this.castSymbol.drawOn(
        display,
        d.DATA.state.castTarget.x - xStart,
        d.DATA.state.castTarget.y - yStart
      );
    }
    //d.DATA.getAvatar()Symbol.drawOn(display, Math.round(display.getOptions().width / 2), Math.round(display.getOptions().height / 2));
  }

  handleInput(eventType, e) {
    if (eventType == "keyup") {
      switch (e.keyCode) {
        case BINDINGS.MENU.id:
          if (d.DATA.state.castTarget != null) {
            d.DATA.state.castTarget = null;
          } else {
            this.game.switchModes("menu");
          }
          return true;
      }
    }

    if (eventType == "keydown") {
      if (e.keyCode == BINDINGS.SPELL_CAST.id) {
        if (d.DATA.state.castTarget != null) {
          MessageHandler.send(`Casting ${d.DATA.state.casting.getName()}`);

          if (d.DATA.state.casting.targetType() == "any") {
            d.DATA.state.casting.cast(
              d.DATA.getAvatar(),
              d.DATA.state.castTarget
            );
          }
          if (d.DATA.state.casting.targetType() == "entity") {
            var entity = d.DATA.currentMap().getEntityObjectAt(
              d.DATA.state.castTarget
            );
            if (entity != null) {
              d.DATA.state.casting.cast(d.DATA.getAvatar(), entity);
            } else {
              MessageHandler.send("Failed to cast spell: no entity target");
              d.DATA.state.castTarget = null;
            }
          }

          d.DATA.state.casting = {};
          d.DATA.state.castTarget = null;

          TIMER.engine.unlock();

          return true;
        }
      }
      if (e.which <= 57 && e.which >= 49) {
        var num = e.which - 48;
        var spell = d.DATA.state.spells[num];
        if (d.DATA.state.spellCharges[num] <= 0) {
          MessageHandler.send("Not enough charges left");
          return true;
        } else {
          d.DATA.state.spellCharges[num]--;
        }

        if (spell.isTargetted()) {
          MessageHandler.send(`Preparing to cast ${spell.getName()}`);
          d.DATA.state.casting = spell;
          d.DATA.state.castTarget = d.DATA.getAvatar().getPos();
          MessageHandler.send(
            `Press ${BINDINGS.SPELL_CAST.name} to cast, ${
              BINDINGS.MENU.name
            } to cancel`
          );
        } else {
          spell.cast(d.DATA.getAvatar(), null);
          MessageHandler.send(`Casting ${spell.getName()}`);

          TIMER.engine.unlock();
        }
        return true;
      }
      if (
        e.keyCode == BINDINGS.PICKPOCKET.id &&
        d.DATA.getPlayerSkill("pickpocket") > 0
      ) {
        MessageHandler.send(`Preparing to pickpocket`);
        d.DATA.state.casting = PICKPOCKET_SPELL_DUMMY;
        d.DATA.state.castTarget = d.DATA.getAvatar().getPos();
        MessageHandler.send(
          `Press ${BINDINGS.SPELL_CAST.name} to pickpocket, ${
            BINDINGS.MENU.name
          } to cancel`
        );
      }
      if (
        e.keyCode == BINDINGS.MUSIC.id &&
        d.DATA.getPlayerSkill("music") > 0
      ) {
        tryMusic(d.DATA.getAvatar());
        MessageHandler.send("Playing Music");
      }
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
        if (d.DATA.state.castTarget != null) {
          var spell = d.DATA.state.casting;
          var newTargetLoc = {
            x: d.DATA.state.castTarget.x + moveKeys[e.keyCode].x,
            y: d.DATA.state.castTarget.y + moveKeys[e.keyCode].y
          };
          var avatarPos = d.DATA.getAvatar().getPos();
          var distance =
            (avatarPos.x - newTargetLoc.x) ** 2 +
            (avatarPos.y - newTargetLoc.y) ** 2;
          if (spell.getRadius() == -1 || distance <= spell.getRadius() ** 2) {
            d.DATA.state.castTarget = newTargetLoc;
          }
        } else {
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

export class LevelMode extends Mode {
  enter() {
    super.enter();
    this.phase = 1;
    this.statBoostsLeft = 4;
    this.pickStatOptions();
  }
  pickStatOptions() {
    do {
      this.statOption1 =
        STAT_NAMES[ROT.RNG.getUniformInt(0, STAT_NAMES.length - 1)];
      this.statOption2 =
        STAT_NAMES[ROT.RNG.getUniformInt(0, STAT_NAMES.length - 1)];
    } while (this.statOption1 == this.statOption2);
  }
  render(display) {
    display.clear();

    if (this.phase == 1) {
      display.drawText(2, 2, "Select an stat to increase");
      display.drawText(2, 4, `1: ${this.statOption1}`);
      display.drawText(2, 5, `2: ${this.statOption2}`);
      display.drawText(2, 6, `${this.statBoostsLeft} boosts left`);
    } else {
      display.drawText(2, 2, "Select an skill to increase");

      display.drawText(2, 4, `1: Pickpocketing`);
      display.drawText(2, 5, `2: Fencing`);
      display.drawText(2, 6, `3: Music`);
    }
  }

  handleInput(eventType, e) {
    if (eventType == "keypress") {
      if (this.phase == 1) {
        if (e.which == 49 || e.which == 50) {
          var stat = e.which == 49 ? this.statOption1 : this.statOption2;
          d.DATA.getAvatar()
            .getStats()
            .increaseStat(stat);
          this.statBoostsLeft--;
          if (this.statBoostsLeft) {
            this.pickStatOptions();
          } else {
            this.phase = 2;
          }
          return true;
        }
      } else if (this.phase == 2) {
        if (e.which == 49 || e.which == 50 || e.which == 51) {
          var keyMap = { 49: "pickpocket", 50: "fencing", 51: "music" };
          var skillName = keyMap[e.which];
          d.DATA.getAvatar().state.skills[skillName]++;
          this.game.switchModes("play");
        }
      }
    }
  }

  renderAvatar(display) {
    this.game.modes.play.renderAvatar(display);
  }
}

export class SpellMode extends Mode {
  enter() {
    super.enter();
    do {
      this.spell = getAllSpells()[
        ROT.RNG.getUniformInt(0, getAllSpells().length - 1)
      ];

      //Repeat until we find a spell we do not own
    } while (Object.values(d.DATA.state.spells).indexOf(this.spell) != -1);
  }
  render(display) {
    display.clear();
    display.drawText(2, 2, "You have Found a spell");
    display.drawText(2, 4, this.spell.getName());
    display.drawText(2, 5, `Choose the slot to place the spell in`);
    display.drawText(2, 6, `Or press 'D' to discard`);
  }

  handleInput(eventType, e) {
    if (eventType == "keypress") {
      if (e.which >= 49 && e.which <= 57) {
        var slot = e.which - 48;
        d.DATA.state.spells[slot] = this.spell;
        d.DATA.state.spellCharges[slot] = 3;
        this.game.switchModes("play");
        return true;
      } else if (e.which == 68) {
        this.game.switchModes("play");
        return true;
      }
    }
  }

  renderAvatar(display) {
    this.game.modes.play.renderAvatar(display);
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
