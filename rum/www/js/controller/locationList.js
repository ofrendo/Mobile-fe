app.controller("locationListController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", "$stateParams", "$timeout",
	function($scope, $http, $state, $ionicPopup, loginService, globals, $stateParams, $timeout) {
	
	console.log("---INIT locationListController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	var me = this;
	
	//be able to reorder list
	this.data = {
			showReordering: false
	};
	
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
	
	this.navToLocationDetail = function(location){
		$state.go('app.locationDetail', {
			trip_id: $stateParams.trip_id, 
			city_id: $stateParams.city_id, 
			location_id: location.location_id});
	};
	
	this.reorderLocation = function(location, fromLocalIndex, toLocalIndex){
		console.log('Move Location ' + location.location_id + ' from = ' + $scope.locations[fromLocalIndex].index + ' to ' + $scope.locations[toLocalIndex].index);
		$timeout(function(){
			restAPI.trip.city.location.move($stateParams.trip_id, $stateParams.city_id, location.location_id, 
					{fromIndex: $scope.locations[fromLocalIndex].index , toIndex: $scope.locations[toLocalIndex].index},  
				function(){
					//Update frontend on success
					console.log('Move Location ' + location.location_id + ' from ' + $scope.locations[fromLocalIndex].index + ' to ' + $scope.locations[toLocalIndex].index + " success");
					me.getLocationList();
					me.first = true;
				}
			);
		});
	};
	
	this.deleteLocation = function(location){
		//delete Location
		console.log("Delete Location");
	};
	

}]);