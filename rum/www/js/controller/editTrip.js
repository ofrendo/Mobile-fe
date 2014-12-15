app.controller("editTripController", 
		["$scope", "$http", "$state", "$ionicPopup", "$stateParams", "restAPI", "$timeout", "globals", 
		 function($scope, $http, $state, $ionicPopup, $stateParams, restAPI, $timeout, globals) {
	
	function DateToHtmlDate(jsDate){
		return jsDate.getFullYear() + '-' + (jsDate.getMonth() + 1) + "-" + jsDate.getDate();
	}
			
	this.getTripData = function(){
		console.log('INIT getTripData with id = ' + $stateParams.trip_id);
		$timeout(function(){
			restAPI.trip.read($stateParams.trip_id, 
				function(trip){
					console.log('GET Trip callback with data:');
					console.log(trip);
					// set global variable
					globals.trip_id = trip.trip_id;
					$scope.tripData = trip;
					// convert date
					if($scope.tripData.start_date){
						$scope.tripData.start_date = DateToHtmlDate(new Date($scope.tripData.start_date));
					}
					if($scope.tripData.start_date){
						$scope.tripData.end_date = DateToHtmlDate(new Date($scope.tripData.end_date));
					}
					console.log($scope.tripData.start_date);
				}
			);
		});
	};
	
	this.saveTrip = function(){
		var tripData = $scope.tripData;
		// convert dates to iso format
		if (tripData.start_date) tripData.start_date = (new Date(tripData.start_date)).toISOString();
		if (tripData.end_date) tripData.end_date = (new Date(tripData.end_date)).toISOString();
		// save trip
		console.log("UPDATE trip with data:");
		console.log(tripData);
		restAPI.trip.update(tripData.trip_id, {trip: tripData}, function(trip){
			console.log('-> update trip successful!');
			// navigate to tripList
			$state.go('app.tripList');
		});
	};
}]);