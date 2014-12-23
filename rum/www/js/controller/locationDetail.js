app.controller("locationDetailController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", "$stateParams", "restAPI",
	function($scope, $http, $state, $ionicPopup, loginService, globals, $stateParams, restAPI) {
	
	console.log("---INIT locationDetailController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	// initialize places service
	var html_attr = document.getElementById('google_attr');
	var placesService = new google.maps.places.PlacesService(html_attr);
	
	this.getLocation = function(){
		restAPI.trip.city.location.read($stateParams.trip_id, $stateParams.city_id, $stateParams.location_id, function(location){
			console.log('getting Location Details:');
			console.log(location);
			$scope.location = location;
			// use the place_id to get additional information from google places API
			var request = {
					placeId: location.place_id
			}
			console.log('Request Details from google places');
			placesService.getDetails(request, function(place, status){
				if(status != 'OK'){
					console.error('NO place returned from google api: ' + status);
					return;
				}
				console.log(place);
				$scope.googlePlace = place;
			});
		});
	};
	this.getLocation();
		
}]);