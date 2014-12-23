app.controller("addLocationController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", "$stateParams",
	function($scope, $http, $state, $ionicPopup, loginService, globals, $stateParams) {
	
	console.log("---INIT addLocationController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	this.getCityData = function(){
		console.log('INIT getCityData with id = ' + $stateParams.city_id);
		restAPI.trip.city.read($stateParams.trip_id, $stateParams.city_id, function(city){
			console.log('getting cityData: ');
			console.log(city);
			$scope.city = city;
		});
	};
	this.getCityData();
	
}]);