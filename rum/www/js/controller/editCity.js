app.controller("editCityController", 
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
	
	// get city data from server
	this.getCityData = function(){
		console.log('INIT getCityData with id = ' + $stateParams.city_id);
		restAPI.trip.city.read($stateParams.trip_id, $stateParams.city_id, function(city){
			console.log('getting cityData: ');
			console.log(city);
			// convert dates
			if(city.start_date != null){
				city.start_date = utils.DateToHtmlDate(new Date(city.start_date));
			}
			if(city.end_date != null){
				city.end_date = utils.DateToHtmlDate(new Date(city.end_date));
			}
			$scope.city = city;
		});
	};
	
	//saves the edited changes 
	this.saveCity = function(){
		// copy JSON so the date conversion doesn't break the visualization
		var city = JSON.parse(JSON.stringify($scope.city));
		// convert dates to iso format
		if (city.start_date != null) city.start_date = (new Date(city.start_date)).toISOString();
		if (city.end_date != null) city.end_date = (new Date(city.end_date)).toISOString();
		restAPI.trip.city.update($stateParams.trip_id, city.city_id, {city: city}, function(){
			$state.go('app.cityList', {trip_id: $stateParams.trip_id});
		});
	};
	
}]);