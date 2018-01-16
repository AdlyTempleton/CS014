import { Symbol } from "./symbol.js";
import * as d from "./data.js";
import { randomString } from "./util.js";
import { Mixable } from "./mixable.js";

export class Entity extends Mixable {
  constructor(template) {
    super(template);
    this.template = template;
    this.symbol = template.symbol || new Symbol(" ");

    this.state.pos = { x: 0, y: 0 };
    this.state.id = this.uid();
    this.state.map = "";
    this.state.destroyed = false;
  }

  uid() {
    return "entity: " + randomString() + d.DATA.nextEntityId++;
  }

  destroy() {
    this.getMap().removeEntity(this);
    delete d.DATA.entities[this.getId()];
    this.state.destroyed = true;
  }

  getSymbol() {
    return this.symbol;
  }
  setSymbol(s) {
    this.symbol = s;
  }
  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }
  getPos() {
    return this.state.pos;
  }
  setPos(p) {
    this.state.pos = p;
  }
  getId() {
    return this.state.id;
  }
  setId(id) {
    this.state.id = id;
  }
  getMapId() {
    return this.state.map;
  }
  setMapId(m) {
    this.state.map = m;
  }
  getMap() {
    return d.DATA.maps[this.getMapId()];
  }

  render(display, x, y) {
    this.symbol.drawOn(display, x, y);
  }

  moveTo(newPos) {
    this.getMap().moveEntityTo(this.getId(), this.getPos(), newPos);
    this.setPos(newPos);
  }

  move(dx, dy) {
    this.moveTo({ x: this.getPos().x + dx, y: this.getPos().y + dy });
  }
}
