export class Symbol {
  constructor(chr = " ", fgHexColor = "#fff", bgHexColor = "#000") {
    this.char = chr;
    this.fgColor = fgHexColor;
    this.bgColor = bgHexColor;
  }

  getRepresentation() {
    return "%c{" + this.fgColor + "}%b{" + this.bgColor + "}" + this.char;
  }

  drawOn(display, x, y) {
    if (this.bgColor != "#000") {
      console.log(this.char);
      console.log(this.fgColor);
      console.log(this.bgColor);
    }
    display.draw(x, y, this.char, this.fgColor, this.bgColor);
  }
}
