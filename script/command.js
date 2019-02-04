define(['bluebird', 'ajaxutil'], function(Promise, AJAX) {
	
	var ONLY_THIS_ID = '(ONLY THIS)'; 
	
	function CommandError(state, req, resp) {
		this.req =  req;
		this.state = state;
		this.resp =  resp;
		this.message = state.message;
	}
	
	CommandError.prototype = Object.create(Error.prototype);
	CommandError.prototype.name = CommandError.name;
	CommandError.prototype.constructor = CommandError;

	
	return {
		exec: exec,
		Error: CommandError,
	};
	
	
	function exec(source) {  
		var cmds = []; var cmd;
		var stack = new Error("Command execution error").stack;
		return new Promise(function(resolve, reject) {
			
			function mkErr(msg) {
				var err = new CommandError({message: msg}, null, null);
				err.stack = stack;
				return reject(err);
			}
			
			var i;
			for (i=0; i<source.length; i++) {
				cmd = source[i];
				if (Object.prototype.toString.call(cmd) == '[object Array]') 
					cmds = cmds.concat(cmd);
				else 
					cmds.push(cmd);
			}
			
			var items = [];
			var resActions = [];
			var resAction;
			for (i=0; i<cmds.length; i++) {
				cmd = cmds[i];
				var item = cmd;
				resAction = {};
				resActions.push(resAction);
				if (typeof(cmd.retKey) != 'undefined') {
					item = cmd.cmd; 
					if(typeof(item) == 'undefined')
						return mkErr('No cmd def in return wrapper');
					resAction.retKey = cmd.retKey;
				}
				resAction.cb = item.cb;
				if (typeof(item.def) == 'undefined') return mkErr('No command def')
				items.push(item.def);
			}
			
			var req = JSON.stringify(items);
			
			$.ajax({
				async: true,
				type: "POST",
				url: "data/cmd",
				data: req,
				contentType: "application/json; charset=UTF-8",
			 	dataType: "text",
				success: function(data) {
					var res = {};
					var started = 0; // 0 - not started, 1- non-empty passes, 2 - empty passes
					var r = JSON.parse(data);
					for(var i = 0;i<r.length; i++) {
						var it = r[i];
						var cb = resActions[i].cb;
						if (typeof(cb) != 'undefined') 
							it = cb(it);
						var retKey = resActions[i].retKey;
						if (typeof(retKey) != 'undefined') {
							if (retKey == "") {
								if (started != 0) return mkErr("Empty retKey must be alone");
								res = it;
								started = 2;
							} else {
								if (started == 2) return mkErr("Empty retKey must be alone");
								res[retKey] = it;
								started = 1;
							}
						}
					}
					return resolve(res);
				},
				error: function(x, st, e) {
					var err;
					var ct = x.getResponseHeader("content-type") || '';
					if (ct.indexOf('json') > -1) {
						var r = JSON.parse(x.responseText);
						err = new CommandError(r, req);
						err.stack = stack;
						return reject(err);
					} else {
						err = new AJAX.HttpError(x);
						err.stack = stack;
						return reject(err);
					}
				}
			});
		});
	}
});




	

