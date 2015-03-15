/*
	Плагин совместимости Brahma и jQuery, позволяет вызывать приложения Brahma через jQuery.
	Brahma.app('myBrahmaApp');
	jQuery('#my').brahma.myBrahmaApp();
*/
;(function(jQuery, Brahma) {
	
	Object.defineProperty(jQuery.fn, "brahma", {
  		get: function() {
  				console.log('getter', this);
   			 return Brahma(this);
  		}
	});
})(jQuery, Brahma);