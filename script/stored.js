define(["command", "session"], function(CMD, SESS) {
	var attrs = null;
	var plugins = null;
	var globals = null;
	var MODULE = {
		getLoadCommand: function() { return [
			{ def: { name: 'attrs', data: { action: 'get' }}, cb: function(res) {
				attrs = res;
			}},
			{ def: { name: 'attrs', data: { action: 'getGlobals' }}, cb: function(res) {
				globals = res;
			}},
			{ def: { name: 'auth', data: { action: 'listPlugins' }}, cb: function(res) {
				plugins = res;
			}} 
		];},
		getAttrsSetCommand: function(values) { 
			if (attrs == null) throw new Error("Attrs not loaded yet");
			return { def: { name: 'attrs', data: { action: 'set', data: values }}, cb: function() {
				for (var key in values) if (values.hasOwnProperty(key)){
					var val = values[key];
					if (val == null) 
						delete attrs[key];
					else 
						attrs[key] = val; 
				}
			}};
		},
		getAttrs: function() {
			if (attrs == null) throw new Error("Attrs not loaded yet");
			return attrs;
		},
		getPlugins: function() {
			if (plugins == null) throw new Error("Plugins not loaded yet");
			return plugins;
		},
		getGlobals: function() {
			if (globals == null) throw new Error("Globals not loaded yet");
			return globals;
		}
	};
	return MODULE;
});