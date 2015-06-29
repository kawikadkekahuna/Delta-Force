var EventEmitter = require('events');
var util = require('util');
// var timers = require('timers');

function Timer(duration, deviation) {
  EventEmitter.call(this);
  var self = this;
  this.startTime;
  this.endTime;
  var TICK_SPEED = 1000;
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
    if (TICK_COUNTER !== duration) {
      setTimeout(function() {
        self.emit('tick', {
          interval: TICK_COUNTER++
        });
        loop();
      }, TICK_SPEED);
    } else {
      self.stop();
    }
  }

  function setStartTime(event) {
    this.startTime = Math.abs(event.startTime);
    process.stdout.write('start time: ' + this.startTime + '\n');
    process.stdout.write('-------------------------------' + '\n');
  }


  function setStopTime(event) {
    this.endTime = event.stopTime;
    var elapsed = Math.abs(this.startTime - this.endTime);
    process.stdout.write('\n' + '-------------------------------' + '\n');
    process.stdout.write('stop time: ' + this.startTime + '\n');
    process.stdout.write('time passed: ' + elapsed + ' ms' + '\n');
    process.stdout.write('COMPLETE \n');
    this.removeListener('stop', setStartTime);
  }

  function ticker(event) {
    console.log('tick ' + event.interval);
  }

  this.addListener('stop', setStopTime);
  this.addListener('start', setStartTime);
  this.addListener('tick', ticker);

}

util.inherits(Timer, EventEmitter);

var timer = new Timer(10);
timer.start();