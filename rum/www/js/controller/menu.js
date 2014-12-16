app.controller("menuController", 
	["$scope", "globals", "$ionicPopup", "$state", "restAPI",
	function($scope, globals, $ionicPopup, $state, restAPI){
	

	$scope.checkRight = function(){
		//check if chat is supposed to be shown
		return !!globals.trip_id && globals.trip_id >= 0;
	};
	
	$scope.checkLeft = function(){
		//check if menu on left is supposed to be shown
		return true;
	};
	
	this.logout = function(){
		console.log("Dialog open");
		   var confirmPopup = $ionicPopup.confirm({
		     title: 'Logout',
		     template: 'Wollen Sie sich wirklich ausloggen?',
		     cancelText: 'Abbrechen',
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
		 

	};
	
	
}]);