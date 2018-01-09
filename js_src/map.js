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

  drawOn(display, offsetX=0, offsetY=0){
    for(let iw = 0; iw < this.w; iw++){
      for(let ih = 0; ih < this.h; ih++){
        this.map[iw][ih].drawOn(display, iw + offsetX, ih + offsetY);
      }
    }
  }

  getRandomPointInRoom(map){
    var rooms = map.getRooms();
    var room = rooms[ROT.RNG.getUniformInt(0, rooms.length - 1)];
    var xLoc = ROT.RNG.getUniformInt(room.getLeft(),room.getRight());
    var yLoc = ROT.RNG.getUniformInt(room.getBottom(),room.getTop());
    return {x: xLoc, y:yLoc}
  }

  render(){
    for (var key in this.map) {
      var parts = key.split(",");
      var x = parseInt(parts[0]);
      var y = parseInt(parts[1]);
      this.display.draw(x, y, this.map[key]);
    }
    this.display.draw(playerLocation.x, playerLocation.y, "", "", 'yellow');
  }
}
