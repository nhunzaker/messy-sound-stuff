var audio   = new AudioContext();
var analysis = audio.createAnalyser();
var amplitudes = new Uint8Array(4000);
var renderer = new AudioRenderer();

function produceData() {
    return analysis.getByteTimeDomainData(amplitudes);
}

var time = 0;

function updateAndRender() {
	analysis.getByteFrequencyData(amplitudes);

	time += 0.002;

	renderer.render(amplitudes, time);

	requestAnimationFrame(updateAndRender);
}


var soundSource = navigator.getUserMedia({ audio: true }, function (mediaStream) {
	var mediaStreamSource = audio.createMediaStreamSource(mediaStream);
	var compressor = audio.createDynamicsCompressor()
	var gainNode = audio.createGain()

	compressor.threshold.value = -32
	compressor.knee.value = 0
	compressor.ratio.value = 20
	compressor.attack.value = 0
	compressor.release.value = 0
	gainNode.gain.value = 2

	mediaStreamSource.connect(compressor)

	compressor.connect(gainNode)

	gainNode.connect(analysis)

	updateAndRender();
}, function (err) {
	console.log(err);
});
