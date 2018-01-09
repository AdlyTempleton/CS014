import ROT from 'rot-js';
import {TILES} from './tile.js'
import {init2DArray} from './util.js';

export class Point{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

export class Map{

  constructor(w, h, type = 'basic'){
    this.w = w;
    this.h = h;
    this.generate(w, h);
  }

  generate(w, h){

    var options = {
		roomWidth: [8, 15], /* room minimum and maximum width */
		roomHeight: [8, 15], /* room minimum and maximum height */
		corridorLength: [10, 20], /* corridor minimum and maximum length */
		dugPercentage: 0.4, /* we stop after this percentage of level area has been dug out */
		timeLimit: 10000 /* we stop after this much time has passed (msec) */
    };

    this.map = init2DArray(w, h);
    let mapo = new ROT.Map.Digger(w, h, options);
    var f = function(x, y, t){
      this.map[x][y] = t ? TILES.WALLS : TILES.EMPTY;
    };
    mapo.create(f.bind(this));
    let p = this.getRandomPointInRoom(mapo);
    this.map[p.x][p.y] = TILES.STAIRS;
    this.startLoc = this.getRandomPointInRoom(mapo);
  }

  inBounds(p){
    return p.x >= 0 && p.x < this.w && p.y >= 0 && p.y < this.h;
  }

  getTile(p){
    if(!this.inBounds(p)){
      return TILES.NULL;
    }
    return this.map[p.x][p.y];
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

  getRandomPointInRoom(map){
    var rooms = map.getRooms();
    var room = rooms[ROT.RNG.getUniformInt(0, rooms.length - 1)];
    var xLoc = ROT.RNG.getUniformInt(room.getLeft(),room.getRight());
    var yLoc = ROT.RNG.getUniformInt(room.getBottom(),room.getTop());
    return {x: xLoc, y:yLoc}
  }
}
