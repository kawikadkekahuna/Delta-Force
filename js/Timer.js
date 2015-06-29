var EventEmitter = require('events');
var util = require('util');
// var timers = require('timers');

function Timer(duration, deviation) {
  EventEmitter.call(this);
  var self = this;
  this.startTime;
  this.endTime;
  var TICK_SPEED = 200;
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
    })
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

      LAG_SPEED -=  Math.abs(self.startTime - Date.now()) - (TICK_SPEED * TICK_COUNTER)
       console.log('LAG_SPEED',LAG_SPEED); 
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

  function setStartTime(event) {
    self.startTime = Math.abs(event.startTime);
    process.stdout.write('start time: ' + this.startTime + '\n');
    process.stdout.write('-------------------------------' + '\n');
  }


  function setStopTime(event) {
    self.endTime = event.stopTime;
    var elapsed = Math.abs(this.startTime - this.endTime);
    process.stdout.write('\n' + '-------------------------------' + '\n');
    process.stdout.write('stop time: ' + this.startTime + '\n');
    process.stdout.write('time passed: ' + elapsed + ' ms' + '\n');
    process.stdout.write('COMPLETE \n');
    this.removeListener('stop', setStartTime);
  }

  function displayLag(event) {
    var lag = Math.abs(event.realTime - event.trueTime);
    if (lag > deviation) {
      process.stdout.write('truetime ' + event.trueTime + ' ');
      process.stdout.write('realtime ' + event.realTime + ' ');
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

var timer = new Timer(10, 1);
timer.start();