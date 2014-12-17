app.controller("loginController", 
	[ "$state", "loginService", "$ionicPopup", "globals", 
	function(  $state, loginService, $ionicPopup, globals) {
	
	console.log("----INIT loginController----")
	globals.removeTripID();
	
	this.login = function () {
		var username = this.loginData.username;
		var password = this.loginData.password;
		loginService.login(username, password, function(user) {
			$state.go("app.tripList");
		}, function(data, status) {
			var message;
			if(!status){
				message = "Ein Error ist aufgetreten."
			}
			else if (status == 400){
				message = "Ein Error beim Login ist aufgetreten."
			}

			
			
			   var alertPopup = $ionicPopup.alert({
			     title: 'Error',
			     template: message
			   });
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