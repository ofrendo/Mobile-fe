app.controller("loginController", ["$scope", "$timeout", "$state", "loginService", function($scope, $timeout, $state, loginService) {
	console.log("----INIT loginController----")
	
	
	this.login = function () {
		var username = this.loginData.username;
		var password = this.loginData.password;
		loginService.login(username, password, function(user) {
			$state.go("app.tripList");
		}, function(data, status) {
			console.log("User could not be logged in:" + status);
		});
	}
	
	this.navToRegisterView = function () {
		$state.go('app.register');
	}
	
	this.verifyLoginButton = function () {
		//verify if loginButton should be enabled
		var username = this.loginData.username;
		var password = this.loginData.password;
		return !!username && !!password;
		//return true for enabled
	}

}]);