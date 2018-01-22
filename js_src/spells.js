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
  canTarget(pos) {
    return true;
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
    return "Debug";
  },
  cast(avatar, target) {
    console.log(target);
  },
  isTargetted() {
    return true;
  }
};
