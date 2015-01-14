app.controller("editLocationController", 
	["$scope",  "$state",  "loginService", "globals", "$stateParams", "restAPI",  "utils",
	function($scope,  $state,  loginService, globals, $stateParams, restAPI, utils) {
	
	//VARIABLES	
	var me = this;
		
	//INIT
	console.log("---INIT editCityController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	//FUNCTIONS
	this.getLocationData = function(){
		console.log('Getting location data...');
	}
	
	this.saveLocation = function(){
		console.log('Saving location...');
	}
	
	
}]);