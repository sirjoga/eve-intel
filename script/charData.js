define([], function() {
	var data = {};
	var MODULE = {
		getCommand: function() {
			return {
				def: {name: 'plugin', data: {name: "charData", data: {action:'listAll'}}},
				cb: function(dt) {
					data = {};
					for (var i=0; i<dt.length; i++) {
						var row = dt[i];
						data[row.char_id] = row;
					}
				}
			};
		},
		getData: function() { return data; }
	};
	return MODULE;
});