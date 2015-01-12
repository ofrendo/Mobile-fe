app.controller("addTripController", 
	["$scope", "$timeout", "$state", "restAPI", "loginService", "globals",
	function($scope, $timeout, $state, restAPI, loginService, globals) {
	
	console.log("----INIT addTripController----");
	loginService.onInit(function() {
		globals.setTripID(-1);
	});
	// create new trip
	this.addTrip = function(){
		console.log('Adding trip...');
		console.log($scope.tripData);
		var tripData = $scope.tripData;
		// convert dates to iso format
		if (tripData.start_date != null) tripData.start_date = (new Date(tripData.start_date)).toISOString();
		if (tripData.end_date != null) tripData.end_date = (new Date(tripData.end_date)).toISOString();

		// call rest api
		console.log(restAPI);
		restAPI.trip.create({trip: tripData}, function(trip){
			console.log('success' + trip.trip_id);
			// navigate to trip detail
			$state.go('app.cityList', {trip_id: trip.trip_id});
		});
	}
}]);