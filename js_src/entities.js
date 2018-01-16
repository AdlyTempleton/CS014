import { Entity } from "./entity.js";
import { Factory } from "./factory.js";
import { Symbol } from "./symbol.js";

export let EntityFactory = new Factory(Entity, "entities");

EntityFactory.learn({
  name: "avatar",
  symbol: new Symbol("@", "#dd4"),
  mixinNames: ["TimeTracker", "CorporealMover", "HitPoints", "AvatarMixin"],
  maxHp: 10
});

EntityFactory.learn({
  name: "traveler",
  symbol: new Symbol("T", "#4f4"),
  mixinNames: ["CorporealMover", "Wander"]
});

EntityFactory.learn({
  name: "rat",
  symbol: new Symbol("R", "#808080"),
  mixinNames: [
    "CorporealMover",
    "WanderAttackNearby",
    "HitPoints",
    "MeeleeAttacker"
  ]
});
