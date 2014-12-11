app.controller("registerController", ["$scope", "$timeout", "$state", function($scope, $timeout, $state) {

	
	this.register = function () {
		
		//build JSON for rest call
		var user = {
				email : $scope.loginData.email,
				username : $scope.loginData.username,
				password : $scope.loginData.password
		}
		
		//simple email validation
		var re = /\S+@\S+\.\S+/;  //regularexpression string@sting.string
		if (!re.test(user.email))
		{
			console.log("Falsche email");
		}	
		//password validation
		if(user.password !== $scope.loginData.password2)
		{
			console.log("Falsches passwort");
		}
		
	}
	
	this.navToLoginView = function () {
		$state.go('app.login');
	}

}]);