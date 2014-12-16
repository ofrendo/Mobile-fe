app.service("restAPI", ["$http", function($http) {
	console.log("----INIT restAPI----");
	var module = this;
	/*var url = (window.location.href.indexOf("localhost") === -1)
			  ? "https://thawing-stream-4939.herokuapp.com"
			  : "http://localhost:5000";*/
	//var url = "http://localhost:5000";
	var url = "https://thawing-stream-4939.herokuapp.com";

	var routes = [
		new Route("/auth/login", "post", null, true), //api.auth.login()
		new Route("/auth/logout", "post", null, true),
		new Route("/user", "post", "create"),
		new Route("/user/:user_id", "get", "read"),
		new Route("/user/:user_id", "put", "update"),
		new Route("/user/:user_id", "delete", "delete"),
		new Route("/user/:user_id/trips", "get", "readTrips", true), //api.user.readTrips()
		new Route("/trip", "post", "create"), //api.trip.create
		new Route("/trip/:trip_id", "get", "read"),
		new Route("/trip/:trip_id", "put", "update"),
		new Route("/trip/:trip_id", "delete", "delete"),
		new Route("/trip/:trip_id/users", "get", "readUsers", true),
		new Route("/trip/:trip_id/addUser", "put", "addUserToTrip", true), //api.trip.addUserToTrip(trip_id, {user: {user_id}})
		new Route("/trip/:trip_id/removeUser", "delete", "removeUserFromTrip", true), //api.trip.removeUserFromTrip(trip_id, {user: {user_id}})
		new Route("/trip/:trip_id/cities", "get", "readCities", true), //api.trip.readCities(trip_id)
		new Route("/trip/:trip_id/city", "post", "create"),
		new Route("/trip/:trip_id/city/:city_id", "get", "read"),
		new Route("/trip/:trip_id/city/:city_id", "put", "update"),
		new Route("/trip/:trip_id/city/:city_id", "delete", "delete"),
		new Route("/trip/:trip_id/city/:city_id/locations", "get", "readLocations", true), //api.trip.city.readLocations(trip_id, city_id)
		new Route("/trip/:trip_id/city/:city_id/location", "post", "create"),
		new Route("/trip/:trip_id/city/:city_id/location/:location_id", "get", "read"),
		new Route("/trip/:trip_id/city/:city_id/location/:location_id", "put", "update"),
		new Route("/trip/:trip_id/city/:city_id/location/:location_id", "delete", "delete")
	];

	for (var i = 0; i < routes.length; i++) { //for each route
		var parent = module;				  //reset parent
		var parts = routes[i].path.split("/"); //split path into parts divided by /
		for (var j = 1; j < parts.length; j++) { //first part slash is empty

			var part = parts[j];
			if (part.indexOf(":") === -1 && (j !== parts.length-1 || routes[i].lastPathIsFunction !== true)) { 
				//Build up empty object (namespace), such as module.auth IF
				//not a :object_id AND
				//there is specific function name defined (in all cases except login and logout) OR not at the end
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
							//if second to last argument is a function, there will be a successFn and errorFn
							errorFn = arguments[l-1];
							successFn = arguments[l-2];
							nextAfterFunctionIndex = l-3;
						}
						else {
							//Else there is only a successFn
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
						if (Object.keys(data).length === 0) {
							console.log("Calling " + route.method.toUpperCase() + " " + finishedPath);
						}
						else {
							console.log(data);
							console.log("Calling " + route.method.toUpperCase() + " " + finishedPath + " with data:");
						}

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
	console.log(module);
	window.restAPI = module;
}]);

function Route(path, method, functionName, lastPathIsFunction) {
	this.path = path;
	this.method = method;
	this.functionName = functionName;
	this.lastPathIsFunction = lastPathIsFunction;
}