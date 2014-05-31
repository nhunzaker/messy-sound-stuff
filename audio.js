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
