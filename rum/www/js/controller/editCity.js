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
		// copy JSON so the date conversion doesn't break the visualization
		var city = JSON.parse(JSON.stringify($scope.city));
		// convert dates to iso format
		if (city.start_date != null) city.start_date = (new Date(city.start_date)).toISOString();
		if (city.end_date != null) city.end_date = (new Date(city.end_date)).toISOString();
		restAPI.trip.city.update($stateParams.trip_id, city.city_id, city, function(){
			$state.go('app.cityList', {trip_id: $stateParams.trip_id});
		});
	}
	
	this.deleteCity = function(){
		// show popup to confirm deletion
		var confirmPopup = $ionicPopup.confirm({
		     title: 'Stadt "' + $scope.city.name + '" entfernen',
		     template: 'Sind Sie sicher, dass Sie die Stadt und alle ihr zugeordneten Sehenswürdigkeiten aus der Reise entfernen möchten?',
		     okText: 'OK',
		     cancelText: 'Abbrechen'
		   });
		confirmPopup.then(function(res){
			if(res){
			   // delete the city
			   restAPI.trip.city.delete($stateParams.trip_id, $stateParams.city_id, function(){
				   console.log('city deleted!');
				   $state.go('app.cityList', {trip_id: $stateParams.trip_id});
			   });
			} else {
				console.log('city deletion canceled.');
			}
		});
	}
}]);