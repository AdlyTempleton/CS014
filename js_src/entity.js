import {Symbol} from './symbol.js'
import * as d from './data.js'
import {randomString} from './util.js'

export class Entity {
  constructor(template){
    this.symbol = template.symbol || new Symbol(' ');
    this.name = template.name || ' ';
    this.state = {};
    this.state.pos = {x:0, y:0};
    this.id = this.uid();
  }

  uid(){
    return 'entity: ' + randomString() + d.DATA.nextEntityId++;
  }

  getSymbol(){return this.symbol;}
  setSymbol(s){this.symbol = s;  }
  getName(){return this.name;  }
  setName(name){this.name = name;  }
  getPos(){return this.state.pos;}
  setPos(p){this.state.pos = p;}
  getId(){return this.id;}
  setId(id){this.id = id;}

}
