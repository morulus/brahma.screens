/*
Listen keys 
*/
Brahma.app('screens').module('keylistner', {
	run: function() {

		var that = this;

		Brahma(document).bind('keydown', function(e) {
			that.master.trigger('keydown', [e]);
			switch(e.which) {
				case 38: that.master.up(); break;
				case 40: that.master.down(); break;
				case 37: that.master.left(); break;
				case 39: that.master.right(); break;
			}
		});
	}
});
