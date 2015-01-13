app.controller("menuController", 
	["$scope", "globals", "$ionicPopup", "$state", "restAPI", "$translate","$ionicPlatform", "$ionicViewService","$ionicNavBarDelegate","$stateParams","loginService", "$ionicActionSheet",
	function($scope, globals, $ionicPopup, $state, restAPI, $translate,$ionicPlatform, $ionicViewService, $ionicNavBarDelegate,$stateParams,loginService, $ionicActionSheet){
	
	console.log("----INIT menuController----");
	var me = this;

	//disable hardware back button
	$ionicPlatform.onHardwareBackButton(function (event){
		//if history is less then 1 the back-button should not work, because the last entry is the login/register-Page
		if($ionicViewService._getHistory().cursor <= 1){
			event.stopPropagation();
		}
		else{
			//else do back
			 $ionicNavBarDelegate.back();
		}
	});	
		
		
	$scope.checkRight = function(){
		//check if chat is supposed to be shown
		return !!globals.trip_id && globals.trip_id >= 0;
	};
	
	$scope.checkLeft = function(){
		//check if menu on left is supposed to be shown
		return loginService.isLoggedIn();
	};
	
	$scope.checkListOptions = function(){
		// check if list options should be available
		return loginService.isLoggedIn();
	}
	
	//check if menu button should be shown
	$scope.checkMenuButton = function (){
		if($ionicViewService.getBackView() !== null){
			//show no menu button if back button is shown
			return false;
		}
		else {
			return true;
		}
	}
	
	$scope.openListOptionsDropdown = function(){
		// translate texts
		$translate(['MENU.EXPORT','MENU.REORDER', 'MENU.CANCEL']).then(function(translations){
			//open actionSheet 
			//check witch view is open
			//if tripList is open show only Reorder Button
			console.log($scope.showReordering);
			console.log($scope.locationListCtrl);
			if ($stateParams.trip_id) {
				var ButtonList = [
				                  {text: translations['MENU.REORDER']},
				                  {text: translations['MENU.EXPORT']}
				                  ]
			}else{
				var ButtonList = [
				                  {text: translations['MENU.REORDER']}
				                  ]
			}
			$ionicActionSheet.show({

			     buttons: ButtonList,
				
			     cancelText: translations['MENU.CANCEL'],
			     cancel: function() {
			          // add cancel code..
			        },
			     buttonClicked: function(index) {
			    	 switch (index) {
					case 0:
						me.reorder();
						break;
					case 1:
						me.navToExport();
						break;
					default:
						break;
					}
			       return true;
			     }
			   });
		});
	}
	
	this.navToSettings = function(){
		$state.go('app.settings');
	}
	this.navToExport = function(){
		//check if trip_id is given
		if($stateParams.trip_id < 0 || $stateParams.trip_id === undefined){
			//show alert
			$translate([ 'EXPORT.ERROR_TRIP_ID', 'EXPORT.ERROR_TITLE']).then(function(translations){
				var message;
				var alertPopup = $ionicPopup.alert({
					title: translations['EXPORT.ERROR_TITLE'],
					template: translations['EXPORT.ERROR_TRIP_ID']
				});
			})
		}
		else{
			//go to export
			$state.go('app.export', { trip_id : $stateParams.trip_id } );
		}
		
	}
	this.navToTripList = function(){
		$state.go('app.tripList');
	}
	
	this.reorder = function(){
		globals.callReorderCallback();
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