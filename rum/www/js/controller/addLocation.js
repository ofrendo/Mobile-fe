app.controller("addLocationController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", "$stateParams", "$timeout", "restAPI", "utils",
	function($scope, $http, $state, $ionicPopup, loginService, globals, $stateParams, $timeout, restAPI, utils) {
	
	console.log("---INIT addLocationController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	var me = this;
	this.location;
	
	// initialize autocompletion service
	var autocompleteService = new google.maps.places.AutocompleteService();
	// initialize places service
	var html_attr = document.getElementById('google_attr');
	var placesService = new google.maps.places.PlacesService(html_attr);
	
	this.getCityData = function(){
		console.log('INIT getCityData with id = ' + $stateParams.city_id);
		restAPI.trip.city.read($stateParams.trip_id, $stateParams.city_id, function(city){
			console.log('getting cityData: ');
			console.log(city);
			$scope.city = city;
		});
	};
	this.getCityData();
	
	this.callGoogleAutocomplete = function(callback){
		// check whether input field is empty
		if(me.locationName == ""){
			me.autocompletionData = [];
			return;
		}
		// ask google places
		console.log($scope.city);
		var bounds = new google.maps.LatLngBounds(
				  new google.maps.LatLng($scope.city.latitude, $scope.city.longitude),
				  new google.maps.LatLng($scope.city.latitude, $scope.city.longitude));
		var input = {
			input: me.locationName,
			bounds: bounds,
			language: 'de' // not working!?
		};
		autocompleteService.getPlacePredictions(input, callback);
	}
	
	this.autocomplete = function(){
		var callback = function(predictions, status){
			$timeout(function(){
				if (status != google.maps.places.PlacesServiceStatus.OK) {
				    console.error(status);
				    // don't show any data if an error occurred (for example ZERO_RESULTS)!
				    me.autocompletionData = [];
				    return;
				}
					// if everything is fine
					// run through predictions and check whether they are within the city
					me.autocompletionData = [];
					for(var i = 0; i < predictions.length; i++){
						for(var j = 0; j < predictions[i].terms.length; j++){
							if(predictions[i].terms[j].value == $scope.city.name){
								me.autocompletionData.push(predictions[i]);
								break;
							}
						}
					}
				}
			);
		}
		me.callGoogleAutocomplete(callback);
	}
	
	this.selectLocation = function(location){
		console.log('Location selected: ');
		console.log(location);
		me.locationName = location.description;
		me.autocompletionData = [];
	};
	
	this.addLocation = function(){
		console.log('add location');
		me.callGoogleAutocomplete(function(predictions, status){
			console.log(predictions);
			// check whether there is a valid prediction
			if(predictions.length == 0){
				console.error('invalid location');
				return;
			}
			// get the place information from google places api
			var request = {
					placeId: predictions[0].place_id
			}
			placesService.getDetails(request, function(place, status){
				console.log(place);
				var locationData = me.location;
				// convert dates
				if (locationData.start_date != null){
					locationData.start_date = utils.DateAndTime(locationData.start_date, locationData.start_time);
					locationData.start_date = locationData.start_date.toISOString();
				}
				if (locationData.end_date != null){
					cityData.end_date = utils.DateAndTime(locationData.end_date, locationData.end_time);
					locationData.end_date = locationData.end_date.toISOString();
				}
				// build location object for backend
				var location = {
						name: place.name, 			// the name of the city (without country etc.)
						place_id: place.place_id,	// the unique placeid
						city_id: parseInt($stateParams.city_id),
						longitude: place.geometry.location.lng(),
						latitude: place.geometry.location.lat(),
						category: place.types[0],
						start_date: locationData.start_date,
						end_date: locationData.end_date
				};
				console.log(location);
				// call rest service
				restAPI.trip.city.location.create($stateParams.trip_id, $stateParams.city_id, {location: location}, function(id){
					console.log('Location created with id: ' + id);
					$state.go('app.locationList', {trip_id: $stateParams.trip_id, city_id: $stateParams.city_id});
				});
			});
		});
	};
	
}]);