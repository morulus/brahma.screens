;(function($$) {
	$$.app('screens', {
		config: {
			infinity: false, // Бесконечное пролистывание
			lockDelay: false, // Задержка после перемещения перед тем как будет разрещено ещё одно действие
			easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			duration: 1000, // Длительность анимации
			/*
			options infinityMethod: 
			 
			@variants 
			[passage] Метод passage подразумевает, что по достижении края слайдов 
			возможен переход на слайд с противоположной стороны, но только если 
			это слайд соприкасается с последним слайдом, так, если бы их можно 
			было поставить рядом с друг другом. 
			 
			[discover] Метод discover предполагает, что по достижении края справа 
			мы можем переместиться на следующий этаж вниз, с края слева - вверх. 
			Края вверх вниз перемещают на ближайший доступный уровень сверху. 
			Т.е. этот метод предполагает, что мы никогда не упремся в конец. 
			 
			[false]аналогично отключению режима infiniry 
			*/
			infinityMethod: 'passage' // Определяет тип портального перехода (false, `passage`,`discover`)
			
		},
		data: {
			currentScreen: [0,0],
			shift: {
				x:0,y:0
			},
			moving: false,
			movingStartTime:0,
			movingEndTime:0,
			maxX: 0,
			maxY: 0,
			minX: 0,
			minY: 0
		},
		modules: {

		},
		effects: {

		},
		grid: [

		],
		portalGrid: [

		],
		htmlelements: {

		},
		run: function() {
			console.log('run');
			var that = this;
			// Convert inner content to grid
			Brahma(this.selector).find('>*').wrapAll('div', {

			});

			this.htmlelements.screensWrapper = Brahma(this.selector).find('>div');

			Brahma(this.selector).addClass('brahma-widgets-screens');
			// Build grid
			Brahma(this.htmlelements.screensWrapper).find('>*').each(function() {
				var xy = that.reserveCell(parseInt(Brahma(this).data("x")),parseInt(Brahma(this).data("y")), this); 

				Brahma(this).css({
					left: ((xy[0])*100)+'%',
					top: ((xy[1])*100)+'%'
				});

				if (Brahma(this).hasClass("current"))
				that.data.currentScreen = xy;
			});

			// Create navigation
			this.htmlelements.navigation = Brahma(this.selector)
			.tie(function() {
				Brahma(this)
				.put('div', {
					"class": "dharma-widgets-screens-navigation-up"
				}).tie(function() { that.htmlelements.navigation_up = this; Brahma(this).bind('click',function() { that.up() }); })
				.and('div', {
					"class": "dharma-widgets-screens-navigation-down"
				}).tie(function() { that.htmlelements.navigation_down = this; Brahma(this).bind('click',function() { that.down() }); })
				.and('div', {
					"class": "dharma-widgets-screens-navigation-left"
				}).tie(function() { that.htmlelements.navigation_left = this; Brahma(this).bind('click',function() { that.left() });})
				.and('div', {
					"class": "dharma-widgets-screens-navigation-right"
				}).tie(function() { that.htmlelements.navigation_right = this; Brahma(this).bind('click',function() { that.right() }) })
			});

			// Create map
			this.htmlelements.map = Brahma(this.selector)
			.put('div', {
				"class": "dharma-widgets-screens-map"
			});

			// Build map
			this.rebuildMap();

			// Set transition
			Brahma(this.htmlelements.screensWrapper).css({
				'-webkit-transition-duration': this.config.duration+'ms',
				'-ms-transition-duration': this.config.duration+'ms',
				'-o-transition-duration': this.config.duration+'ms',
				'-moz-transition-duration': this.config.duration+'ms',
				'transition-duration': this.config.duration+'ms'
			});

			Brahma(this.htmlelements.screensWrapper).css({
				'-webkit-transition-timing-function': this.config.ease,
				'-ms-transition-timing-function': this.config.ease,
				'-o-transition-timing-function': this.config.ease,
				'-moz-transition-timing-function': this.config.ease,
				'transition-timing-function': this.config.ease
			});

			// Run keylistner
			this.module('keylistner').run();

			if (this.config.infinity)
			this.module('infinity').run();

			// Select curren
			this.goto(this.data.currentScreen);
		},
		up: function() {
			if (!this.canIMove()) return false;
			
			switch (this.canIMoveUp()) {
				case false: return false; break;
				case 2: this.trigger('beforeMove',['up']); this.modules.infinity.portalMove('up'); break;
				case true: this.trigger('beforeMove',['up']); this.goto([this.data.currentScreen[0], this.data.currentScreen[1]-1]); break;
			}
		},
		down: function() {
			if (!this.canIMove()) return false;
			
			switch (this.canIMoveDown()) {
				case false: return false; break;
				case 2: this.trigger('beforeMove',['down']); this.modules.infinity.portalMove('down'); break;
				case true: this.trigger('beforeMove',['down']); this.goto([this.data.currentScreen[0], this.data.currentScreen[1]+1]); break;
			}
		},
		left: function() {
			if (!this.canIMove()) return false;
			
			switch (this.canIMoveLeft()) {
				case false: return false; break;
				case 2: this.trigger('beforeMove',['left']);this.modules.infinity.portalMove('left'); break;
				case true: this.trigger('beforeMove',['left']); this.goto([this.data.currentScreen[0]-1, this.data.currentScreen[1]]); break;
			}
		},
		right: function() {
			if (!this.canIMove()) return false;
			
			switch (this.canIMoveRight()) {
				case false: return false; break;
				case 2: this.trigger('beforeMove',['right']); this.modules.infinity.portalMove('right'); break;
				case true: this.trigger('beforeMove',['right']); this.goto([this.data.currentScreen[0]+1, this.data.currentScreen[1]]); break;
			}
		},
		rebuildMap : function() {
			Brahma(this.htmlelements.map).empty();
			var that = this;
			for (var y = 0; y<this.grid.length;y++) {
				if (typeof this.grid[y]!=="undefined") (function(wrapper, layer) {
					for (var x = 0;x<layer.length;x++) {
						(function(x,y) {
							Brahma(wrapper)
							.put('div', {
								"class": "screen-box-"+("undefined"===typeof layer[x] ? "empty" : "item"),
								"data-coords": y+'x'+x
							})
							.bind('click',function() {
								
									if (Brahma(this).hasClass('screen-box-item')) that.goto([x,y]);
							});
						})(x,y);
					}
				}).call(this, Brahma(this.htmlelements.map)
					.put('div', {
						"class": "screen-box-layer"
					}), this.grid[y]);	
			};
		},
		navigationHide : function(thing) {
			switch(thing){
				case 'up': Brahma(this.htmlelements.navigation_up).addClass('hidden'); break;
				case 'down': Brahma(this.htmlelements.navigation_down).addClass('hidden'); break;
				case 'left': Brahma(this.htmlelements.navigation_left).addClass('hidden'); break;
				case 'right': Brahma(this.htmlelements.navigation_right).addClass('hidden'); break;
			}
		},
		navigationShow : function(thing) {
			switch(thing){
				case 'up': Brahma(this.htmlelements.navigation_up).removeClass('hidden'); break;
				case 'down': Brahma(this.htmlelements.navigation_down).removeClass('hidden'); break;
				case 'left': Brahma(this.htmlelements.navigation_left).removeClass('hidden'); break;
				case 'right': Brahma(this.htmlelements.navigation_right).removeClass('hidden'); break;
			}
		},
		/*
		Возвращает координаты слайда, который лежит сверху (в случае если движение наверх невозможно возвращает false)
		*/
		getRealUpSlide: function() {
			switch(this.config.infinityMethod) {
				case 'passage':
					if (this.grid.length===1) return false;
					if (this.config.infinity && this.data.currentScreen[1]===0 && this.grid[this.data.maxY][this.data.currentScreen[0]]) return 2;
					if (
						this.grid[this.data.currentScreen[1]-1] && 
						this.grid[this.data.currentScreen[1]-1][this.data.currentScreen[0]]
					)			
				break;

			}
		},
		/*
		Функция определяет можем ли мы двигаться вверх  
		*/
		canIMoveUp : function() {
			
			if (this.grid.length===1) return false;
			if (
				this.config.infinity && 
				(
						
					(this.config.infinityMethod==='discover' && !(
						this.grid[this.data.currentScreen[1]-1] && 
						this.grid[this.data.currentScreen[1]-1][this.data.currentScreen[0]]
					))
					||
					(this.data.currentScreen[1]===0 && this.grid[this.data.maxY][this.data.currentScreen[0]])
				)
			) return 2;
			if (
				this.grid[this.data.currentScreen[1]-1] && 
				this.grid[this.data.currentScreen[1]-1][this.data.currentScreen[0]]
			)			
			return true;
			return false;
		
			
		},
		canIMoveDown : function() {
			if (this.grid.length===1) return false;
			if (
				this.config.infinity && 
					(
						
						(this.config.infinityMethod==='discover' && !(
							this.grid[this.data.currentScreen[1]+1] && 
							this.grid[this.data.currentScreen[1]+1][this.data.currentScreen[0]]
						))
						||
						(this.data.currentScreen[1]===this.grid.length-1 && this.grid[0][this.data.currentScreen[0]])
					)
			) return 2; 
			if (
				this.grid[this.data.currentScreen[1]+1] && 
				this.grid[this.data.currentScreen[1]+1][this.data.currentScreen[0]]
			) return true;
			return false;
		},
		canIMoveLeft : function() {
			if ( (!this.config.infinity || this.config.infinityMethod!=='discover') && this.grid[this.data.currentScreen[1]].length===1) return false;
			if (!this.grid[this.data.currentScreen[1]][this.data.currentScreen[0]-1] && this.config.infinity && (
					(this.config.infinityMethod==='discover' && this.grid.length>1) ||
					(this.data.currentScreen[0]===0 && this.grid[this.data.currentScreen[1]][this.data.maxX])
				)
			) return 2;
			if (
				this.grid[this.data.currentScreen[1]][this.data.currentScreen[0]-1]
			)
			return true;
			return false;
		},
		canIMoveRight : function() {

			if ( (!this.config.infinity || this.config.infinityMethod!=='discover') && this.grid[this.data.currentScreen[1]].length===1) return false;
			
			if (!this.grid[this.data.currentScreen[1]][this.data.currentScreen[0]+1] && this.config.infinity && (
					(this.config.infinityMethod==='discover' && this.grid.length>1) ||
					(this.data.currentScreen[0]===this.grid[this.data.currentScreen[1]].length-1 && this.grid[this.data.currentScreen[1]][this.data.minX])
				)
			) return 2;
			if (
				this.grid[this.data.currentScreen[1]][this.data.currentScreen[0]+1]
			)
			return true;
			return false;
		},
		/*
		Дает разрешение да движение  
		*/
		canIMove : function() {
			if (this.config.lockDelay===true) {
				if (this.data.moving) return false;
				return true;
			} else if (typeof this.config.lockDelay==="number") {
				
				if (this.data.moving && (new Date().getTime()-this.data.movingStartTime)<this.config.lockDelay) return false;
				return true;
			} else {
				return true;
			}
		},
		/*
		Осуществляет поиск перовго не пустого слайда с y координатой
		*/
		getFirstXSlideByY: function(y) {
			if (!this.grid[y]) return false;
			for (var x=0;x<this.grid[y].length;x++) {
				if (this.grid[y][x]) return x;
			}
			return false;
		},
		/*
		Осуществляет поиск последнего не пустого слайда с y координатой
		*/
		getLastXSlideByY: function(y) {
			if (!this.grid[y]) return false;
			for (var x=this.grid[y].length-1;x>=0;x--) {
				if (this.grid[y][x]) return x;
			}
			return false;
		},
		/*
		Осуществляет поиск первого не пустого слайда с x координатой
		*/
		getFirstYSlideByX : function(x) {
			for (var y=0;y<this.grid.length;y++) {
				if (this.grid[y]&&this.grid[y][x]) return y;
			}
			return false;
		},
		/*
		Осуществляет поиск последнего не пустого слайда с x координатой
		*/
		getLastYSlideByX : function(x) {
			for (var y=this.grid.length-1;y>=0;y--) {
				if (this.grid[y]&&this.grid[y][x]) return y;
			}
			return false;
		},
		/*
		Перемещает видимую часть экрана, но с помощью margin (без эффекта), 
		для подмены позиции  
		*/
		shiftScreen: function(x, y, callback) {
			var callback = callback||false;

			Brahma(this.htmlelements.screensWrapper).css({
				"top": (y*-100)+"%",
				"left": (x*-100)+"%"
			});
			("function"===typeof callback) && callback();
		},
		moveScreen: function(x, y, immediately, callback) {
			
			var callback = callback||false;
			if (immediately) {
				Brahma(this.htmlelements.screensWrapper).addClass('noTransit');
				var that = this;
			}

			/*
			При каждом перемещении мы должны учитывать смещении в режиме infinity 
			this.master.data.shift 
			*/
			var absx = this.data.shift.x+(x*-1);
			var absy = this.data.shift.y+(y*-1);

			var polytransform = ["-webkit-","-ms-","-o-",""];
			var style = {};
			var transform = (Brahma.caniuse('translate3D')) ?
			"translate3D("+(absx*100)+"%,"+(absy*100)+"%,0)" :
			"translateX("+(absx*100)+"%) translateY("+(absy*100)+"%)";
			for(var t=0;t<polytransform.length;t++) {
				
				style[polytransform[t]+"transform"] = transform;
			}

			Brahma(this.htmlelements.screensWrapper).css(style);

			if (immediately) {
				/*
				Судя по тестам, применение стилей не происходит моментально. Возврат 
				transition сразу после указания стиля делает анимацию стиля, который 
				был установлен до этого. Поэтому нужно выждать хотя бы какое то время. 
				*/
				setTimeout(function() {
					Brahma(that.htmlelements.screensWrapper).removeClass('noTransit');
					("function"===typeof callback) && callback();
				}, 10);
			} else {
				/*
				Brahma(this.htmlelements.screensWrapper).one("transitionend webkitTransitionEnd 
				oTransitionEnd MSTransitionEnd", function() { 
				("function"===typeof callback) && callback(); 
				}); 
				*/
				setTimeout(function() {
					("function"===typeof callback) && callback();
				}, this.config.duration);
			}
		},
		goto : function(xy, callback) {

			if (!this.canIMove()) {
				return false; // Запрет на движение, но это не должно происходить в этой функции
			}
			this.data.currentScreen = xy;
			var x = xy[0];
			var y = xy[1];


			this.data.movingStartTime = new Date().getTime();
			this.data.moving = true;
			var that = this;
			console.log('invoke move');
			this.moveScreen(x,y, false, function() {
				console.log('moved');
				that.data.movingEndTime = new Date().getTime();
				that.data.moving = false;
			});

			/*
			Расчет появления и исчезновения кнопок навигации  зависит не тольок 
			от того достигнуть ли край сетки, но и должен учитывать пропущенные 
			слайды  
			*/

			/*
			Расчет стрелки вверх. Слайд не должен ровняться нулю или должен сущестовать 
			предыдущий слайда. Всё это истинно только если выключен режим `infinity` 
			При включенном инфинити всё это истинно только если индекс слайда 
			не равен нулю. 
			*/
			if (!this.canIMoveUp())
			this.navigationHide('up');
			else this.navigationShow('up');

			/*
			Расчет движения вниз. Слайд не должен быть последним или не должно 
			сущестовать низлежащего слайда. Всё это истинно только если выключен 
			режим `infinity`. 
			При включенном инфинити всё это истинно только если индекс слайда 
			не послений. 
			*/
			if (!this.canIMoveDown())
			this.navigationHide('down');
			else this.navigationShow('down');

			/*
			Расчет движения влево. Слайд не должен быть первым в ряду или должен 
			иметь слайды сзади. Всё это истинно только если выключен режим `infinity`. 
			В режиме инфинити всё это истинно только если это не первый слайд 
			в ряду  
			*/
			if (!this.canIMoveLeft())
			this.navigationHide('left');
			else this.navigationShow('left');

			/*
			Расчет движения вправо. Слайд не должен быть последним в ряду или 
			должен иметь след впереди. Это стинно только если выключен режим 
			`infiniti`. 
			В режиме инфинити всё это истинно только если это не последний слайд 
			в ряду 
			*/
			if (!this.canIMoveRight())
			this.navigationHide('right');
			else this.navigationShow('right');

			// Select item in map
			Brahma(this.htmlelements.map).find('>div>div').removeClass("current");
			Brahma(this.htmlelements.map).find('div[data-coords='+y+'x'+x+']').addClass("current");
		},
		// Регистрирует элемент в сетке
		reserveCell : function (x,y,el) {
			if (typeof this.grid[y]!=="undefined" && typeof this.grid[y][x]!=="undefined") {
				var xy = (function(ox,oy) {
					for (var y = 0; y<this.grid.length;y++) {
						if (typeof this.grid[y]==="undefined") {
							return [0,y];
						} else
						for (var x = 0;x<this.grid[y].length;x++) {
							if (typeof this.grid[y][x]==="undefined") {
								return [x,y];
							}
						}
					}
					return [ox,oy];
				}).call(this, x,y);

				var x = xy[x];
				var y = xy[y];
			}

			if ("undefined"===typeof this.grid[y]) this.grid[y] = [];

			this.grid[y][x] = {
				node: el,
				active: Brahma(el).hasClass('screen-box-item')
			};

			// Оставляем информацию о максимальном слайде по вертикали и по горизонтали
			if (y>this.data.maxY) this.data.maxY = y;
			if (x>this.data.maxX) this.data.maxX = x;
			if (x<this.data.minX) this.data.minX = x;
			if (y<this.data.minY) this.data.minY = y;

			return [x,y];
		},
		module: function(a, b, c) {
			
			var globalName, initial, data;
			(arguments.length>2) && (globalName=a,data=b,initial=c);
			(arguments.length==2) && (globalName=a,data=b,initial=false);
			(arguments.length==1) && (globalName=a,initial=false,data=false);

			if (data) {
				// Создаем инициализатор модуля
				this.modules[globalName] = function() {
					return (initial || function() {return this;}).call((function(master, globalName, data) {
						var m = Brahma.industry.createModule().assing(data);
						m.master = master;
						return m;
					})(this, globalName, data));
				};
			} else {
				if ("function"==typeof this.modules[globalName]) this.modules[globalName] = this.modules[globalName].call(this);
			}

			return this.modules[globalName];
		},
		effect: function(a, b, c) {
			
			var globalName, initial, data;
			(arguments.length>2) && (globalName=a,data=b,initial=c);
			(arguments.length==2) && (globalName=a,data=b,initial=false);
			(arguments.length==1) && (globalName=a,initial=false,data=false);

			if (data) {
				// Создаем инициализатор модуля
				this.effects[globalName] = function() {
					return (initial || function() {return this;}).call((function(master, globalName, data) {
						var m = Brahma.module(data);
						m.master = master;
						return m;
					})(this, globalName, data));
				};
			} else {
				if ("function"==typeof this.effects[globalName]) this.effects[globalName] = this.effects[globalName].call(this);
			}

			return this.effects[globalName];
		}
	});
})(Brahma);

