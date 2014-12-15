app.service("backListener", function() {
	this.listen = function(callback) {
		document.addEventListener("backbutton", function() {
			if (typeof(callback) == "function") callback();
			document.removeEventListener("backbutton", callback);
		}
	};


	this.listen(function() {
		
	});
});