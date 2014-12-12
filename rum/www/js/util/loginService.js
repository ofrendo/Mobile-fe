app.service("loginService", ["restAPI", "globals", function(restAPI, globals) {

	//Tries to log the user in. If there is still a session available that will be used, 
	//else user will be redirected to login page
	this.login = function(username, password, successFn, errorFn) {
		var data = {};
		if (username) data.username = username;
		if (password) data.password = password;

		restAPI.auth.login(data, function(data) {
			console.log("User " + data.username + " logged in with ID " + data.user_id);
			globals.user = data;
			if (typeof(successFn) == "function") successFn(data);
		}, errorFn);
	}

	this.tryLogin = function(successFn, errorFn) {
		this.login(null, null, successFn, errorFn);
	};

	this.isLoggedIn = function() {
		return !!globals.user;
	}

}]);