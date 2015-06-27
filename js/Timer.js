var EventEmitter = require('events');
var util = require('util');
// var timers = require('timers');

function Timer(duration, deviation) {

  EventEmitter.call(this);
  var self = this;
  this.startTime;
  this.endTime;
  var speed = 1000;
  var i = 1;
  var heartbeat = false;
  if (!deviation) {
    deviation = 50;
  }


  this.getHeartbeat = function() {
    return heartbeat !== false;
  }


  this.start = function() {
    if (!this.getHeartbeat()) {
      heartbeat = true;
      this.intervalID = setInterval(this.startInterval, speed);
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
      this.removeListener('pass', tickCounter);
      this.removeListener('start', setStartTime);
      this.removeListener('lag', displayLag);
      self.emit('stop', {
        stopMS: Date.now()
      });
    }
  }


  function tickCounter(event) {
    var timeElapsed = Date.now() - this.startTime;
    process.stdout.write('tick ' + event.interval + '\n');
    if (timeElapsed % speed !== 0) {
      self.emit('lag', {
        trueTime: speed * event.interval,
        realTime: Math.abs(this.startTime - Date.now())
      });
    }

    if (event.interval === duration) {
      this.stop();

    }
  }

  function setStartTime(event) {
    this.startTime = Math.abs(event.startMS);
    process.stdout.write('start time: ' + this.startTime + '\n');
    process.stdout.write('interval on: ' + this.getHeartbeat() + '\n');
    process.stdout.write('-------------------------------' + '\n');
  }

  function setStopTime(event) {
    this.endTime = event.stopMS;
    var elapsed = Math.abs(this.startTime - this.endTime);
    process.stdout.write('\n' + '-------------------------------' + '\n');
    process.stdout.write('stop time: ' + this.startTime + '\n');
    process.stdout.write('interval on: ' + this.getHeartbeat() + '\n');
    process.stdout.write('time passed: ' + elapsed + ' ms' + '\n');
    this.removeListener('stop',setStartTime);
  }

  function displayLag(event) {
    var lag = Math.abs(event.realTime - event.trueTime);
    if (lag > deviation) {
      process.stdout.write('truetime ' + event.trueTime + ' ');
      process.stdout.write('realtime ' + event.realTime + ' ');
      process.stdout.write('lag ' + lag + '\n');
    }
  }

  this.addListener('start', setStartTime);

  this.addListener('stop', setStopTime);

  this.addListener('pass', tickCounter);

  this.addListener('lag', displayLag);



}

util.inherits(Timer, EventEmitter);

var testTime = new Timer(20, 3);
testTime.start();