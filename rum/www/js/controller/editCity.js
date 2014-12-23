app.controller("editCityController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", "$stateParams", "restAPI", "$timeout",
	function($scope, $http, $state, $ionicPopup, loginService, globals, $stateParams, restAPI, $timeout) {
	
	var me = this;
		
	console.log("---INIT editCityController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	// get city data from server
	this.getCityData = function(){
		console.log('INIT getCityData with id = ' + $stateParams.city_id);
		restAPI.trip.city.read($stateParams.trip_id, $stateParams.city_id, function(city){
			console.log('getting cityData: ');
			console.log(city);
			// convert date
			if(city.start_date != null){
				city.start_date = utils.DateToHtmlDate(new Date(city.start_date));
			}
			if(city.end_date != null){
				city.end_date = utils.DateToHtmlDate(new Date(city.end_date));
			}
			$scope.city = city;
		});
	}
	
	this.saveCity = function(){
		var city = $scope.city;
		// convert dates to iso format
		if (city.start_date != null) city.start_date = (new Date(city.start_date)).toISOString();
		if (city.end_date != null) city.end_date = (new Date(city.end_date)).toISOString();
		restAPI.trip.city.update($stateParams.trip_id, city.city_id, city, function(){
			$state.go('app.cityList', {trip_id: $stateParams.trip_id});
		});
	}
}]);