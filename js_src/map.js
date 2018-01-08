import ROT from 'rot-js';


export class Point{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

export class Map{

  constructor(){
    this.playerLocation = {};
    this.generate();
  }

  generate(){
    this.map = new ROT.map.digger(40, 20);
    this.map.create();
    this.playerLocation = getRandomPointInRoom();
  }

  getRandomPointInRoom(){
    var rooms = this.map.getRooms();
    var room = rooms[ROT.RNG.getUniformInt(0, rooms.length)];
    var x = ROT.RNG.getUniformInt(room.getLeft(),room.getRight());
    var y = ROT.RNG.getUniformInt(room.getBottom(),room.getTop());
    return new Point(x, y);
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
