function Handwriting(id) {
	var _this = this;
	this.canvas = document.getElementById(id);
	this.ctx = this.canvas.getContext("2d");
	this.ctx.fillStyle = "rgba(0,0,0,0.25)";
	this.canvas.onmousedown = function(e) {
		_this.downEvent(e)
	};
	this.canvas.onmousemove = function(e) {
		_this.moveEvent(e)
	};
	this.canvas.onmouseup = function(e) {
		_this.upEvent(e)
	};
	this.canvas.onmouseout = function(e) {
		_this.upEvent(e)
	};
	this.moveFlag = false;
	this.upof = {};
	this.radius = 0;
	this.has = [];
	this.lineMax = 30;
	this.lineMin = 3;
	this.linePressure = 1;
	this.smoothness = 80;
}

Handwriting.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Handwriting.prototype.downEvent = function(e) {
	this.moveFlag = true;
	this.has = [];
	this.upof = this.getXY(e);
}
Handwriting.prototype.upEvent = function(e) {
	this.moveFlag = false;
}
Handwriting.prototype.moveEvent = function(e) {
	if (!this.moveFlag)
		return;
	var of = this.getXY(e);
	var up = this.upof;
	var ur = this.radius;
	this.has.unshift({
				time : new Date().getTime(),
				dis : this.distance(up, of)
			});
	var dis = 0;
	var time = 0;
	for (var n = 0; n < this.has.length - 1; n++) {
		dis += this.has[n].dis;
		time += this.has[n].time - this.has[n + 1].time;
		if (dis > this.smoothness)
			break;
	}
	var or = Math.min(time / dis * this.linePressure + this.lineMin,
			this.lineMax)
			/ 2;
	this.radius = or;
	this.upof = of;
	if (this.has.length <= 4)
		return;
	var len = Math.round(this.has[0].dis / 2) + 1;
	for (var i = 0; i < len; i++) {
		var x = up.x + (of.x - up.x) / len * i;
		var y = up.y + (of.y - up.y) / len * i;
		var r = ur + (or - ur) / len * i;
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI, true);
		this.ctx.fill();
	}
}

Handwriting.prototype.getXY = function(e) {
	return {
		x : e.clientX
				- this.canvas.offsetLeft
				+ (document.body.scrollLeft || document.documentElement.scrollLeft),
		y : e.clientY
				- this.canvas.offsetTop
				+ (document.body.scrollTop || document.documentElement.scrollTop)
	}
}
Handwriting.prototype.distance = function(a, b) {
	var x = b.x - a.x, y = b.y - a.y;
	return Math.sqrt(x * x + y * y);
}

