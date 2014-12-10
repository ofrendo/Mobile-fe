app.controller("loginController", ["$scope", "$timeout", "$state", "restAPI", function($scope, $timeout, $state, restAPI) {
	$scope.title = "Bitte einloggen:";
	
	this.login = function () {
		console.log(restAPI);
		var username = $scope.loginData.username;
		var password = $scope.loginData.password;
		var data = {
			username: username,
			password: password
		};
		restAPI.auth.login(data, function(data) {
			console.log("User " + username + " logged in with ID " + data.user_id);
		}, function(data, status) {
			console.log("User could not be logged in.");
		});

	}
	
	this.navToRegisterView = function () {
		$state.go('app.register');
	}

}]);