/**
 * Module dependencies.
 */

var mocha = require('mocha');
var emoji = require('node-emoji')
var player = require('play-sound')(opts = {});
var path = require('path');
var fs = require('fs') 

/**
 * Randomize the choice of ascii art & preload
 */
var rando = Math.floor(Math.random() * 2).toString();
var asciiSeptaImg = path.join(__dirname, '..', 'mocha-septa-reporter/septa'+rando+'.txt')
var asciiSepta = ''

fs.readFile(asciiSeptaImg, function (err, asciiData) {
  if (err) throw err;
  asciiSepta = asciiData.toString();
});

/**
 * No idea what happens if you don't have a player
 */
var shameSound = path.join(__dirname, "..", "mocha-septa-reporter/shame.mp3")

/**
 * other var
 */
var Base = mocha.reporters.Base
var inherits = mocha.utils.inherits;
var color = Base.color;

/**
 * Expose `mocha-septa-reporter`.
 */

module.exports = mochaSeptaReporter;

/**
 * Initialize a new `mochaSeptaReporter` test reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function mochaSeptaReporter (runner) {
  Base.call(this, runner);

  var self = this;
  var indents = 0;
  var n = 0;
  var failures = 0;

  function indent () {
    return Array(indents).join('  ');
  }

  runner.on('start', function () {
    console.log();
  });

  runner.on('suite', function (suite) {
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function () {
    --indents;
    if (indents === 1) {
      console.log();
    }
  });

  runner.on('pending', function (test) {
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function (test) {
    var fmt;
    if (test.speed === 'fast') {
      fmt = indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s');
      console.log(fmt, test.title);
    } else {
      fmt = indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s') +
        color(test.speed, ' (%dms)');
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function (test) {
    failures++ ;
    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.on('end', function() {
    if (failures > 0){
      /* Septa's here ! */
      console.log(asciiSepta);
  
      /* Shame ! Shame ! Shame ! */
      player.play(shameSound, { timeout: 300 }, function(err){
        if (err) throw err
      });
  
      /* Emojis, just because */
      // Alternative with the footprints, not sure if better
      //var shame = (emoji.get('footprints')+' '+color('fail',' SHAME! ')).repeat(3);
      var shame = (color('fail',' SHAME! ')).repeat(3);
      var walkOfShame = ('\n'+ shame + emoji.get('bell'));
      console.log(walkOfShame.repeat(3)+ '\n\n');
    }
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(mochaSeptaReporter, Base);
