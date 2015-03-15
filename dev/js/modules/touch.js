/*
Поддержка тач событий
*/
Brahma.app('screens').module('touch', function() {

	this.listner = Brahma(this.master.selector[0]).app('touch', {
		simpleMoves: true,
		minMoveX: 30,
		minMoveY: 30,
		preventDefaultEvents: false
	});

	var that = this;
	this.listner.bind('swipeLeft', function() {	that.master.right(); });
	this.listner.bind('swipeRight', function() { that.master.left(); });
	this.listner.bind('swipeUp', function() { that.master.down();	});
	this.listner.bind('swipeDown', function() {	that.master.up();	});
}, {
	listner: null
});
