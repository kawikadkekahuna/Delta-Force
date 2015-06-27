var EventEmitter = require('events');
var util = require('util');
// var timers = require('timers');

function Timer() {
  EventEmitter.call(this);
  var self = this;
  this.startTime;
  this.endTime;
  var i = 0;
  var heartbeat = false;

  this.getHeartbeat = function() {
    return heartbeat !== false;
  }


  this.start = function() {
    if (!this.getHeartbeat()) {
      heartbeat = true;
      this.intervalID = setInterval(this.startInterval, 205);
      self.emit('start', {
        startMS: Date.now()
      });
    }
  }

  this.startInterval = function() {
    self.emit('pass', {
      interval: i++
    });
  }

  this.stop = function() {
    if (this.getHeartbeat()) {
      clearInterval(this.intervalID);
      heartbeat = false;
      testTime.removeListener('pass', tickCounter);
      self.emit('stop', {
        stopMS: Date.now()
      });
    }
  }



}

util.inherits(Timer, EventEmitter);

var testTime = new Timer();

function tickCounter(event) {
  process.stdout.write('index ' + event.interval + '\n');
  if (event.interval === 12) {
    testTime.stop();

  }
}

function setStartTime(event) {
  this.startTime = event.startMS;
  process.stdout.write('start time: ' + this.startTime + '\n');
  process.stdout.write('interval on: ' + this.getHeartbeat() + '\n');
}

function setStopTime(event) {
  this.endTime = event.stopMS;
  var elapsed = this.startTime - this.endTime;
  process.stdout.write('start time: ' + this.startTime + '\n');
  process.stdout.write('interval on: ' + this.getHeartbeat() + '\n');
  process.stdout.write('time passed: ' + elapsed + ' ms');
}

testTime.addListener('start', setStartTime);

testTime.addListener('stop', setStopTime);

testTime.addListener('pass', tickCounter);

testTime.start();