app.controller("editCityController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", "$stateParams", "restAPI",
	function($scope, $http, $state, $ionicPopup, loginService, globals, $stateParams, restAPI) {
	
	this.title = '';
		
	console.log("---INIT editCityController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	this.getCityData = function(){
		console.log('INIT getCityData with id = ' + $stateParams.city_id);
	}
}]);