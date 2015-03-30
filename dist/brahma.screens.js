/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

/*!
* brahma.screens 1.3.0 (* 30-03-2015)
* Prallax fullscreen slider
* https://github.com/morulus/brahma.screens

* Released under the MIT license 
* Copyright (c) 2015, Vladimir Kalmykov (@morulus) <vladimirmorulus@gmail.com> 
*/

;(function($$) {
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

	$$.app('screens', {
		config: {
			infinity: false, // Бесконечное пролистывание
			lockDelay: false, // Задержка после перемещения перед тем как будет разрещено ещё одно действие
			easing: 'cubic-bezier(.43,.2,.46,.8)',
			duration: 650, // Длительность анимации
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
			infinityMethod: 'passage', // Определяет тип портального перехода (false, `passage`,`discover`)
			touch: true,
			autoFillImages: true, 
			deadlockEffect: true, // Эффект показывает, что дальше движение невозможно
			keyboard: true, // Поддерживает клавиши клавиатуры
			mobileMap: false, // На мобильных устройствах при анимации увеличивается мини-карта и отображается по центру экрана
			uiFill: 'white',
			debug: false
		},
		data: {
			currentScreen: false,
			shift: {
				x:0,y:0
			},
			advshift: {
				x:0,y:0
			},
			moving: 0,
			movingStartTime:0,
			movingEndTime:0,
			maxX: 0,
			maxY: 0,
			minX: 0,
			minY: 0,
			locks: false, // Блокировка новый движений и действий
			uiFill: ''
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
			mapElements: []
		},
		run: function() {
			var that = this;
			// Convert inner content to grid
			Brahma(this.selector).find('>*').wrapAll('div', {

			});

			this.htmlelements.screensWrapper = Brahma(this.selector).find('>div');

			Brahma(this.selector).addClass('brahma-screens');
			var first=false,x,y;
			// Build grid
			Brahma(this.htmlelements.screensWrapper).find('>*').each(function() {
				var element = this;
				/*
					Автоматческое преобразование IMG в DIV
				*/
				x = parseInt(Brahma(element).data("screens-x"));
				y = parseInt(Brahma(element).data("screens-y"));
				if (!first) first = [x,y];
				that.initScreen(x, y, this, {
					uiFill: Brahma(element).data("screens-ui-fill") || false,
					enabled: Brahma(element).attr("screens-disabled")===null
				});
			});
			if (!this.data.currentScreen) this.data.currentScreen = first;

			// Create path group
			var arrowSpriteId = "screens-sprite-arrow";
			var defssvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			document.getElementsByTagName('body')[0].appendChild(defssvg);
			defssvg.style.display = 'none';
			defssvg.innerHTML = '<g id="yo-a"><path  d="M13.849,54.143l3.182,2.784l26.819-28.368L16.962,0.249l-3.206,2.989l24.17,25.388L13.849,54.143z"/></g>';

			// Create function that create a link to svg arrow
			function createSvgSprite(selector) {
				//Brahma(this).html('<svg><use xlink:href="#yo-a"></use></svg>');
				var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
				Brahma(this)[0].appendChild(svg);
				var use = document.createElementNS("http://www.w3.org/2000/svg",'use');
				use.setAttributeNS('http://www.w3.org/1999/xlink','href',"#yo-a");
				svg.appendChild(use);
				use.style.fill = that.config.uiFill;
				return use;
			};

			// Create navigation
			this.htmlelements.navigation = Brahma(this.selector)
			.tie(function() {
				Brahma(this)
				.put('div', {
					"class": "brahma-screens-navigation brahma-screens-navigation-up"
				})
				.tie(function() { 

					that.htmlelements.navigation_up = this; 
					that.htmlelements.navigation_up_figure = createSvgSprite.call(this, "#"+arrowSpriteId);
					Brahma(this).bind('click',function() { that.up() }); 
				})
				.and('div', {
					"class": "brahma-screens-navigation brahma-screens-navigation-down"
				}).tie(function() { 
					that.htmlelements.navigation_down = this; 
					that.htmlelements.navigation_down_figure = createSvgSprite.call(this, "#"+arrowSpriteId);
					Brahma(this).bind('click',function() { that.down() }); 
				})
				.and('div', {
					"class": "brahma-screens-navigation brahma-screens-navigation-left"
				}).tie(function() { 
					that.htmlelements.navigation_left = this; 
					that.htmlelements.navigation_left_figure = createSvgSprite.call(this, "#"+arrowSpriteId);
					Brahma(this).bind('click',function() { that.left() });
				})
				.and('div', {
					"class": "brahma-screens-navigation brahma-screens-navigation-right"
				}).tie(function() { 
					that.htmlelements.navigation_right = this; 
					that.htmlelements.navigation_right_figure = createSvgSprite.call(this, "#"+arrowSpriteId);
					Brahma(this).bind('click',function() { that.right() }) 
				});
			});

			// Create map
			this.htmlelements.map = Brahma(this.selector)
			.put('div', {
				"class": "brahma-screens-map"
			});

			// Build map
			this.rebuildMap();

			// Set transition
			Brahma(this.htmlelements.screensWrapper).css(['-webkit-','-ms-','-o-','-moz-'],{
				'transition-duration': this.config.duration+'ms'
			});

			Brahma(this.htmlelements.screensWrapper).css(['-webkit-','-ms-','-o-','-moz-'],{
				'transition-timing-function': this.config.easing
			});

			// Run keylistner
			if (this.config.keyboard)
			this.module('keylistner').run();

			if (this.config.infinity)
			this.module('infinity').run();

			// Run touch support
			if (this.config.touch)
			this.module('touch');

			if (Brahma.caniuse('mobile') && this.config.mobileMap)
			this.module('mobileMap');

			// Select curren
			this.goto(this.data.currentScreen, true);

			// Show container
			Brahma(this.selector).css("opacity","1");
		},
		initScreen : function(x,y,element,config) {

			if (this.config.autoFillImages && Brahma(element)[0].tagName.toLowerCase()==='img') {
				var src = Brahma(element).attr("src");
				var alt = Brahma(element).attr("alt") || src.replace('\\','/').split('/').reverse()[0];
				element=Brahma(element).replace(document.createElement('DIV'), true).css({
					"background-image": "url(\""+src+"\")"
				});

				Brahma(element).put('div',{
					"class": "brahma-screens-label"
				}).html(alt);
			};

			var xy = this.reserveCell(x,y, Brahma.copyProps(config,{
				node: element
			}));

			Brahma(element).css(Brahma.extend({
				left: ((xy[0])*100)+'%',
				top: ((xy[1])*100)+'%'
			}, 
			("object"==typeof config.css ? config.css : {})
			));

			if (Brahma(element).attr("screens-current")!==null)
			this.data.currentScreen = xy;

			return this.grid[xy[1]][xy[0]];
		},
		up: function() {
			if (!this.canIMove()) return false;
			
			switch (this.canIMoveUp()) {
				case false: return this.module('edgeEffect').up(); break;
				case 2: this.trigger('beforeMove',['up']); this.modules.infinity.portalMove('up'); break;
				case true: this.trigger('beforeMove',['up']); this.goto([this.data.currentScreen[0], this.data.currentScreen[1]-1]); break;
			}
		},
		down: function() {
			if (!this.canIMove()) return false;
			switch (this.canIMoveDown()) {
				case false: return this.module('edgeEffect').down(); break;
				case 2: this.trigger('beforeMove',['down']); this.modules.infinity.portalMove('down'); break;
				case true: this.trigger('beforeMove',['down']); this.goto([this.data.currentScreen[0], this.data.currentScreen[1]+1]); break;
			}
		},
		left: function() {
			if (!this.canIMove()) return false;
			
			switch (this.canIMoveLeft()) {
				case false: return this.module('edgeEffect').left(); break;
				case 2: this.trigger('beforeMove',['left']);this.modules.infinity.portalMove('left'); break;
				case true: this.trigger('beforeMove',['left']); this.goto([this.data.currentScreen[0]-1, this.data.currentScreen[1]]); break;
			}
		},
		right: function() {
			if (!this.canIMove()) return false;
			
			switch (this.canIMoveRight()) {
				case false: return this.module('edgeEffect').right(); break;
				case 2: this.trigger('beforeMove',['right']); this.modules.infinity.portalMove('right'); break;
				case true: this.trigger('beforeMove',['right']); this.goto([this.data.currentScreen[0]+1, this.data.currentScreen[1]]); break;
			}
		},
		rebuildMap : function() {
			var that = this;
			// Unbind all events listners to avoid memory leaks
			for (var i=0;i<that.htmlelements.mapElements.length;i++){
				Brahma(that.htmlelements.mapElements[i]).unbind('click');
			};
			Brahma(this.htmlelements.map).empty();
			this.htmlelements.mapElements = [];

			for (var y = 0; y<this.grid.length;y++) {
				if (typeof this.grid[y]!=="undefined") 
				{
					(function(wrapper, layer) {
						for (var x = 0;x<layer.length;x++) {
							(function(x,y) {
								var disabled = "undefined"===typeof layer[x] || !layer[x].enabled;
								var mapItem = Brahma(wrapper)
								.put('div', {
									"class": "screen-box-"+(disabled ? "empty" : "item"),
									"data-coords": y+'x'+x
								});

								mapItem.tie(function() {
									if (that.data.currentScreen[0]===x&&that.data.currentScreen[1]===y) {
										this.addClass('screens-current');
									};
									!(disabled) && (
										that.htmlelements.mapElements.push(this[0]),
										this.css("background-color", that.config.uiFill)
									);
								});
								if (!disabled) {
									delete disabled;
									mapItem
									.bind('click',function() {
										that.goto([x,y]);
									});
								};
							})(x,y);
						}
					}).call(this, Brahma(this.htmlelements.map)
						.put('div', {
							"class": "screen-box-layer"
						}), this.grid[y]);	
				}
				else {
					Brahma(this.htmlelements.map)
					.put('div', {
						"class": "screen-box-layer"
					})
					.put('div', {
						"class": "screen-box-empty",
						"data-coords": y+'x0'
					});
				}
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
				&& this.grid[this.data.currentScreen[1]-1][this.data.currentScreen[0]].enabled
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
				&& this.grid[this.data.currentScreen[1]+1][this.data.currentScreen[0]].enabled
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
				this.grid[this.data.currentScreen[1]][this.data.currentScreen[0]-1] && this.grid[this.data.currentScreen[1]][this.data.currentScreen[0]-1].enabled
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
				this.grid[this.data.currentScreen[1]][this.data.currentScreen[0]+1] && this.grid[this.data.currentScreen[1]][this.data.currentScreen[0]+1].enabled
			)
			return true;
			return false;
		},
		/*
		Дает разрешение на движение  
		*/
		canIMove : function() {
			if (this.data.locks) return false;
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
		translate: function(x, y) {

			var polytransform = ["-webkit-","-ms-","-o-"];
			
			var transform = (Brahma.caniuse('translate3D')) ?
			"translate3D("+(x+(this.data.shift.x*100)+this.data.advshift.x)+"%,"+(y+(this.data.shift.y*100)+this.data.advshift.y)+"%,0)" :
			"translateX("+(x+(this.data.shift.x*100)+this.data.advshift.x)+"%) translateY("+(y+(this.data.shift.y*100)+this.data.advshift.y)+"%)";
			Brahma(this.htmlelements.screensWrapper).css(polytransform, {"animation-play-state": 'paused'});

			Brahma(this.htmlelements.screensWrapper).css(polytransform, {"transform": transform});
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
			var absx = (x*-1);
			var absy = (y*-1);

			this.translate( (absx*100), (absy*100));

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
		goto : function(xy, immediately, callback) {

			if (!this.canIMove()) {
				return false; // Запрет на движение, но это не должно происходить в этой функции
			}
			if (!(this.data.currentScreen[0]===xy[0]&&this.data.currentScreen[1]===xy[1])) {
				this.trigger('leave',[this.current()]);
				this.current().trigger('leave');
			};

			// Add class to node
			Brahma(this.htmlelements.screensWrapper).find('>*').removeClass('screens-current');

			Brahma(this.grid[xy[1]][xy[0]].node).addClass('screens-current');

			var x = xy[0];
			var y = xy[1];

			this.data.currentScreen = xy;

			this.data.movingStartTime = new Date().getTime();
			this.data.moving++;

			this.get(xy[0], xy[1]).trigger('enter');
			this.trigger('enter', [this.get(xy[0], xy[1])]);

			var that = this;
			this.trigger('beforeMove');

			setTimeout(function() {
				if (that.grid[xy[1]][xy[0]].uiFill) {
					for (var i = 0; i<that.htmlelements.mapElements.length;i++) {
						that.htmlelements.mapElements[i].style.backgroundColor = that.grid[xy[1]][xy[0]].uiFill;
					}
				} else {
					for (var i = 0; i<that.htmlelements.mapElements.length;i++) {
						that.htmlelements.mapElements[i].style.backgroundColor = that.config.uiFill;
					}
				}
			}, this.config.duration/4);

			// Set Arrows Style
			setTimeout(function() {
				if (that.grid[xy[1]][xy[0]].uiFill) {
					that.data.uiFill = that.grid[xy[1]][xy[0]].uiFill;
					Brahma(that.htmlelements.navigation_up_figure).css("fill", that.grid[xy[1]][xy[0]].uiFill);
					Brahma(that.htmlelements.navigation_down_figure).css("fill", that.grid[xy[1]][xy[0]].uiFill);
					Brahma(that.htmlelements.navigation_left_figure).css("fill", that.grid[xy[1]][xy[0]].uiFill);
					Brahma(that.htmlelements.navigation_right_figure).css("fill", that.grid[xy[1]][xy[0]].uiFill);
				} else {
					Brahma(that.htmlelements.navigation_up_figure).css("fill", that.config.uiFill);
					Brahma(that.htmlelements.navigation_down_figure).css("fill", that.config.uiFill);
					Brahma(that.htmlelements.navigation_left_figure).css("fill", that.config.uiFill);
					Brahma(that.htmlelements.navigation_right_figure).css("fill", that.config.uiFill);
					that.data.uiFill = '';
				}
			}, this.config.duration/2);

			this.moveScreen(x,y, immediately||false, function() {
				

				that.data.movingEndTime = new Date().getTime();
				that.data.moving--;
				that.trigger('afterMove');
			});



			/*
			Расчет появления и исчезновения кнопок навигации  зависит не тольок 
			от того достигнуть ли край сетки, но и должен учитывать пропущенные 
			слайды  
			*/

			this.recalcNavigation();

			// Select item in map
			Brahma(this.htmlelements.map).find('>div>div').removeClass("screens-current");
			Brahma(this.htmlelements.map).find('div[data-coords='+y+'x'+x+']').addClass("screens-current");
		},
		/* Перерасчет всего пользовательского интерфейса */
		recalcUI: function() {
			this.recalcNavigation();
			this.rebuildMap();
		},
		recalcNavigation: function() {
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
		},
		disable: function(x,y) {
			(this.grid[y] && this.grid[y][x]) && (this.grid[y][x].enabled=false);
			this.recalcUI();
			return this;
		},
		enable: function(x,y) {
			(this.grid[y] && this.grid[y][x]) && (this.grid[y][x].enabled=true);
			this.recalcUI();
			return this;
		},
		/*
		Возвращает объект экрана. 
		Объект может быть получен двумя способами:
		1. передать в функцию x и y координаты экрана get(0,1);
		2. передать селектор экрана get("#myscreen");
		*/
		get: function() {
			if (arguments.length===1) {
				var src = Brahma(arguments[0]);
				var x = parseInt(src.data("screens-x"));
				var y = parseInt(src.data("screens-y"));
				if ( (x&y) && this.grid[y] && this.grid[x]) {
					return this.grid[y][x];
				}
			} else if (this.grid[arguments[1]] && this.grid[arguments[1]][arguments[0]]) {
				return this.grid[arguments[1]][arguments[0]];
			};
			
			return null;
		},
		current: function() {
			return this.grid[this.data.currentScreen[1]][this.data.currentScreen[0]];
		},
		remove: function(x,y) {
			if (this.grid[y] && this.grid[y][x]) {

				Brahma(this.grid[y][x].node).remove();

				delete this.grid[y][x];

				if (this.grid[y].length===0) delete this.grid[y];
			};
			if (this.data.currentScreen[0]===x&&this.data.currentScreen[1]===y) {
				// Hm... 
			};
			this.recalcUI();
			return this;
		},
		add: function(x,y, config) {
			// Remove old if exists
			if (this.grid[y] && this.grid[y][x]) this.remove(x,y);
			
			var node = Brahma(this.htmlelements.screensWrapper).put('div', {
				"data-screens-x": x,
				"data-screens-y": y
			});
			
			var scr = this.initScreen(x,y,node,config||{});

			// Refresh UI
			this.recalcUI();

			return scr;
		},
		// Регистрирует элемент в сетке
		reserveCell : function (x,y,data) {
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

			if ("undefined"===typeof this.grid[y]) {
				this.grid[y] = [];
			};

			// Создаем новый объект для экрана
			this.grid[y][x] = this.create('screen', {}, [this]);
			Brahma.copyProps(this.grid[y][x], Brahma.copyProps({
				x: x,
				y: y,
				active: Brahma(data.node).hasClass('screen-box-item'),
				uiFill: false,
				onVisible: [],
				enabled: true
			},data));

			// Событие добавления экрана в схему
			this.trigger('gridAdds',[this.grid[y][x]]);

			// Оставляем информацию о максимальном слайде по вертикали и по горизонтали
			if (y>this.data.maxY) this.data.maxY = y;
			if (x>this.data.maxX) this.data.maxX = x;
			if (x<this.data.minX) this.data.minX = x;
			if (y<this.data.minY) this.data.minY = y;

			return [x,y];
		}
	});
})(Brahma);

// ADDITIONAL MODULES

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
/*
Location hash support
*/
Brahma.app('screens').module('location', {

}, function() {

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
