import ROT from 'rot-js';
import {TILES} from './tile.js'
import * as d from './data.js'
import {init2DArray, randomString} from './util.js';

class Map{

  constructor(w, h, type = 'basic'){

    this.attr = {};
    this.attr.w = w;
    this.attr.h = h;
    this.attr.type = type;
    this.attr.id = this.uid();
  }

  uid(){
    'map: ' + randomString() + d.DATA.nextMapId++;
  }

  getWidth(){return this.attr.w;}
  getHeight(){return this.attr.w;}

  getId(){return this.attr.id;}
  setId(id){this.attr.id = id;}

  getType(){return this.attr.type;}

  getSeed(){return this.attr.seed;}
  setSeed(seed){this.attr.seed = seed;}

  toJSON(){
    return JSON.stringify(this.attr);
  }

  inBounds(p){
    return p.x >= 0 && p.x < this.attr.w && p.y >= 0 && p.y < this.attr.h;
  }

  getTile(p){
    if(!this.inBounds(p)){
      return TILES.NULL;
    }
    return this.tg[p.x][p.y];
  }

  drawOn(display, camX, camY){
    let o = display.getOptions();

    let xStart = camX - Math.round(o.width/2);
    let yStart = camY - Math.round(o.height/2);


    for(let iw = 0; iw < o.width; iw++){
      for(let ih = 0; ih < o.height; ih++){
        this.getTile({x: iw + xStart, y:ih + yStart}).drawOn(display, iw, ih);
      }
    }
  }

  isTilePassable(p){
    return this.getTile(p).isPassable();
  }

  getRandomPointInRoom(){
    var rooms = this.o.getRooms();
    var room = rooms[ROT.RNG.getUniformInt(0, rooms.length - 1)];
    var xLoc = ROT.RNG.getUniformInt(room.getLeft(),room.getRight());
    var yLoc = ROT.RNG.getUniformInt(room.getBottom(),room.getTop());
    return {x: xLoc, y:yLoc}
  }

  build(){
    var options = {
    roomWidth: [8, 15], /* room minimum and maximum width */
    roomHeight: [8, 15], /* room minimum and maximum height */
    corridorLength: [10, 20], /* corridor minimum and maximum length */
    dugPercentage: 0.4, /* we stop after this percentage of level area has been dug out */
    timeLimit: 10000 /* we stop after this much time has passed (msec) */
    };

    this.tg = init2DArray(this.getWidth(), this.getHeight());
    this.o = new ROT.Map.Digger(this.getWidth(), this.getHeight(), options);
    var f = function(x, y, t){
      this.tg[x][y] = t ? TILES.WALLS : TILES.EMPTY;
    };
    this.o.create(f.bind(this));
    let p = this.getRandomPointInRoom();
    this.tg[p.x][p.y] = TILES.STAIRS;
    this.startLoc = this.getRandomPointInRoom();
  }
}

export function mapFactory(w, h){
  return new Map(w, h)
}
