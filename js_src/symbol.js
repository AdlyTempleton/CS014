export class Symbol {
  constructor(chr=' ',fgHexColor='#fff',bgHexColor='#000') {
    this.char = chr;
    this.fgColor = fgHexColor;
    this.bgColor = bgHexColor;
  }

  getRepresentation: function() {
    return '%c{' + this.fgColor + '}%b{' + this.bgColor + '}' + this.char;
  }

  drawOn: function(display, x, y) {
    display.draw(x, y, this.char, this.fgColor, this.bgColor);
  }
}
