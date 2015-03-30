/*
Edge effect
*/
Brahma.app('screens').module('edgeEffect', {
	mod: function(coord, direct) {
		// Collid event
		this.master.trigger('collid',[this.master.current(), coord, direct]);
		this.master.current().trigger('collid', [coord, direct]);
		
		if (!this.master.config.deadlockEffect || this.master.data.moving) return false;
		this.master.data.advshift[coord] = 25*direct;

		this.master.translate(this.master.data.currentScreen[0]*-100, this.master.data.currentScreen[1]*-100);

		var that = this;
		setTimeout(function() {
			that.master.data.advshift[coord] = 0;
			that.master.translate(that.master.data.currentScreen[0]*-100, that.master.data.currentScreen[1]*-100);
		}, 100);
		return false;
	},
	up: function() {
		return this.mod('y',1);
	},
	down: function() {
		return this.mod('y',-1);
	},
	left: function() {
		return this.mod('x',1);
	},
	right: function() {
		return this.mod('x',-1);
	}
});