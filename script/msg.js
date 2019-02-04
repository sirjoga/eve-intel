define(['bluebird'], function(Promise) {
	var MODULE = {
		wrapMessager: function(messagerFunc) {
			var p = new Promise(function(resolve, reject){
				var w = messagerFunc(p);
				w.window({onClose: function() {
					setTimeout(function() {return resolve(null); }, 100);
				}});
				w.find(".messager-input").focus();
			});
			return p;
		}
	};
	return MODULE;
});