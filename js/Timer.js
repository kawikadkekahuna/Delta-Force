var EventEmitter = require('events');
var util = require('util');
// var timers = require('timers');

function Timer(duration, deviation, TICK_SPEED) {
  EventEmitter.call(this);
  var self = this;
  this.startTime;
  this.endTime;
  var TICK_SPEED = TICK_SPEED || 1000;
  var TICK_COUNTER = 0;

  deviation = deviation || 50;

  this.start = function() {
    self.emit('start', {
      startTime: Date.now()
    });
    loop();
  }

  this.stop = function() {
    self.emit('stop', {
      stopTime: Date.now()
    });
  }

  function loop() {
    var LAG_SPEED = TICK_SPEED;
    if (TICK_COUNTER !== duration) {
      var timeElapsed = Date.now() - this.startTime;
      if (timeElapsed % TICK_SPEED !== 0) {
        self.emit('lag', {
          trueTime: LAG_SPEED * TICK_COUNTER,
          realTime: Math.abs(self.startTime - Date.now() + 1)
        });
      }

      LAG_SPEED -= Math.abs(self.startTime - Date.now()) - (TICK_SPEED * TICK_COUNTER)
      setTimeout(function() {
        self.emit('tick', {
          interval: TICK_COUNTER++
        });
        loop();
      }, LAG_SPEED);

    } else {
      self.stop();
    }
  }
  //DISPLAY FUNCTIONS
  function setStartTime(event) {
    self.startTime = Math.abs(event.startTime);
    process.stdout.write('start time: ' + self.startTime + '\n');
    process.stdout.write('-------------------------------' + '\n');
  }

  function setStopTime(event) {
    self.endTime = event.stopTime;
    var elapsed = Math.abs(self.startTime - self.endTime);
    process.stdout.write('\n' + '-------------------------------' + '\n');
    process.stdout.write('stop time: ' + this.startTime + '\n');
    process.stdout.write('time passed: ' + elapsed + ' ms' + '\n');
    process.stdout.write('COMPLETE \n');
    self.removeListener('start', setStartTime);
    self.removeListener('lag', displayLag);
    self.removeListener('tick', ticker);
    self.removeListener('stop', setStartTime);

  }

  function displayLag(event) {
    var lag = Math.abs(event.realTime - event.trueTime);
    if (lag > deviation) {
      process.stdout.write('lag ' + lag + '\n');
    }
  }

  function ticker(event) {
    console.log('tick ' + event.interval);
  }

  this.addListener('stop', setStopTime);
  this.addListener('start', setStartTime);
  this.addListener('tick', ticker);
  this.addListener('lag', displayLag);

}

util.inherits(Timer, EventEmitter);

var timer = new Timer(30, 1,100);
timer.start();