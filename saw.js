/*
* Simple Ajax for Web Workers v0.1
*/
var workerScope = this,
saw = (function () {
	var Ajax = function (conf) {
		var that = this,
			conf = conf || {},
			methods = {
				"header": function (key, value) {
					conf.headers[key] = value;
	
					return methods;
				},
				"data": function (data) {
					conf.data = data;
		
					return methods;
				},
				"async": function (value) {
					conf.async = value;
					
					return methods;
				},
				"cache": function (value) {
					conf.cache = value;
					
					return methods;
				},
				"success": function (handler) {
					conf.success = handler;

					return methods;
				},
				"failure": function (handler) {
					conf.failure = handler;
		
					return methods;
				},
				"responseType": function (value) {
					conf.responseType = value;
	
					return methods;
				},
				"send": function () {
					var xhr = that.xhr;

					if (conf.jsonp) {
						that.setJSONP(conf.url, conf.success);

						return;
					}

					xhr.onreadystatechange = function () {
						that.stateChange(conf);
					};

					xhr.open(conf.method, conf.url, conf.async);
					that.setHeaders(conf.headers);
					xhr.responseType = conf.responseType;
					xhr.send(conf.data);

					return xhr;
				}
			};

		// Configuration
		conf.headers = conf.headers || {};
		conf.headers["Accept"] = "text/javascript, application/json, text/html, application/xml, text/xml, */*";
		conf.headers["Cache-Control"] = "cache";
		conf.headers["Content-Type"] = "application/x-www-form-urlencoded";
		conf.responseType = ""; //"text", "arraybuffer", "blob", or "document"
		conf.cache = true;
		conf.async = true;

		// XMLHttpRequest obj
		this.xhr = new XMLHttpRequest();

		return methods;
	};

	Ajax.prototype.setJSONP = function (url, handler) {
		var that = this;
		var callback = "_jsonp" + parseInt(new Date().getTime());

		workerScope[callback] = function (data, status) {
			workerScope[callback] = undefined;
			workerScope[callback] = null;

			return handler(data, status);
		};

		importScripts(url.replace("sawp", callback));
	};
	
	Ajax.prototype.stateChange = function (conf) {
		var xhr = this.xhr;
		 if (xhr.readyState == 4 ) {
			var response = xhr.response || xhr.responseText;

		 	if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && response)) {
				if (conf.hasOwnProperty("success")) {
					response = (conf.json) ? JSON.parse(response) : response;
		 			conf.success(response, xhr.status);
			 	}
		 	} else {
			 	if (conf.hasOwnProperty("failure")) {

			 		var data = {
			 			"response": xhr.responseText,
			 			"status": xhr.status,
			 			"statusText": xhr.statusText
			 		}

			 		conf.failure(data);
			 	}
			}

		 }
	};

	Ajax.prototype.setHeaders = function (headers) {
		for (var key in headers) {
			this.xhr.setRequestHeader(key, headers[key]);
		};
	};

	var core = {

		"get": function (url) {
			var cnx = new Ajax({
				"method": "get",
				"url": url
			});

			return cnx;
		},
		"post": function (url) {
			var cnx = new Ajax({
				"method": "post",
				"url": url
			});

			return cnx;
		},
		"json": function (url) {
			var cnx = new Ajax({
				"method": "get",
				"url": url,
				"headers": {
					"Content-Type": "application/json"
				},
				"json": true
			});

			return cnx;
		},
		"jsonp": function (url) {			
			var cnx = new Ajax({
				"method": "get",
				"url": url,
				"headers": {
					"Content-Type": "application/json"
				},
				"jsonp": true
			});

			return cnx;
		}
	};

    return core;

}());