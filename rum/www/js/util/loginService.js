app.service("loginService", ["$state", "restAPI", "globals", function($state, restAPI, globals) {

	//Tries to log the user in. If there is still a session available that will be used, 
	//else user will be redirected to login page
	this.login = function(username, password, successFn, errorFn) {
		var data = {};
		if (username) data.username = username;
		if (password) data.password = password;
		console.log(restAPI);
		restAPI.auth.login(data, function(data) {
			console.log("User " + data.username + " logged in with ID " + data.user_id);
			globals.setUser(data);
			if (typeof(successFn) == "function") successFn(data);
		}, errorFn);
	}

	this.logout = function(successFn, errorFn) {
		restAPI.auth.logout(function() {
			delete globals["user"];
			if (typeof(successFn) == "function") successFn();
		}, errorFn);
	}

	this.tryLogin = function(successFn, errorFn) {
		this.login(null, null, successFn, errorFn);
	};

	this.isLoggedIn = function() {
		return !!globals.user;
	
	};

	//If logged in, do callback
	//If not logged in, try logging in with no data - will be succesful if session still there, then do callback
	//else go to login page
	this.onInit = function(callback) {
		if (this.isLoggedIn() === true) {
			if (typeof(callback) === "function") callback();
		}
		else {
			this.tryLogin(callback, function(data, status) {
				$state.go("app.login");
			});
		}
	};

}]);