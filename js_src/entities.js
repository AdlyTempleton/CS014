/**
 * A list of entity templates
 * Exports an EntityFactory with all the tempaltes learned
 */
import { Entity } from "./entity.js";
import { Factory } from "./factory.js";
import { Symbol } from "./symbol.js";

export let EntityFactory = new Factory(Entity, "entities");

EntityFactory.learn({
  name: "avatar",
  symbol: new Symbol("@", "#dd4"),
  mixinNames: [
    "TimeTracker",
    "CorporealMover",
    "AvatarMixin",
    "MeeleeAttacker",
    "Logger",
    "PlayerActor",

    "StatsMixin",

    "HitPoints"
  ],
  meeleeAttack: 2,
  maxHp: 20
});

EntityFactory.learn({
  name: "traveler",
  symbol: new Symbol("T", "#4f4"),
  mixinNames: ["CorporealMover", "Wander", "Likes", "Pickpocketable"],
  likes: ["sound"]
});

EntityFactory.learn({
  name: "witch",
  symbol: new Symbol("W", "#006400"),
  mixinNames: [
    "CorporealMover",
    "Wander",

    "Spawner",
    "StatusAffected",
    "Likes",
    "HitPoints"
  ],
  likes: ["sound"],
  spawnFrequency: 3
});

EntityFactory.learn({
  name: "light",
  symbol: new Symbol("L", "#FFFF33"),
  mixinNames: ["Overwalkable", "Vanishing"]
});

EntityFactory.learn({
  name: "sound",
  symbol: new Symbol("S", "#FFFF33"),
  mixinNames: ["Overwalkable"]
});

EntityFactory.learn({
  name: "spellbook",
  symbol: new Symbol("B", "#6495ed"),
  mixinNames: ["Spellbook"]
});

EntityFactory.learn({
  name: "rat",
  symbol: new Symbol("R", "#808080"),
  mixinNames: [
    "CorporealMover",
    "WanderAttackNearby",
    "StatsMixin",
    "RandomizedStats",
    "MeeleeAttacker",
    "DropsExp",
    "Fears",
    "StatusAffected",
    "HitPoints"
  ],
  fears: ["light"],
  friendlyTypes: ["witch"],
  statLevel: 5,
  maxHp: 4
});

EntityFactory.learn({
  name: "guard",
  symbol: new Symbol("G", "#808080"),
  mixinNames: [
    "CorporealMover",
    "AttackNearby",
    "MeeleeAttacker",
    "DropsExp",
    "Pickpocketable",
    "Spawner",
    "DropsExp",
    "StatusAffected",
    "HitPoints"
  ],
  likes: ["light", "sound"],
  friendlyTypes: ["guard"],
  spawnFrequency: 500,
  spawnType: "guard",
  maxHp: 5,
  attack: 5
});
