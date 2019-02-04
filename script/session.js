define(function(){
	var ready = false;
	var sessId;
	return {
		setId: function(id) {
			sessId = id;
			ready = true;
		},
		getId: function() {
			if (!ready) throw new Error("Session is not inited yet");
			return sessId;
		},
		getInitCommand: function() {
			return {
				def: {name: 'session', data: {operation:'save'}},
				cb: function(dt) { 
					ready = true; sessId = dt.id; 
				}
			};
		},
		getLoadCommand: function() {
			if (!ready) throw new Error("Session is not loaded yet");
			return {
				def: {name: 'session', data: {operation: 'load', id: sessId}}
			};
		}
		
	};
});