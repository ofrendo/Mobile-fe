app.controller("loginController", ["$scope", "$timeout", "$state", "loginService", function($scope, $timeout, $state, loginService) {
	console.log("----INIT loginController----")
	$scope.title = "Bitte einloggen:";
	
	this.login = function () {
		var username = $scope.loginData.username;
		var password = $scope.loginData.password;
		loginService.login(username, password, function(user) {
			$state.go("app.tripList");
		}, function(data, status) {
			console.log("User could not be logged in:" + status);
		});
	}
	
	this.navToRegisterView = function () {
		$state.go('app.register');
	}

}]);