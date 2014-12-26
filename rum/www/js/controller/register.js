app.controller("registerController", 
	[ "$timeout", "$state", "$ionicPopup", "restAPI", "globals", "loginService", "$translate",
	function($timeout, $state, $ionicPopup, restAPI, globals, loginService, $translate) {
	
	globals.removeTripID();

	//EmailError; set to True if Error occured
	var emailError = false;
	
	this.hasEmailError = function () {
		return emailError;
	}
	
	this.emailChange = function () {
		//if user enters input the Error-marker should go away
		emailError = false;
	}
	
	//Password Error; set to true if Error occured
	var passwordError = false;
	
	this.hasPasswordError = function () {
		return passwordError;
	}
	
	this.passwordChange = function () {
		//if user enters input the Error-marker should go away
		passwordError = false;
	}
	
	this.register = function () {
		//build JSON for rest call
		var user = {
				email : this.loginData.email,
				username : this.loginData.username,
				password : this.loginData.password,
				name: this.loginData.name
		};
		//simple email validation
		var re = /\S+@\S+\.\S+/;  //regularexpression string@sting.string
		if (!re.test(user.email)){
			emailError = true;
		}	
		if(user.password !== this.loginData.password2){
			//password validation
			passwordError=true;
		}
		if (!passwordError && !emailError) {
			//call rest api
			restAPI.user.create({user: user}, function(user) {
				globals.setUser(user);
				$state.go("app.tripList");
			}, function(data, status) {
				$translate(['REGISTER.ERROR_TITLE', 'REGISTER.ERROR_MESSAGE', 'REGISTER.ERROR_SERVER_MESSAGE', 'REGISTER.ERROR_INPUT_MESSAGE']).then(function(translations){
					var message;
					if(!status){
						message = translations['REGISTER.ERROR_MESSAGE']
					}
					else if (status == 500){
						message = translations['REGISTER.ERROR_SERVER_MESSAGE']
					}
					else if (status == 400){
						message = translations['REGISTER.ERROR_INPUT_MESSAGE']
					}					
					var alertPopup = $ionicPopup.alert({
						title: translations['REGISTER.ERROR_TITLE'],
						template: message
					});
				});	
			});
		}
	}
	
	this.navToLoginView = function () {
		$state.go('app.login');
	}
	
	this.verifyRegisterButton = function () {
		//verify if registerButton should be enabled
		var email = this.loginData.email;
		var username = this.loginData.username;
		var name = this.loginData.name;
		var password = this.loginData.password;
		var password2 = this.loginData.password2;
		return !!email && !!username && !!name && !!password && !!password2;
		//return true for enabled
	}
}]);