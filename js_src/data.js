import { MessageHandler } from "./msg.js";
import { mapFactory } from "./map.js";
import { Entity } from "./entity.js";
import { EntityFactory } from "./entities.js";
export let DATA = {
  clear: function() {
    this.level = 0;
    this.cameraLocation = { x: 0, y: 0 };
    this.nextMapId = 1;
    this.nextEntityId = 1;
    this.maps = {};
    this.entities = {};
    this.currentMapId = "";
  },

  getEntityFromId: function(eid) {
    return this.entities[eid];
  },

  getAvatar: function() {
    return this.getEntityFromId(this.avatarId);
  },

  init: function(game) {
    this.clear();
    this.game = game;
  },

  currentMap: function() {
    return this.maps[this.currentMapId];
  },

  handleSave: function(game) {
    if (!localStorageAvailable()) {
      return;
    }

    window.localStorage.setItem(game.SAVE_LOCATION, JSON.stringify(this));
  }
};

export function handleLoad(game) {
  let saved = JSON.parse(window.localStorage.getItem(game.SAVE_LOCATION));

  DATA.clear();
  DATA.game = game;

  game.fromJSON(saved.game);

  DATA.level = saved.level;
  DATA.cameraLocation = saved.cameraLocation;
  DATA.nextMapId = saved.nextMapId;
  DATA.currentMapId = saved.currentMapId;
  DATA.nextEntityId = saved.nextEntityId;

  for (var mapid in saved.maps) {
    if (!saved.maps.hasOwnProperty(mapid)) continue;
    DATA[mapid] = mapFactory(saved.maps[mapid]);
  }

  for (var entityId in saved.entities) {
    var entity = EntityFactory.create(saved.entities[entityId].templateName);
    entity.state = saved.entities[entityId].state;
    DATA.entities[entityId] = entity;

    //Readd to the map;
    entity.getMap().addEntityAt(entity, entity.getPos());
  }

  DATA.game.modes.play.avatarId = saved.avatarId;

  DATA.game.modes.play.avatar = DATA.entities[saved.avatarId];
}

//Fix copied from weed strike
function localStorageAvailable() {
  // NOTE: see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  try {
    var x = "__storage_test__";
    window.localStorage.setItem(x, x);
    window.localStorage.removeItem(x);
    return true;
  } catch (e) {
    MessageHandler.send(
      "Sorry, no local data storage is available for this browser so game save/load is not possible"
    );
    return false;
  }
}
