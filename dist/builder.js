var UglifyJS = require("./uglifyjs/uglify-js.js").parser;
var fs = require('fs');
var splitByStrings = function(txt, maxlength) {
	var tabs = txt.match(/^[\t]*/)[0];
	txt = txt.substring(tabs.length+2, txt.length-2);
	
	var strings = [];
	var lp = txt.split(/\r\n/);
	var txtwas = false;
	for (var q = 0;q<lp.length;q++) {

		if (/^[\s]*$/.test(lp[q]) && !txtwas) continue;
		else txtwas = true;

		lp[q] = lp[q].replace(/^[ ]*/,'')

		var sp = lp[q].split(' ');
		
		var tmp = '';
		
		for (var i =0;i<sp.length;i++) {

			tmp+=sp[i].split("\t").join('')+' ';

			if (tmp.length>maxlength) {
				strings.push(tmp);
				tmp = '';
			}
		}
		if (tmp!==''&& !(q==lp.length-1 && /^[\s]*$/.test(tmp))) {
			strings.push(tmp);
		}
	}
	return tabs+"/*\r\n"+tabs+strings.join("\r\n"+tabs)+"\r\n"+tabs+"*/";
}
fs.readFile('brahma.screens.js', 'utf-8', function(err, data) {
	if (err) {
	    console.log(err);
	} else {
		// 
		var matches = data.match(/[\t]*\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//ig);
		
		for (var i=0;i<matches.length;i++) {
			data = data.split(matches[i]).join(splitByStrings(matches[i], 64));
		}
	}
	
	fs.writeFile('test.js', data);
});