// ADDITIONAL MODULES


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

/*
PRELOADER  
Задача прелоудера в том, что бы установить приоритет загрузки первой 
фотографии 
и не показывать следующий слайд пока он не будет загружен 
*/
Brahma.app('screens').module('preloader', {
	loadings: 0,
	loadImage: function(src, first) {
		var img = new Image(), that = this;

		img.onload = img.onerror = function() {
			that.loaded();
		}
		img.src = src;
		if (first) {
			// Если это первый элемент, мы должны передать первичные данные обработчикам
			// и установить эту высоту на всех контейнер
			this.master.trigger('firstimginit',[img]);
		}
	},
	loaded: function() {
		this.loadings--;

		if (this.loadings===0) this.done();
	},
	done: function() {
		Brahma(this.master.meta.slides[0].node).css("position", "absolute");
		// Отображаем все слайды и запускаем слайдшоу, если нужно
		this.master.module('slideshow').resume();
	},
	run: function() {
		// Останавливаем слайдшоу
		this.master.module('slideshow').pause();

		// Прячем все слайды, кроме первого
		for (var i =1; i<this.master.meta.slides.length;i++) {
			Brahma(this.master.meta.slides[i].node).css("opacity", 0);
		}
		// Первый слайд делаем статичным
		Brahma(this.master.meta.slides[0].node).css("position", "static");
		// Мы снова сделаем его абсолютным, после загрузки остальных
		// Устанавливаем высоту контенера автоматической, если включен режим контроля высоты
		if (this.master.config.adjustContainerHeight) Brahma(this.master.selector).css({
			height: 'auto'
		});
		// Ждем загрузки всех слайдов
		this.loadings = 0;
		var images=[], that = this;
		for (var i =0; i<this.master.meta.slides.length;i++) {
			if (Brahma(this.master.meta.slides[i].node).is('img')) {
				images.push(Brahma(this.master.meta.slides[i].node).attr("src")); that.loadings++;
			} else
			Brahma(this.master.meta.slides[i].node).find('img').each(function() {
				images.push(Brahma(this).attr("src")); that.loadings++;
			});
		}
		for (var i =0; i<images.length;i++) {
			this.loadImage(images[i], i===0);
		}
	}
});

/*
SLIDESHOW  
*/
Brahma.app('screens').module('slideshow', {
	timer: 0,
	paused: false,
	run: function() {
		var that = this;
		if (!this.paused) {
			
			this.timer = setInterval(function() {
				that.master.next();
			}, this.master.config.slideshowDelay);
		}
		
		
	},
	clear: function() {
		if (this.timer>0) clearInterval(this.timer);
	},
	pause: function() {
		if (this.timer>0) clearInterval(this.timer);
		this.paused = true;
	},
	resume: function() {

		if (this.paused) {
			this.paused = false;
			if (this.master.config.slideshow) this.run();

		}
	}
});

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
			that.master.goto([nextx,nexty], function() {
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
