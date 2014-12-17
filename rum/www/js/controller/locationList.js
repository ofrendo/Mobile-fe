app.controller("locationListController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", 
	function($scope, $http, $state, $ionicPopup, loginService, globals) {
	
	console.log("---INIT locationListController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});

}]);