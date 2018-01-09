import {Symbol} from './symbol.js'

export class Tile{

  constructor(name, symbol){
    this.name = name;
    this.symbol = symbol;
  }

  drawOn(display, x, y){
    this.symbol.drawOn(display, x, y);
  }
}

export let TILES = {
  EMPTY: new Tile('EMPTY', new Symbol(' ')),
  WALLS: new Tile('WALLS', new Symbol('#')),
  STAIRS: new Tile('STAIRS', new Symbol('=', '#32CD32')),
}
