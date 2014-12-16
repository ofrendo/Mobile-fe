app.controller("editTripController", 
		["$scope", "$http", "$state", "$ionicPopup", "$stateParams", "restAPI", "$timeout", "globals", 
		 function($scope, $http, $state, $ionicPopup, $stateParams, restAPI, $timeout, globals) {
	
	function DateToHtmlDate(jsDate){
		var dateString = 
			jsDate.getFullYear() + '-'
			+ ('0' + (jsDate.getMonth()+1)).slice(-2) + '-'
			+ ('0' + jsDate.getDate()).slice(-2);
		return dateString;
	}
			
	this.getTripData = function(){
		console.log('INIT getTripData with id = ' + $stateParams.trip_id);
		$timeout(function(){
			restAPI.trip.read($stateParams.trip_id, 
				function(trip){
					console.log('GET Trip callback with data:');
					console.log(trip);
					// set global variable
					globals.setTripID(trip.trip_id);
					// convert date
					if(trip.start_date != null){
						trip.start_date = DateToHtmlDate(new Date(trip.start_date));
					}
					if(trip.end_date != null){
						trip.end_date = DateToHtmlDate(new Date(trip.end_date));
					}
					$scope.tripData = trip;
				}
			);
		});
	};
	
	this.saveTrip = function(){
		var trip = $scope.tripData;
		// convert dates to iso format
		if (trip.start_date != null) trip.start_date = (new Date(trip.start_date)).toISOString();
		if (trip.end_date != null) trip.end_date = (new Date(trip.end_date)).toISOString();
		// save trip
		restAPI.trip.update(trip.trip_id, {trip: trip}, function(trip){
			console.log('-> update trip successful!');
			// navigate to tripList
			$state.go('app.tripList');
		});
	};
}]);