import * as d from "./data.js";
import { MessageHandler } from "./msg.js";
import * as status from "./status.js";
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
      duration: 5
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
      duration: 30
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
      duration: 40
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
      duration: 20
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
