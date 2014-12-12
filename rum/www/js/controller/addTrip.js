app.controller("addTripController", ["$scope", "$timeout", "$state", "restAPI", function($scope, $timeout, $state, restAPI) {
	console.log("INIT addTripController");
	console.log(restAPI);
	
	this.addTrip = function(){
		console.log('add trip');
		console.log($scope.tripData);
		var tripData = $scope.tripData;
		// convert dates to iso format
		tripData.start_date = (new Date(tripData.start_date)).toISOString();
		tripData.end_date = (new Date(tripData.end_date)).toISOString();
		console.log(tripData);
		// call rest api
		console.log(restAPI);
		restAPI.trip.create({trip: tripData}, function(trip){
			console.log('success' + trip.trip_id);
			// navigate to trip detail
			$state.go('app.cityList', {trip_id: trip.trip_id});
		});
	}
}]);