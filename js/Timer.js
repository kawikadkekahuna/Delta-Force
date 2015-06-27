var EventEmitter = require('events');
var util = require('util');
// var timers = require('timers');

function Timer() {
  EventEmitter.call(this);
  var self = this;
  this.startTime;
  this.endTime;
  var i = 0;


  this.start = function() {

    self.emit('start', {
      startMS: Date.now()
    })

    setInterval(function() {
      self.emit('pass', {
        interval: i++
      })
    }, 1000);

  }

  this.stop = function() {
    self.emit('stop', {
      stopMS: Date.now()
    });

  }
}

util.inherits(Timer, EventEmitter);



var testTime = new Timer();

function tickCounter(event) {
  process.stdout.write('index ' + event.interval + '\n');
  if (event.interval === 12) {
    testTime.removeListener('pass', tickCounter);
    testTime.stop();
  }
}

function setStartTime(event) {
  this.startTime = event.startMS;
  // process.stdout.write('startTime' + this.startTime + '\n');
}

function setStopTime(event) {
  this.endTime = event.stopMS;
  var elapsed = this.startTime - this.endTime;
  // process.stdout.write('stopTime' + this.endTime + '\n');
  process.stdout.write('time passed: ' + elapsed + ' ms');
}

testTime.addListener('start', setStartTime);

testTime.addListener('stop', setStopTime);

testTime.addListener('pass', tickCounter);

testTime.start();