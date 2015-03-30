;(function($$) {
	<%=$.snippet('internals/screenPrototype.js')%>

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

<%=$.snippet('modules/touch.js')%>
<%=$.snippet('modules/keylistner.js')%>
<%=$.snippet('modules/preloader.js')%>
<%=$.snippet('modules/edgeEffect.js')%>
<%=$.snippet('modules/mobileMap.js')%>
<%=$.snippet('modules/location.js')%>
<%=$.snippet('modules/infinity.js')%>