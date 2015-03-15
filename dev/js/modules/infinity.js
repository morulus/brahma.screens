/*
INFINIY MODE  
*/
Brahma.app('screens').module('infinity', {
	run: function() {
		var that = this;
		this.master.htmlelements.phantom = false;
		if (this.master.config.lockDelay===false) this.master.config.lockDelay = true; // Мы принудительно запрещаем ускоренный переход между слайдами
	},
	/*
	Достраивает 
	*/
	portalMove: function(direction) {
		var fakex, fakey, nextx, nexty;
		// Создаем фантомный элемент и правильно позиционируем его
		switch(direction) {
			case 'up':
				switch(this.master.config.infinityMethod) {
					case 'discover':
						fakey = this.master.getLastYSlideByX(this.master.data.currentScreen[0])+1,
						fakex = this.master.data.currentScreen[0];
						nexty = fakey-1;
						nextx = fakex;
					break;
					case 'passage':
						fakey = this.master.grid.length;
						fakex = this.master.data.currentScreen[0];
						nexty = fakey-1;
						nextx = fakex;
					break;
				}
			break;
			case 'down':
				switch(this.master.config.infinityMethod) {
					case 'discover':
						fakey = this.master.getFirstYSlideByX(this.master.data.currentScreen[0])-1,
						fakex = this.master.data.currentScreen[0];
						nexty = fakey+1;
						nextx = fakex;
					break;
					case 'passage':
						fakey = -1;
						fakex = this.master.data.currentScreen[0];
						nexty = 0;
						nextx = fakex;
					break;
				}
			break;
			case 'left':
				switch(this.master.config.infinityMethod) {
					case 'discover':
						var nexty = this.master.data.currentScreen[1];
						var nextx=false;
						var protect = 66;
						do {
							if (nexty<this.master.data.minY) nexty = this.master.data.maxY;
							else nexty--;
							nextx = this.master.getLastXSlideByY(nexty);
							protect--;
							if (protect<0) {
								alert('fuuuuck');
								return;
							}
						}
						while (nextx===false);
						
						fakey = nexty;
						fakex = nextx+1;
						nexty = nexty;
						nextx = fakex-1;

					break;
					case 'passage':
						fakey = this.master.data.currentScreen[1];
						fakex = this.master.grid[this.master.data.currentScreen[0]].length;
						nexty = 0;
						nextx = fakex-1;
					break;
				}
			break;
			case 'right':
				switch(this.master.config.infinityMethod) {
					case 'discover':
						var nexty = this.master.data.currentScreen[1];
						var nextx=false;
						var protect = 66;
						do {
							if (nexty>this.master.data.maxY) nexty = this.master.data.minY;
							else nexty++;
							nextx = this.master.getFirstXSlideByY(nexty);
							protect--;
							if (protect<0) {
								alert('fuuuuck');
								return;
							}
						}
						while (nextx===false);
						fakey = nexty;
						fakex = nextx-1;
						nexty = nexty;
						nextx = fakex+1;

					break;
					case 'passage':
						fakey = this.master.data.currentScreen[1];
						fakex = 0;
						nexty = 0;
						nextx = fakex+1;
					break;
				}
			break;
		}
		if (!(this.master.portalGrid[fakex] && this.master.portalGrid[fakex][fakey])) {
			this.createFakeSlide(fakex,fakey);
			
			
		} else {
			// Если такой фрейм есть, то создаем фрейм стоящий за ним
			if (this.master.portalGrid[fakex][fakey].processed) {

			}
		}
		/*
		Нам необходимо сместить видимую область на величину равную текущее 
		знаение до подставного значения  
		*/
		var that = this;
		this.master.data.shift.x += fakex-this.master.data.currentScreen[0];
		this.master.data.shift.y += fakey-this.master.data.currentScreen[1];
		/*
		Перемещаем весь стол в нужную позицию. Мы перемещаем стол с помощью 
		margin, это отключает конфликт  
		*/
		this.master.shiftScreen(this.master.data.shift.x,this.master.data.shift.y,function() {
			that.master.goto([nextx,nexty], false, function() {
				that.master.portalGrid[fakex][fakey].processed = false;
			});
		});

	},
	createFakeSlide : function(fakex, fakey) {
		if ("object"!==typeof this.master.portalGrid[fakex]) this.master.portalGrid[fakex] = {};
		this.master.portalGrid[fakex][fakey] = {
			node: Brahma(this.master.htmlelements.screensWrapper)
				.put(Brahma(this.master.grid[this.master.data.currentScreen[1]][this.master.data.currentScreen[0]].node).clone())
				.css({
					left: ((fakex)*100)+'%',
					top: ((fakey)*100)+'%'
				})
				.addClass("fake"),
			processed: true
		};
	}
});
