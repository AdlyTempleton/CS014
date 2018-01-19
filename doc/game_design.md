# Design Doc for Wandering Bard

### Goals

Wandering Bard is a fairly standard, simple roguelike. As such, the player gets

* character advancement/progression
  * Skills which are received on levelup
  * Items which are picked up/looted
* Many ways to interact with and defeat entities
* exploration (of procedurally generated content
* other standard roguelike experiences (permadeath, turn-based action, etc.)

### Story

You are a bard in a D&D party. Like all bards, you have always been happy to take a supporting role and hide behind the strength of the other party members. That is, until a snowstorm seperated you from the rest of the party. You must quickly learn to use your mismatched build, your grab bag of skills and your raw bardic charm to survive independently and rejoin the party.

### Mechanics

* Standard win/loss conditions. Win by progressing through n levels of the dungeon.

* The primary entropy mechanic is that players run out of certain spells, and have to recharge them by progressing to the next level of the dungeon

* Combat

  * The central concept of the game is that the player has little, if any, direct ways to defeat enemies (ie. standard meelee attacks). While such attacks may become available at higher levels, they are far too weak to defeat most enemies. Instead, the player must defeat enemies through one of several mechanics.

    * Bardic Music

      * The player can play one of several instruments to put enemies to sleep. Sleeping enemies can be avoided or easily damaged.

    * Familiars

      * The player can obtain a farmarilar, of several different types, which will move seperatley from the player and engage in meelee combat.

    * Environmental Hazards

      * Several spells are able to take advantage of nearby environmental features to kill EnemyAttributes

    * Weaknesses

      * Each type of enemy will die to certain spells when used in certain combinations
