Brahma.app('screens').module('mobileMap', function() {
	var that = this;

	Brahma(this.master.htmlelements.map).addClass('screens-map-mobile');

	this.master.bind('movingStart', function() {
		
		that.zoomMap();
	});

	this.master.bind('movingEnd', function() {
		
		that.tryUnZoomMap();
	});
}, {
	zoomMap: function() {
		Brahma(this.master.htmlelements.map).addClass('screens-visible');
	},
	tryUnZoomMap: function() {
		var that = this;
		setTimeout(function() {
			if (!that.master.data.moving) that.unZoomMap();
		}, 150);
	},
	unZoomMap: function() {
		Brahma(this.master.htmlelements.map).removeClass('screens-visible');
	}
});