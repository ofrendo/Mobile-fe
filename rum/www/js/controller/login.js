app.controller("loginController", 
	[ "$state", "loginService", "$ionicPopup", "globals", "$translate","$ionicViewService","$ionicPlatform" ,
	function(  $state, loginService, $ionicPopup, globals, $translate, $ionicViewService,$ionicPlatform) {
		
		
	
	console.log("----INIT loginController----")
	globals.removeTripID();
	
	//disables back button after navigation
	$ionicViewService.clearHistory();
	$ionicViewService.nextViewOptions({
		   disableBack: true
		});
	$ionicPlatform.onHardwareBackButton(function (event){
		event.preventDefault();
		 event.stopPropagation();
		alert("back");
	});
	
	this.login = function () {
		var username = this.loginData.username;
		var password = this.loginData.password;
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