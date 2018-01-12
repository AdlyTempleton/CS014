import {Symbol} from './symbol.js'
import * as d from './data.js'
import {randomString} from './util.js'

export class Entity {
  constructor(template){
    this.template = template;
    this.symbol = template.symbol || new Symbol(' ');
    this.name = template.name || ' ';
    this.templateName = template.templateName ? template.templateName : this.name;
    this.state = {};
    this.state.pos = {x:0, y:0};
    this.state.id = this.uid();
    this.state.map = '';
  }

  uid(){
    return 'entity: ' + randomString() + d.DATA.nextEntityId++;
  }

  getSymbol(){return this.symbol;}
  setSymbol(s){this.symbol = s;  }
  getName(){return this.name;  }
  setName(name){this.name = name;  }
  getPos(){return this.state.pos;}
  setPos(p){
    this.state.pos = p;
  }
  getId(){return this.state.id;}
  setId(id){this.state.id = id;}
  getMapId(){return this.state.map;}
  setMapId(m){this.state.map = m;}
  getMap(){return d.DATA.maps[this.getMapId()]}

  render(display, x, y){
    this.symbol.drawOn(display, x, y);
  }

  moveTo(newPos){
    this.getMap().moveEntityTo(this.getId(), this.getPos(), newPos);
    this.setPos(newPos);
  }

  move(dx, dy){
    this.moveTo({x: this.getPos().x + dx, y: this.getPos().y + dy});
  }
}
