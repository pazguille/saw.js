importScripts("saw.js");

onmessage = function(event) {

	saw.json("ajaxa.json")
		.success(function (data) {
			postMessage(data);
		})
		.failure(function (data) {
			postMessage(data);
		})
		.send();

};