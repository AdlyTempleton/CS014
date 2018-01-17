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
    "HitPoints",
    "AvatarMixin",
    "MeeleeAttacker",
    "Logger",
    "PlayerActor"
  ],
  meeleeAttack: 2,
  maxHp: 20
});

EntityFactory.learn({
  name: "traveler",
  symbol: new Symbol("T", "#4f4"),
  mixinNames: ["CorporealMover", "Wander"]
});

EntityFactory.learn({
  name: "witch",
  symbol: new Symbol("W", "#006400"),
  mixinNames: ["CorporealMover", "Wander", "HitPoints", "Spawner"],
  spawnFrequency: 3
});

EntityFactory.learn({
  name: "rat",
  symbol: new Symbol("R", "#808080"),
  mixinNames: [
    "CorporealMover",
    "WanderAttackNearby",
    "HitPoints",
    "MeeleeAttacker"
  ],
  friendlyTypes: ["witch"],
  maxHp: 4
});
