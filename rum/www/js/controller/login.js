app.controller("loginController", ["$scope", "$timeout", "$state", function($scope, $timeout, $state) {
	$scope.title = "Hallo Olli";
	
	this.login = function () {
		console.log("Logge ein mit " +
				" Username: " + $scope.loginData.username+
				" Password: " + $scope.loginData.password
				);
	}
	
	this.navToRegisterView = function () {
		// to be done
	}

}]);