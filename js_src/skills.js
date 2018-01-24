import * as d from "./data.js";
import ROT from "rot-js";

import { Game } from "./game.js";
import { MessageHandler } from "./msg.js";
import * as status from "./status.js";
export function tryPickpocket(avatar, target) {
  if (!target.isPickpocketable()) {
    MessageHandler.send("This type of target cannot be pickpocketed");
    return;
  }
  var skill =
    d.DATA.getPlayerStatModifier("Chr") + d.DATA.getPlayerStatModifier("Dex");
  var level = d.DATA.getPlayerSkill("pickpocket");
  skill = Math.max(1, skill) ** (1 + level * 0.2) + 3 * level;
  var advantage =
    skill - target.getPickpocketDefense() + ROT.RNG.getUniformInt(-5, 5);
  var success = ROT.RNG.getUniformInt(0, 20) < advantage;
  if (success) {
    if (target.hasPickpocketItem()) {
      Game.switchModes("spell");
      avatar.raiseMixinEvent("gainExp", { amt: 300 });
    } else {
      MessageHandler.send("The target's pockets were empty");
    }
  } else {
    MessageHandler.send("Pickpocketing failed");
    target.raiseMixinEvent("failedPickpocket");
  }
}

export function tryMusic(avatar) {
  var musicLevel = d.DATA.getPlayerSkill("music");
  var affected = d.DATA.currentMap().getEntitiesWithinExcluding(
    avatar,
    3 + musicLevel
  );
  var offensiveSkill =
    Math.max(1, d.DATA.getPlayerStatModifier("Chr")) ** (1 + musicLevel * 0.2) +
    3 * musicLevel;
  var oneSuccess = false;
  for (var i = 0; i < affected.length; i++) {
    var entity = affected[i];
    if (
      entity.hasOwnProperty("getStatus") &&
      entity.getStatus() != status.SLEEP
    ) {
      var resistance = 3;
      if (entity.hasOwnProperty("getStats")) {
        resistance = Math.max(1, entity.getStats().getModifier("Int"));
      }
      if (entity.getStatus() == status.DROWZY) {
        resistance = -5;
      }
      var advantage = offensiveSkill - resistance;
      if (ROT.RNG.getUniformInt(0, 20) < advantage) {
        oneSuccess = true;
        entity.raiseMixinEvent("inflictStatus", {
          status: status.SLEEP,
          duration: 10
        });
      }
    }
  }

  if (!oneSuccess) {
    MessageHandler.send(
      "No entities put to sleep: 2 points of frustration damage"
    );
    avatar.loseHp(2);
  }
}
