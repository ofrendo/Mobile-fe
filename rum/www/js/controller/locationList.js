app.controller("locationListController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", "$stateParams",
	function($scope, $http, $state, $ionicPopup, loginService, globals, $stateParams) {
	
	console.log("---INIT locationListController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	this.getLocationList = function(){
		console.log('INIT getLocations with city_id = ' + $stateParams.city_id);
		restAPI.trip.city.readLocations($stateParams.trip_id, $stateParams.city_id, function(locations){
			console.log('getting locations:');
			console.log(locations);
			$scope.locations = locations;
		});
	};
	this.getLocationList();
	
	this.getCityData = function(){
		console.log('INIT getCityData with id = ' + $stateParams.city_id);
		restAPI.trip.city.read($stateParams.trip_id, $stateParams.city_id, function(city){
			console.log('getting cityData: ');
			console.log(city);
			$scope.city = city;
		});
	};
	this.getCityData();
	
	this.navToAddLocation = function(){
		$state.go('app.addLocation', {trip_id: $stateParams.trip_id, city_id: $stateParams.city_id});
	};

}]);