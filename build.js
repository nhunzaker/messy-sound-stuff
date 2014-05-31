(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LOG_MAX = Math.log(128);
var TAU = Math.PI * 2;
var MAX_DOT_SIZE = 5;
var BASE = Math.log(4) / LOG_MAX;

module.exports = function() {
	var TAU = Math.PI * 2;
	var canvas = document.getElementById('render-area');
	var ctx = canvas.getContext('2d');

	var width = 0;
	var height = 0;
	var self = this;

	function onResize() {
		width = canvas.offsetWidth;
		height = canvas.offsetHeight;

		canvas.width = width;
		canvas.height = height;

		self.clear();
	}

	this.clear = function () {
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = "#151111";

		ctx.fillRect(0, 0, width, height);
	};

	this.render = function (pitch, power, domain) {
		ctx.save();
		ctx.drawImage(canvas, -2, 0);
		ctx.translate(width / 2, 0);

		ctx.globalCompositeOperation = "lighter";

		for (var i = 0; i < domain; i++) {
			var value   = pitch[i];
			var volume  = power[i];
			var percent = value / 256;
			var color   = percent * 360;
			var size    = (height * 2) * percent;
			var offset  = size / 2;

			ctx.globalAlpha = volume / 256;
			ctx.fillStyle = 'hsl(' + color + ', 90%, 60%)';
			ctx.beginPath();
			ctx.arc(i * 2, offset, 1 * (volume / 256), 0, TAU);
			ctx.fill();
			ctx.closePath();
		}

		ctx.restore();
	};

	window.addEventListener('resize', onResize, false);
	window.addEventListener('load', function() {
		onResize();
	}, false);
}

},{}],2:[function(require,module,exports){
require('./patch');

var AudioRenderer = require('./audio-renderer');
var SAMPLES  = 1024;
var time     = 0;
var pitch    = new Uint8Array(SAMPLES);
var power    = new Uint8Array(SAMPLES);
var audio    = new AudioContext();
var renderer = new AudioRenderer();
var analyser = null;

function updateAndRender() {
	analyser.getByteTimeDomainData(pitch);
	analyser.getByteFrequencyData(power);

	renderer.render(pitch, power, analyser.frequencyBinCount);

	requestAnimationFrame(updateAndRender);
}

var soundSource = navigator.getUserMedia({ audio: true }, function (stream) {
	var mediaStreamSource = audio.createMediaStreamSource(stream);

	analyser = audio.createAnalyser();
    analyser.fftSize = SAMPLES;
	analyser.smoothingTimeConstant = 0.4;

	mediaStreamSource.connect(analyser);

	updateAndRender();
}, function(err) {
	alert("Ah snap, something went wrong accessing your microphone.")
	console.log(err);
});

},{"./audio-renderer":1,"./patch":3}],3:[function(require,module,exports){
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

},{}]},{},[2])