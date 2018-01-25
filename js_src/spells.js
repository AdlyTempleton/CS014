import * as d from "./data.js";
import { MessageHandler } from "./msg.js";
import * as status from "./status.js";
import * as skills from "./skills.js";
export function getAllSpells() {
  return [
    BLINK_SPELL,
    LIGHT_SPELL,
    SOUND_SPELL,
    DAZE_SPELL,
    FLARE_SPELL,
    LULLABY_SPELL,
    FEAR_SPELL,
    HEAL_LIGHT_SPELL,
    HEAL_MODERATE_SPELL,
    HEAL_CRITICAL_SPELL
  ];
}

export function getSpellMap() {
  var r = {};
  var spells = getAllSpells();
  for (var i = 0; i < spells.length; i++) {
    var spell = spells[i];
    r[spell.getName()] = spell;
  }
  return r;
}
export let DEBUG_SPELL = {
  isTargetted() {
    return true;
  },
  targetType() {
    return "any";
  },
  getName() {
    return "Debug";
  },
  getRadius() {
    return -1;
  },
  cast(avatar, target) {
    console.log(target);
  },
  isTargetted() {
    return true;
  }
};

export let PICKPOCKET_SPELL_DUMMY = {
  isSkill() {
    return true;
  },
  isTargetted() {
    return true;
  },
  targetType() {
    return "entity";
  },
  getName() {
    return "Pickpocket";
  },
  cast(avatar, target) {
    skills.tryPickpocket(avatar, target);
  },
  getRadius() {
    return 1;
  },
  isTargetted() {
    return true;
  }
};

export let BLINK_SPELL = {
  isTargetted() {
    return true;
  },
  targetType() {
    return "any";
  },
  getName() {
    return "Blink";
  },
  cast(avatar, target) {
    var entityTarget = d.DATA.currentMap().getEntityObjectAt(target);
    var backPos = avatar.getPos();
    avatar.moveTo(target);
    if (entityTarget != null) {
      entityTarget.moveTo(backPos);
    }
  },
  getRadius() {
    return 3;
  },
  isTargetted() {
    return true;
  }
};

export let LIGHT_SPELL = {
  isTargetted() {
    return true;
  },
  targetType() {
    return "any";
  },
  getName() {
    return "Dancing Lights";
  },
  cast(avatar, target) {
    if (d.DATA.currentMap().getEntityAt(target) == undefined) {
      d.DATA.currentMap().spawnEntityAt("light", target);
    } else {
      MessageHandler.send("Failed to cast because an entity was in the way");
    }
  },
  getRadius() {
    return 3;
  },
  isTargetted() {
    return true;
  }
};

export let DAZE_SPELL = {
  isTargetted() {
    return true;
  },
  targetType() {
    return "entity";
  },
  getName() {
    return "Daze";
  },
  cast(avatar, target) {
    target.raiseMixinEvent("inflictStatus", {
      status: status.DAZED,
      duration: 5 + 2 * d.DATA.getPlayerStatModifier("Wis")
    });
  },
  getRadius() {
    return 5;
  },
  isTargetted() {
    return true;
  }
};

export let SOUND_SPELL = {
  isTargetted() {
    return true;
  },
  targetType() {
    return "any";
  },
  getName() {
    return "Ghost Sound";
  },
  cast(avatar, target) {
    if (d.DATA.currentMap().getEntityAt(target) == undefined) {
      d.DATA.currentMap().spawnEntityAt("sound", target);
    } else {
      MessageHandler.send("Failed to cast because an entity was in the way");
    }
  },
  getRadius() {
    return 8;
  },
  isTargetted() {
    return true;
  }
};

export let FLARE_SPELL = {
  isTargetted() {
    return true;
  },
  targetType() {
    return "entity";
  },
  getName() {
    return "Flare";
  },
  cast(avatar, target) {
    target.raiseMixinEvent("inflictStatus", {
      status: status.DAZZLED,
      duration: 30 + 10 * d.DATA.getPlayerStatModifier("Wis")
    });
  },
  getRadius() {
    return 10;
  },
  isTargetted() {
    return true;
  }
};

export let LULLABY_SPELL = {
  isTargetted() {
    return true;
  },
  targetType() {
    return "entity";
  },
  getName() {
    return "Lullaby";
  },
  cast(avatar, target) {
    target.raiseMixinEvent("inflictStatus", {
      status: status.DROWZY,
      duration: 40 + 20 * d.DATA.getPlayerStatModifier("Wis")
    });
  },
  getRadius() {
    return 5;
  },
  isTargetted() {
    return true;
  }
};

export let FEAR_SPELL = {
  isTargetted() {
    return true;
  },
  targetType() {
    return "entity";
  },
  getName() {
    return "Fear";
  },
  cast(avatar, target) {
    target.raiseMixinEvent("inflictStatus", {
      status: status.FEAR,
      duration: 20 + 5 * d.DATA.getPlayerStatModifier("Wis")
    });
  },
  getRadius() {
    return 3;
  },
  isTargetted() {
    return true;
  }
};

export let HEAL_LIGHT_SPELL = {
  isTargetted() {
    return false;
  },
  targetType() {
    return "none";
  },
  getName() {
    return "Heal Light Wounds";
  },
  cast(avatar, target) {
    avatar.gainHp(3);
  },
  getRadius() {
    return -1;
  }
};

export let HEAL_MODERATE_SPELL = {
  isTargetted() {
    return false;
  },
  targetType() {
    return "none";
  },
  getName() {
    return "Heal Moderate Wounds";
  },
  cast(avatar, target) {
    avatar.gainHp(7);
  },
  getRadius() {
    return -1;
  }
};

export let HEAL_CRITICAL_SPELL = {
  isTargetted() {
    return false;
  },
  targetType() {
    return "none";
  },
  getName() {
    return "Heal Critical Wounds";
  },
  cast(avatar, target) {
    avatar.gainHp(15);
  },
  getRadius() {
    return -1;
  }
};
