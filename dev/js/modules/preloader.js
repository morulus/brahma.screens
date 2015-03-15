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