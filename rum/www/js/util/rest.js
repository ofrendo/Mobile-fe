app.service("restAPI", ["$http", function($http) {
	var module = this;
	var url = "https://thawing-stream-4939.herokuapp.com";
	//var url = "http://localhost:5000";

	var routes = [
		new Route("/auth/login", "post"),
		new Route("/auth/logout", "post"),
		new Route("/user", "post", "create"),
		new Route("/user/:user_id", "get", "read"),
		new Route("/user/:user_id", "put", "update"),
		new Route("/user/:user_id", "delete", "delete"),
		new Route("/user/:user_id/trips", "get", "readTrips"),
		new Route("/trip", "post", "create"),
		new Route("/trip/:trip_id", "get", "read"),
		new Route("/trip/:trip_id", "put", "update"),
		new Route("/trip/:trip_id", "delete", "delete"),
		new Route("/trip/:trip_id/city", "post", "create"),
		new Route("/trip/:trip_id/city/:city_id", "get", "read"),
		new Route("/trip/:trip_id/city/:city_id", "put", "update"),
		new Route("/trip/:trip_id/city/:city_id", "delete", "delete"),
		new Route("/trip/:trip_id/city/:city_id/location", "post", "create"),
		new Route("/trip/:trip_id/city/:city_id/location/:location_id", "get", "read"),
		new Route("/trip/:trip_id/city/:city_id/location/:location_id", "put", "update"),
		new Route("/trip/:trip_id/city/:city_id/location/:location_id", "delete", "delete")
	];

	for (var i = 0; i < routes.length; i++) {
		var parent = module;
		var parts = routes[i].path.split("/");
		for (var j = 1; j < parts.length; j++) { //first part slash is empty

			var part = parts[j];
			if ((j !== parts.length-1 || parts.length === 2) && part.indexOf(":") === -1) { //Build up empty object (namespace), such as module.auth
				if (!parent[part]) {
					parent[part] = {};
				}
				parent = parent[part];
			}
			
			if (j === parts.length-1) { //last one will be the function itself
				var functionName = routes[i].functionName || part;

				//Is able to be called like this
				//restAPI.user.create(data, fn, fn);
				//restAPI.user.get(user_id, fn, fn);
				//restAPI.user.update(user_id, data, fn, fn); 
				//restAPI.user.delete(user_id, fn, fn);
				//restAPI.xyz.zyx.update(x_id, y_id, data, fn, fn);
				parent[functionName] = (function(route) {
					return function() {
						//First check if two functions were passed
						var l = arguments.length;
						var errorFn;
						var successFn;
						var nextAfterFunctionIndex;
						if (typeof(arguments[l-2]) == "function") {
							errorFn = arguments[l-1];
							successFn = arguments[l-2];
							nextAfterFunctionIndex = l-3;
						}
						else {
							successFn = arguments[l-1];
							nextAfterFunctionIndex = l-2;
						}

						//Replace any parameters in path with integers if needed
						var argumentsIndex = 0;
						var finishedPath = "";
						var pathParts = route.path.split("/");
						for (var k = 1; k < pathParts.length; k++) {
							if (pathParts[k].indexOf(":") !== -1) {
								finishedPath += "/" + arguments[argumentsIndex];
								argumentsIndex++;
							}
							else {
								finishedPath += "/" + pathParts[k];
							}
						}
						var data = (argumentsIndex === nextAfterFunctionIndex) ? arguments[argumentsIndex] : {};
						console.log("Calling " + finishedPath + " with data:");
						console.log(data);
						var request = $http[route.method](url + finishedPath, data)
						.success(successFn);

						if (typeof(errorFn) == "function") {
							request.error(errorFn);
						}
					};
				})(routes[i]);
			}


		}
	}
}]);

function Route(path, method, functionName) {
	this.path = path;
	this.method = method;
	this.functionName = functionName;
}