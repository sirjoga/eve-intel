define([], function(){

	var escMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'/': '&#x2F;',
		'`': '&#x60;',
		'=': '&#x3D;'
	};

	
	var MODULE = {
		intervalToStr: function(i) {
			var d, m, res;
			d = Math.floor(i/60/60/24);
			if (d>0) {
				m = Math.floor((i - d*60*60*24)/60/60);
				res = "" + d + "d";
				if (m > 0) res = res + " " + m + "h";
				return res; 
			}
			d = Math.floor(i/60/60);
			if (d>0) { 
				m = Math.floor((i - d*60*60)/60);
				res = "" + d + "h";
				if (m > 0) res = res + " " + m + "m";
				return res; 
			}
			d = Math.floor(i/60); 
			if (d>0) {
				m = (i - d*60);
				res = "" + d + "m";
				if (m > 0) res = res + " " + m + "s";
				return res; 
			}
			return "" + i + "s"; 
		},
		numberToStr: function(x) {
			var m = 0;
			while (x>1000) {
				x = x/1000;
				m = m + 1;
			}
			
			x = x.toFixed(2);
			if (m>0) x = x + " " + ["K", "M", "B", "T"][m-1];
			return x;
		},

		escapeHtml: function(string) {
			return String(string).replace(/[&<>"'`=\/]/g, function (s) {
				return escMap[s];
			});
		}		
	
	};
	return MODULE;
});