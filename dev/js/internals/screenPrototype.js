Brahma.app('screens').addFabric('screen', ['events'], function(app) {
	this.app = app;
}, {
	go : function() {
		this.app.goto([this.x, this.y]);
		return this;
	},
	html : function() {
		if (arguments.length>0) {
			if ("function"===typeof arguments[0]) {
				return arguments[0].call(this, this.app.grid[this.y][this.x].node);
			} else if ("string"===typeof arguments[0]) {
				Brahma(this.app.grid[this.y][this.x].node).html(arguments[0]);
				return this;
			} else {
				Brahma(this.app.grid[this.y][this.x].node).put(arguments[0]);
				return this;
			}
		}
		else {
			return this.app.grid[this.y][this.x].node;
		};
	},
	disable : function() {
		this.app.disable(this.x, this.y);
		return this;
	},
	enable : function() {
		this.app.enable(this.x, this.y);
		return this;
	},
	remove : function() {
		this.app.remove(this.x, this.y);
		return null;
	}
});