define(["command", "session"], function(CMD, SESS) {

	var isAdmin = false;
	
	var MODULE = {
		NOLOGIN: 0,
		RETURN: 1,
		RESTORE: 2,
		isAdmin: function() {
			return isAdmin;
		},
		logoff: function() {
			return CMD.exec([
				{def: {name:"auth", data:{"action":"logoff"}}}
			]);			
		},
		forgetAll: function() {
			return CMD.exec([
				SESS.getLoadCommand(),
				{def: {name:"auth", data:{"action":"forgetAll"}}}
			]);
		},
		logon: function() {
			var hash = {};
			(function(){
				var h = window.location.hash;
				if (typeof(h) == undefined) return;
				if (h == '') return;
				window.location.hash = '';
				h = h.substr(1);
				var args = h.split("&");
				for (var i=0; i<args.length; i++) {
					var dt = args[i].split('=');
					hash[dt[0]] = dt[1];
				}
			})();
			if (typeof(hash['return']) != 'undefined') {
				SESS.setId(hash['return']);
				return CMD.exec([
					SESS.getLoadCommand(),
					{cmd: {def: {name:"auth", data:{"action":"return", }}}, retKey:""}
				]).then(function(res){
					res.hash = hash;
					res.state = MODULE.RETURN;
					return res;
				});
			} else {
				return CMD.exec([
					SESS.getInitCommand(),	
					{cmd: {def: {name:"auth", data:{"action":"restore"}}}, retKey:""}
				]).then(function(res) {
					if (typeof(res.charId)!='undefined') {
						res.hash = hash;
						res.state = MODULE.RESTORE;
						return res;
					}
					return CMD.exec([
						SESS.getLoadCommand(),
						{cmd: {def: {name:"auth", data:{"action":"login"}}}, retKey:""}
					]).then(function(res) {
						res.hash = hash;
						res.state = MODULE.NOLOGIN;
						return res;
					});
				});
			}
		}
	};
	return MODULE;
});