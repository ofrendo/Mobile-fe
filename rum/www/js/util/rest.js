app.service("restAPI", ["$http", function($http) {
	var module = this;
	var url = "https://thawing-stream-4939.herokuapp.com";

	module.auth = {};
	module.auth.login = function(username, password, callback, callbackError) {
		$http.post(url + "/auth/login", {
			username: username,
			password: password
		})
		.success(callback)
		.error(callbackError);
	};

	module.user = {};
	module.user.create = function(user) {

	}
}]);