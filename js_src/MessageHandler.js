export let MessageHandler = {
  _lastMessage: "",
  _display: "",
  init: function(display){
    this._display = display
  },

  render: function(){
    this._display.main.o.drawText(1, 1, this._lastMessage, '#fff', '#000');
  }

}
