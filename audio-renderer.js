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
