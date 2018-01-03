# Design Doc for Weed Strike

### Goals

Weed Strike is a fairly standard, simple roguelike. As such, the player gets
* character advancement/progression (on the mechanics side of things, not necessarily the story side)
  * some opponents that are too challenging to fight in the early stages of the game are easy to beat by the later stages of the game
* inventory management
* primary mob interactions are combat ('attack it' is never a bad choice from a story standpoint)
  * some tactically interesting combat
    * at the very least, players must make decisions about whether to fight or flee a given opponent
* exploration (of procedurally generated content)
* a simple framing story to engage the player and justify the avatar actions, but nothing to deep and little in the way of narrative progression
* a final battle/goal
* other standard roguelike experiences (permadeath, turn-based action, etc.)

### Story

The story is a typical zombie-apocalypse type story. The player controls one of the last human survivors of the zombie apocalypse. However, the traditional zombie survivor strategy is subverted when the player discovers that they can train defeated zombies to act as semi-autonomous units working towards their goals. The player initially amasses a small army of trained zombies. However, they quickly encounter other survivors with potentially unsavory motives.

### Mechanics

Loose zombies are roaming around on the map. The player can defeat some of them in a (fairly simple) combat system. Upon defeating them, the player can assign these zombies to various tasks. Trained zombies will roam around the map independent of the player.
