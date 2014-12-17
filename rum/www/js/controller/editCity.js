app.controller("editCityController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", 
	function($scope, $http, $state, $ionicPopup, loginService, globals) {
	
	console.log("---INIT editCityController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
}]);