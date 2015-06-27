var EventEmitter = require('events');
var util = require('util');

function Timer () {
  EventEmitter.call(this);
  var self = this;
  this.i = 0;
  setInterval(function () {
    self.emit('tick', { interval : self.i++ });
  }, 1000);
}

util.inherits(Timer, EventEmitter);


function tickHandler(event){
  process.stdout.write('tick ' + this.i + '\n');
}


var myTimer = new Timer();
myTimer.addListener('tick', tickHandler);