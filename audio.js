var SAMPLES  = 10000

var amplitudes = new Uint8Array(SAMPLES);
var audio      = new AudioContext();
var analysis   = audio.createAnalyser();
var renderer   = new AudioRenderer();

var time = 0;

function updateAndRender() {
	analysis.getByteFrequencyData(amplitudes);

	time += 0.005;

	renderer.render(amplitudes, time);

	requestAnimationFrame(updateAndRender);
}


var soundSource = navigator.getUserMedia({ audio: true }, function (mediaStream) {
	var mediaStreamSource = audio.createMediaStreamSource(mediaStream);
	var compressor = audio.createDynamicsCompressor()
	var gainNode = audio.createGain()

	compressor.threshold.value = -32;
	compressor.knee.value = 0;
	compressor.ratio.value = 20;
	compressor.attack.value = 0;
	compressor.release.value = 0;
	gainNode.gain.value = 0.5;

	mediaStreamSource.connect(compressor);

	compressor.connect(gainNode);
	gainNode.connect(analysis);

	updateAndRender();
}, function (err) {
	alert("Ah snap, something went wrong accessing your microphone.")
	console.log(err);
});
