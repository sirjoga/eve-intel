define(['bluebird', 'command'], function(Promise, CMD) {
	var MODULE = {
		messages: {
			title: 'Error',
			techInfo: 'Developer details',
			message: 'Message',
			stack: 'Call stack',
			clientStack: 'JS stack',
			request: 'Request',
			response: 'Response',
			close: 'Close'
		},
		patchMessages: function(source) {
			var prop;
			for (prop in source) if (source.hasOwnProperty(prop)) {
				MODULE.messages[prop] = source[prop];
			}
		},
		cFunc: function(e) {
			return MODULE.handle(e);
		},
		handle: function(err, parent) {
			var errTxt = err;
			if (err instanceof Error) errTxt = err.message;
			return new Promise(function(resolve, reject){
				var d;
				var opt = {
					closed: true,
					width: '400px',
					height: '150px',
					title: MODULE.messages.title,
					inline: true,
					onClose: function() {
						d.dialog('destroy').remove(); 
						return resolve(); 
					}
				};
				
				if (typeof(parent) == 'undefined' || parent == null) {
					parent = $('body');
					opt.inline = false;
				} else {
					opt.inline = true;
				}
				d = $('<div><div data-pname="pnl"></div></div>').appendTo(parent);
				d.find('[data-pname="pnl"]').panel({
					border: false,
					fit: true,
					content: ' \
						<div class="easyui-layout" data-options="fit:true,border:false" data-pname="l"> \
							<div data-options="region:\'south\',height:38,border:false" style="padding:5px;overflow:hidden;"> \
							<span style="float:right;" data-pname="btns"></span> \
							</div> \
							<div data-options="region:\'center\',border:false"> \
								<div style="padding:5px;"> \
									<div class="messager-icon messager-error"></div><div data-pname="msg" data-options="fit:true"></div> \
								</div> \
							</div> \
						</div> \
					' 
				});
				var b = d.find('[data-pname="btns"]');

				d.dialog(opt);
				var m = d.find('[data-pname="msg"]');
				var bTech = $('<a>' + MODULE.messages.techInfo + '</a>').appendTo(b);
				bTech.linkbutton({
					onClick: function() {
						d.dialog("resize", {width: 750, height: 500});
						var p = d.find('[data-pname="l"]').layout("panel", "center");
						p.panel({
							content: ' \
								<div class="easyui-tabs" data-pname="t" data-options="plain:true,pill:true,fit:true,border:false"> \
									<div title="' + MODULE.messages.message + '"><div style="padding:5px;" data-pname="tMsg"></div></div> \
								</div>'
						});
						p.find('[data-pname="tMsg"]').text(errTxt);
						if (err instanceof CMD.Error) (function() {
							var t = p.find('[data-pname="t"]');
							var st = err.state.trace;
							var tab;
							if (typeof(st) != 'undefined' && st != '') {
								t.tabs('add', {
									title: MODULE.messages.stack,
									selected: false,
								});
								tab = t.tabs('getTab', MODULE.messages.stack);  
								tab.css({padding: "5px"});
								$('<pre><div data-pname="tx"></div></pre>').appendTo(tab);
								tab.find('[data-pname="tx"]').text(st);
							}
							var req = err.req;
							if (typeof(req) != 'undefined' && req != '') {
								t.tabs('add', {
									title: MODULE.messages.request,
									selected: false,
								});
								tab = t.tabs('getTab', MODULE.messages.request);  
								tab.css({padding: "5px"});
								$('<pre><div data-pname="tx"></div></pre>').appendTo(tab);
								tab.find('[data-pname="tx"]').text(req);
							}
							var resp = err.resp;
							if (typeof(resp) != 'undefined' && resp != '') {
								t.tabs('add', {
									title: MODULE.messages.response,
									selected: false,
								});
								tab = t.tabs('getTab', MODULE.messages.response);  
								tab.css({padding: "5px"});
								$('<pre><div data-pname="tx"></div></pre>').appendTo(tab);
								tab.find('[data-pname="tx"]').text(resp);
							}
						})();

						if (err instanceof Error) (function() {
							var t = p.find('[data-pname="t"]');
							var st = err.stack;
							var tab;
							if (typeof(st) != 'undefined' && st != '') {
								t.tabs('add', {
									title: MODULE.messages.clientStack,
									selected: false,
								});
								tab = t.tabs('getTab', MODULE.messages.clientStack);  
								tab.css({padding: "5px"});
								$('<pre><div data-pname="tx"></div></pre>').appendTo(tab);
								tab.find('[data-pname="tx"]').text(st);
							}
						})();
						
						d.dialog('center');
						bTech.remove();
					}
				});
				$('<a style="margin-left:5px;">' +  MODULE.messages.close + '</a>').appendTo(b).linkbutton({
					onClick: function() {
						d.dialog('close');
					}
				});
				m.text(errTxt);
				d.dialog('center');
				d.dialog('open');
			});
		}
	};
	return MODULE;
});