app.controller("tripListController", 
	["$scope", "$http", "$state", "$ionicPopup", "$timeout", "restAPI", "loginService", "globals",
	 function($scope, $http, $state, $ionicPopup, $timeout, restAPI, loginService, globals) {
	
	console.log("----INIT tripListController----");
	$scope.trips = [];

	
	loginService.onInit(function() {
		globals.setTripID(-1); //also connects chat WS to server
		
		restAPI.user.readTrips(globals.user.user_id, function(trips) {
			console.log(trips);
			$scope.trips = trips;
		});
	});
	
	// calls the cityList view
	this.navToCityList = function(trip){
		globals.setTripID(trip.trip_id);
		$state.go('app.cityList', {trip_id: trip.trip_id});
	};
	
	this.navToAddTrip = function(){
		$state.go('app.addTrip');
	};
	
	this.deleteTrip = function(trip){
		console.log(trip);
	};
	
	this.navToEditTrip = function(trip){
		globals.setTripID(trip.trip_id);
		$state.go('app.editTrip', {trip_id: trip.trip_id});
	};
	
}]);