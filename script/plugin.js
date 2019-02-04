define(['bluebird', 'ajaxutil'], function(Promise, AJAX) {
	var loaded = {};
	var PL = {
		
		loadTemplate: function(name) {
			if (!loaded.hasOwnProperty(name)) 
				return PL.loadTemplateNoCache(name).then(function(res) {
					loaded[name] = res;
					return res;
				});
			return Promise.resolve(loaded[name]);
		},
		
		loadTemplateNoCache: function(name) {
			return new Promise(function(resolve, reject) {
				$.ajax({
					async: true,
					type: "GET",
					cache: false,
					url: 'plugins/' + name + '.html',
					success: function(data) {
						var res = {};
						var resElem = '';
						var name = 'DEFAULT';
						function endElem() {
							if (resElem != '') {
								res[name] = resElem;
								resElem = '';
							}
						} 
						$.each(data.split(/\r?\n/), function(i, line) {
							var m = line.match(/^\s*<!--\s*\[([^\]]+)\]/);
							if (m == null) {
								if (resElem != '') resElem = resElem + '\n';
								resElem = resElem + line;
							} else {
								endElem();
								name = m[1];
							}AJAX
						});
						endElem();
						return resolve(res);
					},
					error: function(x, st, e) {
						return reject(new AJAX.HttpError(x));
					}
				});
			});
		},
		
		loadScript: function(name){
			return new Promise(function(resolve, reject) {
				require(['plugins/' + name], function(pl) {
					return resolve(pl);
				});
			});
		},
		
		load: function(name) {
			return Promise.all([
				PL.loadTemplate(name),
				PL.loadScript(name)
			]).spread(function(tpl, sc) {
				var obj = {template: tpl, script: sc};
				if (sc.hasOwnProperty('init')) 
					obj = sc.init(tpl);
				return obj;
			});
		},
		
		createDefaultView: function(name, dest, noCreatePanel) {
			return PL.load(name).then(function(res) {
				var pa;
				if (noCreatePanel) {
					pa = dest;
				} else {
					pa = $('<div></div>').appendTo(dest);
					pa.panel({
						fit : true,
						border : false
					});
				}
				if (res.template.hasOwnProperty('DEFAULT'))
					pa.panel({content: res.template.DEFAULT});
				return res.script.initDefaultView(pa, res.template);
			});
		}
	};
	return PL;
});