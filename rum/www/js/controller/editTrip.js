app.controller("editTripController", 
		["$scope", "$http", "$state", "$ionicPopup", "$stateParams", "restAPI", "$timeout", "globals", 
		 function($scope, $http, $state, $ionicPopup, $stateParams, restAPI, $timeout, globals) {
	
	this.getTripData = function(){
		console.log('INIT getTripData with id = ' + $stateParams.trip_id);
		$timeout(function(){
			restAPI.trip.read($stateParams.trip_id, 
				function(trip){
					console.log('GET Trip callback with data:');
					console.log(trip);
					// set global variable
					globals.setTripID(trip.trip_id);
					$scope.tripData = trip;
					// convert date
					$scope.tripData.start_date = Date.parse($scope.tripData.start_date);
					$scope.tripData.end_date = Date.parse($scope.tripData.end_date);
				}
			);
		});
	}
	
	this.saveTrip = function(){
		var tripData = $scope.tripData;
		// convert dates to iso format
		if (tripData.start_date) tripData.start_date = (new Date(tripData.start_date)).toISOString();
		if (tripData.end_date) tripData.end_date = (new Date(tripData.end_date)).toISOString();
		// save trip
	};
}]);