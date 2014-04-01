/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 * For licensing see http://lab.aerotwist.com/canvas/music-dna/LICENSE
 */

function AudioRenderer() {
  "use strict";

  var LOG_MAX = Math.log(128);
  var TAU = Math.PI * 2;
  var MAX_DOT_SIZE = 0.5;
  var BASE = Math.log(4) / LOG_MAX;

  var canvas = document.getElementById('render-area');
  var ctx = canvas.getContext('2d');

  var width = 0;
  var height = 0;
  var outerRadius = 0;

  function onResize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    outerRadius = Math.min(width, height) * 0.47;

    ctx.globalCompositeOperation = "lighter";
  }

  function clamp(val, min, max) {
    return Math.min(max, Math.max(val, min));
  }

  this.clear = function() {
    ctx.clearRect(0, 0, width, height);
  };

  this.render = function(audioData, normalizedPosition) {
    var angle = Math.PI - normalizedPosition * TAU;
    var color = 0;
    var lnDataDistance = 0;
    var distance = 0;
    var size = 0;
    var volume = 0;
    var power = 0;

	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.globalCompositeOperation = "lighter";

    var x = Math.sin(angle);
    var y = Math.cos(angle);
    var midX = width * 0.5;
    var midY = height * 0.5;

    // There is so much number hackery in here.
    // Number fishing is HOW YOU WIN AT LIFE.
    for (var a = 1; a < audioData.length; a++) {

      volume = audioData[a] / 255;

      if (volume < 0.85) continue;

      color = normalizedPosition - 0.12 + Math.random() * 0.24;
      color = Math.round(color * 360);

      lnDataDistance = (Math.log(a - 4) / LOG_MAX) - BASE;

      distance = lnDataDistance * outerRadius;
      size = volume * MAX_DOT_SIZE + Math.random() * 2;

      if (Math.random() > 0.75) {
        size *= (audioData[a] * 0.2) * Math.random();
        volume *= Math.random() * 0.05;
      }

      ctx.globalAlpha = volume * 0.6;
      ctx.fillStyle = 'hsl(' + color + ', 80%, 30%)';
      ctx.beginPath();
      ctx.arc(
        midX + x * distance,
        midY + y * distance,
        size, 0, TAU, false);
      ctx.closePath();
      ctx.fill();
    }


  };

  window.addEventListener('resize', onResize, false);
  window.addEventListener('load', function() {
    onResize();
  }, false);
}
