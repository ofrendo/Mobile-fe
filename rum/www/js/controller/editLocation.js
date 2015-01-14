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
		restAPI.trip.city.location.read($stateParams.trip_id, $stateParams.city_id, $stateParams.location_id, function(location){
			console.log('getting Location Details:');
			console.log(location);
			// convert dates
			if(location.start_date != null){
				location.html_start_date = utils.DateToHtmlDate(new Date(location.start_date));
				location.html_start_time = utils.DateToHtmlTime(new Date(location.start_date));
			}
			if(location.end_date != null){
				location.html_end_date = utils.DateToHtmlDate(new Date(location.end_date));
				location.html_end_time = utils.DateToHtmlTime(new Date(location.end_date));
			}
			$scope.location = location;
		});
	};
	
	this.saveLocation = function(){
		console.log('Saving location...');
		// copy JSON so the date conversion doesn't break the visualization
		var location = JSON.parse(JSON.stringify($scope.location));
		console.log(location);
		// convert dates to iso format
		location.start_date = null;
		location.end_date = null;
		if (location.html_start_date != null && location.html_start_date != ""){
			location.start_date = utils.DateAndTime(location.html_start_date, location.html_start_time);
			location.start_date = location.start_date.toISOString();
		}
		if (location.html_end_date != null && location.html_start_date != ""){
			location.end_date = utils.DateAndTime(location.html_end_date, location.html_end_time);
			location.end_date = location.end_date.toISOString();
		}
		// send data to backend
		restAPI.trip.city.location.update($stateParams.trip_id, $stateParams.city_id, location.location_id, {location: location}, function(){
			$state.go('app.locationList', {trip_id: $stateParams.trip_id, city_id: $stateParams.city_id});
		});
	}
	
	
}]);