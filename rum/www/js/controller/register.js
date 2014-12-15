app.controller("registerController", 
	["$scope", "$timeout", "$state", "restAPI", "globals",
	 function($scope, $timeout, $state, restAPI, globals) {

	
	this.register = function () {
		
		//build JSON for rest call
		var user = {
				email : $scope.loginData.email,
				username : $scope.loginData.username,
				password : $scope.loginData.password,
				name: $scope.loginData.name
		};
		
		//simple email validation
		var re = /\S+@\S+\.\S+/;  //regularexpression string@sting.string
		if (!re.test(user.email))
		{
			console.log("Falsche email");
		}	
		else if(user.password !== $scope.loginData.password2)
		{
			//password validation
			console.log("Falsches passwort");
		}
		else {
			restAPI.user.create({user: user}, function(user) {
				globals.user = user;
				$state.go("app.tripList");
			}, function(data, status) {
				console.log("Error registering user:");
				console.log(data);
				//Error, zb user already exists
			});
		}
	}
	
	this.navToLoginView = function () {
		$state.go('app.login');
	}
}]);