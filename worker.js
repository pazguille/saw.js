importScripts("saw.js");

onmessage = function(event) {
	saw.json("ajax.json")
		.success(function (data) {
			postMessage(data);
		})
		.failure(function (data) {
			postMessage(data);
		})
		.send();


	saw.jsonp("http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=sawp")
		.success(function (data) {
			postMessage(data);
		})
		.failure(function (data) {
			postMessage(data);
		})
		.send();
};