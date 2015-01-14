app.controller("registerController", 
	[  "$state", "$ionicPopup", "restAPI", "globals", "$translate","$ionicViewService",
	function( $state, $ionicPopup, restAPI, globals, $translate,$ionicViewService) {
		
	//VARIABLES	
	var emailError = false;
	var passwordError = false;
	var user = {};
	
	
	//INIT
	globals.removeTripID();
	
	//clear history
	$ionicViewService.clearHistory();
	//disables software back button
	$ionicViewService.nextViewOptions({
		   disableBack: true
		});


	//EmailError; set to True if Error occured
	this.hasEmailError = function () {
		return emailError;
	}
	
	//checks if email is entered correctly
	this.emailChange = function () {
		//simple email validation
		var re = /\S+@\S+\.\S+/;  //regularexpression string@sting.string
		if (!re.test(this.loginData.email)){
			emailError = true;
		}	
		else{
			emailError = false;
		}
	}
	
	//Password Error; set to true if Error occured
	this.hasPasswordError = function () {
		return passwordError;
	}
	
	//checks if both passwords are identical
	this.passwordChange = function () {

		if(this.loginData.password !== this.loginData.password2){
			//password validation
			passwordError=true;
		}
		else{
			passwordError = false;
		}
	}
	
	//register new user
	this.register = function (){	
		user = {
				email : this.loginData.email,
				username : this.loginData.username,
				password : this.loginData.password,
				name: this.loginData.name,
				phone: this.loginData.phone
		};
		//test if phone number is given
		if(this.loginData.phone != ""){
			sendRegistration();
		}
		else{
			//if no phine number is given, then a confirmaion popup with a warning should be shown
			$translate(['REGISTER.CONFIRM_REGISTER_TITLE', 'REGISTER.CONFIRM_REGISTER_TEXT', 'REGISTER.CHANGE_PHONE', 'REGISTER.REGISTER_WITHOUT_PHONE']).then(function(translations){
				var confirmPopup = $ionicPopup.confirm({
				     title: translations['REGISTER.CONFIRM_REGISTER_TITLE'],
				     template: translations['REGISTER.CONFIRM_REGISTER_TEXT'],
				     okText: translations['REGISTER.CHANGE_PHONE'],
				     cancelText: translations['REGISTER.REGISTER_WITHOUT_PHONE']
				   });
				   confirmPopup.then(function(res) {
				     if(res) {
				    	 // logout
				    	 console.log("Register canceled")
				     } else {
				    	  console.log("Registering...");
				    	  sendRegistration();
				     
				     }
				   });
			});
			
			
		}
			
		
	}
	
	//sends the actualregistration to the backend
	var sendRegistration = function () {
		if (!passwordError && !emailError) {
			//call rest api
			restAPI.user.create({user: user}, function(user) {
				globals.setUser(user);
				$state.go("app.tripList");
			}, function(data, status) {
				$translate(['REGISTER.ERROR_TITLE', 'REGISTER.ERROR_MESSAGE', 'REGISTER.ERROR_SERVER_MESSAGE', 'REGISTER.ERROR_INPUT_MESSAGE','REGISTER.ERROR_ALREADY_EXISTS_MESSAGE']).then(function(translations){
					var message;
					if(!status){
						//default error
						message = translations['REGISTER.ERROR_MESSAGE']
					}
					else if (status == 500){
						//server error
						message = translations['REGISTER.ERROR_SERVER_MESSAGE']
					}
					else if (status == 400){
						//wrong input error
						message = translations['REGISTER.ERROR_INPUT_MESSAGE']
					}			
					else if (status == 403){
						//user already exists errror
						message = translations['REGISTER.ERROR_ALREADY_EXISTS_MESSAGE']
					}
					var alertPopup = $ionicPopup.alert({
						title: translations['REGISTER.ERROR_TITLE'],
						template: message
					});
				});	
			});
		}
	}
	
	//navigation
	this.navToLoginView = function () {
		$state.go('app.login');
	}
	
	//disables/enables register button
	//only should be enabled if email is correctly formatted & passwords are identical and username/name is given
	this.verifyRegisterButton = function () {
		//verify if registerButton should be enabled
		var email = this.loginData.email;
		var username = this.loginData.username;
		var name = this.loginData.name;
		var password = this.loginData.password;
		var password2 = this.loginData.password2;
		return !!email && !!username && !!name && !!password && !!password2 && !emailError&& !passwordError;
		//return true for enabled
	}
}]);