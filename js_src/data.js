import {MessageHandler} from './msg.js'
export class Data {
  constructor(){
    this.attr = {};
    this.level = 0;
  }

  clear(){
    this.level = 0;
  }

  handleSave(game){
    if(!localStorageAvailable()){
      return;
    }
    window.localStorage.setItem(game.SAVE_LOCATION,JSON.stringify(this));
  }
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


export function handleLoad(game){
  if(!localStorageAvailable()){
    return new d.Data();
  }
  return JSON.parse(window.localStorage.getItem(game.SAVE_LOCATION));
}
