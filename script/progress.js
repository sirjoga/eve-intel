define([], function(){
	var MODULE = {
		start: function(text, timeout) {
			var d = null;
			var ended = false;
			function show() {
				if (ended) return;
				d = $('<div style="border-radius:5px;padding:10px;"></div>').appendTo('body');
				d.window({
					width: 300,
					height: 38,
					title: '',
					border: 'thin',
					modal: true
				});
				d.window('center');
				d.css('text-align','center');
				$('<span></span>').appendTo(d).text(text);
			}
			if (typeof(timeout) == 'undefined' || timeout == 0) show();
			else setTimeout(show, timeout);
			var res = {
				end: function() {
					ended = true;
					if (d != null) {
						d.window('destroy');
						d.remove();
					}
				}
			}
			return res;
		}
	};
	return MODULE;
});