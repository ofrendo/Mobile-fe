app.controller("loginController", ["$scope", "$timeout", "$state", "restAPI", function($scope, $timeout, $state, restAPI) {
	$scope.title = "Bitte einloggen:";
	
	this.login = function () {
		console.log("Logge ein mit " +
				" Username: " + $scope.loginData.username+
				" Password: " + $scope.loginData.password
				);
		console.log(restAPI);
		var username = $scope.loginData.username;
		var password = $scope.loginData.password;
		restAPI.auth.login(username, password, function(data) {
			console.log("User " + username + " logged in with ID " + data.user_id);
		}, function(data, status) {
			console.log("User could not be logged in.");
		});

	}
	
	this.navToRegisterView = function () {
		$state.go('app.register');
	}

}]);