import {Symbol} from './symbol.js'

export class Tile{

  constructor(name, symbol, passable){
    this.name = name;
    this.passable = passable;
    this.symbol = symbol;
  }

  drawOn(display, x, y){
    this.symbol.drawOn(display, x, y);
  }

  isPassable(){
    return this.passable;
  }
}

export let TILES = {
  EMPTY: new Tile('EMPTY', new Symbol(' '), true),
  WALLS: new Tile('WALLS', new Symbol('#'), false),
  STAIRS: new Tile('STAIRS', new Symbol('=', '#32CD32'), true),
}
