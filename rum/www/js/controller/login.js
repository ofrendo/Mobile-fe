app.controller("loginController", 
	[ "$state", "loginService", "$ionicPopup", "globals", "$translate","$ionicViewService",
	function(  $state, loginService, $ionicPopup, globals, $translate, $ionicViewService) {
		
		
	//INIT
	console.log("----INIT loginController----")
	globals.removeTripID();
	//clear history
	$ionicViewService.clearHistory();
	//disables (software) back button after login
	$ionicViewService.nextViewOptions({
		   disableBack: true
		});
	
	//FUNCTIONS
	
	this.login = function () {
		//get username+pw from view
		var username = this.loginData.username;
		var password = this.loginData.password;
		//try login
		loginService.login(username, password, function(user) {
			$state.go("app.tripList");
		}, function(data, status) {
			$translate(['LOGIN.ERROR_OCCURRED', 'LOGIN.ERROR_LOGIN', 'LOGIN.ERROR_TITLE']).then(function(translations){
				var message;
				if(!status){
					message = translations['LOGIN.ERROR_OCCURRED']
				}
				else if (status == 400){
					message = translations["LOGIN.ERROR_LOGIN"]
				}
				var alertPopup = $ionicPopup.alert({
					title: translations['LOGIN.ERROR_TITLE'],
					template: message
				});
			});
		});
	}
	
	//Navigation to register
	this.navToRegisterView = function () {
		$state.go('app.register');
	}
	
	//verfies if the loginbutton should be shown
	//disable if error
	this.verifyLoginButton = function () {
		//verify if loginButton should be enabled
		var username = this.loginData.username;
		var password = this.loginData.password;
		return !!username && !!password;
		//return true for enabled
	}

}]);