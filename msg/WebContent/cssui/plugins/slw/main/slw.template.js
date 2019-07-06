/**
 * Slw.template v1.0 2018.8 by CSS WangWeidong
 */

Slw.templateSettings = {
	evaluate : /<slw%([\s\S]+?)%slw>/g,
	interpolate : /<slw%=([\s\S]+?)%slw>/g
};
Slw.noMatch = /(.)^/;

Slw.escapes = {
	"'" : "'",
	'\\' : '\\',
	'\r' : 'r',
	'\n' : 'n',
	'\u2028' : 'u2028',
	'\u2029' : 'u2029'
};
Slw.escaper = /\\|'|\r|\n|\u2028|\u2029/g;

Slw.escapeChar = function(match) {
	return '\\' + Slw.escapes[match];
};

Slw.template = function(text) {
	var settings = Slw.templateSettings;
	var matcher = RegExp([ (settings.interpolate || Slw.noMatch).source, (settings.evaluate || Slw.noMatch).source ].join('|') + '|$', 'g');
	
	var index = 0;
	var source = "var _t,_s='';\n";
	source += "try{\n_s+='";
	text.replace(matcher, function(match, interpolate, evaluate, offset) {
		source += text.slice(index, offset).replace(Slw.escaper, Slw.escapeChar);
		index = offset + match.length;
		
		if (interpolate) {
			source += "'+\n((_t=(" + interpolate + "))==null?'':_t)+\n'";
		}
		else if (evaluate) {
			source += "';\n" + evaluate + "\n_s+='";
		}
		return match;
	});
	source += "';\n}catch(e){_s=''}\n";
	source += 'return _s;\n';
	var render = new Function('data', 'index', source);
	var template = function(data, index) {
		return render.call(this, data, index);
	};
	template.source = 'function(data,index){\n' + source + '}';
	return template;
};
