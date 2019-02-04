define(['bluebird'], function(Promise) {

	function HttpError(xhr) {
		this.xhr = xhr;
		if (xhr.readyState == 4) {
			this.message = "" + xhr.status + ": " + xhr.statusText;
		} else {
			this.message = "Network HTTP error";
		}
	}

	HttpError.prototype = Object.create(Error.prototype);
	HttpError.prototype.constructor = HttpError;
	
	var PL = {
		HttpError: HttpError,
		call: function(req) { 
			return new Promise(function(resolve, reject) {
				var cReq = {};
				Object.assign(cReq, req, {
					async: true,
					success: function(data) { resolve(data); },
					error: function(x, st, e) {
                        return reject(new HttpError(x));
					}
				});
				if (typeof(cReq.type) == 'undefined') cReq.type = 'GET';
				if (typeof(cReq.cache) == 'undefined') cReq.cache = false;
				$.ajax(cReq);
			});
		}
	};
	
	return PL;
});
