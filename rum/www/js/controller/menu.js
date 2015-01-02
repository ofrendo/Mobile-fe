app.controller("menuController", 
	["$scope", "globals", "$ionicPopup", "$state", "restAPI", "$translate","$ionicPlatform", "$ionicViewService","$ionicNavBarDelegate",
	function($scope, globals, $ionicPopup, $state, restAPI, $translate,$ionicPlatform, $ionicViewService, $ionicNavBarDelegate){
	
		//disable hardware back button
		$ionicPlatform.onHardwareBackButton(function (event){
			if($ionicViewService._getHistory().cursor <= 1){
				event.stopPropagation();
			}
			else{
				 $ionicNavBarDelegate.back();
			}
		});	
		
		
	$scope.checkRight = function(){
		//check if chat is supposed to be shown
		return !!globals.trip_id && globals.trip_id >= 0;
	};
	
	//disable hardware back button
	$ionicPlatform.registerBackButtonAction(function (event) {
			event.preventDefault();
			console.log("back");
		}, 1000);
	
	$scope.checkLeft = function(){
		//check if menu on left is supposed to be shown
		return true;
	};
	
	this.navToSettings = function(){
		$state.go('app.settings');
	}
	
	this.navToTripList = function(){
		$state.go('app.tripList');
	}
	
	this.logout = function(){
		console.log("Logout Dialog open");
		$translate(['MENU.CONFIRM_LOGOUT_TITLE', 'MENU.CONFIRM_LOGOUT_TEXT', 'DIALOG.OK_BTN', 'DIALOG.CANCEL_BTN']).then(function(translations){
			var confirmPopup = $ionicPopup.confirm({
			     title: translations['MENU.CONFIRM_LOGOUT_TITLE'],
			     template: translations['MENU.CONFIRM_LOGOUT_TEXT'],
			     okText: translations['DIALOG.OK_BTN'],
			     cancelText: translations['DIALOG.CANCEL_BTN']
			   });
			   confirmPopup.then(function(res) {
			     if(res) {
			    	 // logout
			    	 restAPI.auth.logout(function() {
			    		 console.log("Logout success");
			    		 // nav to login-screen
				    	 $state.go('app.login');
			    	 });
			     } else {
			       console.log("Logout Canceled");
			     }
			   });
		});
	};
	
	
}]);