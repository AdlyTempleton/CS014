import {MessageHandler} from './msg.js'
export let DATA = {
  clear: function(){
    this.level = 0;
    this.playerLocation = {x:0, y:0};
    this.nextMapId = 1;
    this.maps = {};
  },

  init: function(game){
    this.clear();
    this.game = game;
  },

  handleSave: function(game){
    if(!localStorageAvailable()){
      return;
    }
    window.localStorage.setItem(game.SAVE_LOCATION,JSON.stringify(this));
  }
}


function handleLoad(game){
  DATA = JSON.parse(window.localStorage.getItem(game.SAVE_LOCATION));
}

//Fix copied from weed strike
function localStorageAvailable() {
  // NOTE: see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  try {
    var x = '__storage_test__';
    window.localStorage.setItem( x, x);
    window.localStorage.removeItem(x);
    return true;
  }
  catch(e) {
    MessageHandler.send('Sorry, no local data storage is available for this browser so game save/load is not possible');
    return false;
  }
}
