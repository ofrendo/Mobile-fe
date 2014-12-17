app.controller("addCityController", ["$scope", "$timeout", "$state", "$http", "$stateParams", "restAPI", 
                    function($scope, $timeout, $state, $http, $stateParams, restAPI) {
	
//	var geocoder = new google.maps.Geocoder();
//	
//	 var autocomplete = new google.maps.places.Autocomplete(
//			 (document.getElementById('searchText')),
//			{ types: ['(cities)'] });
	
	this.autocompletionData;
	this.cityData;
	var me = this;
	
	// initialize autocompletion service
	var autocompleteService = new google.maps.places.AutocompleteService();
	// initialize places service
	var html_attr = document.getElementById('google_attr');
	var placesService = new google.maps.places.PlacesService(html_attr);

	
	this.selectCity = function(city){
		me.cityData.name = city.description;
		me.autocompletionData = [];
	}
	
	this.callGoogleAutocomplete = function(callback){
		// check whether input field is empty
		if(me.cityData.name == ""){
			me.autocompletionData = [];
			return;
		}
		// ask google places
		var input = {
			input: me.cityData.name,
			types: ['(cities)'],
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
					me.autocompletionData = predictions; 
				}
			);
		}
		me.callGoogleAutocomplete(callback);
	}
	
	this.addCity = function(){
		console.log('add city');
		// get best prediction
		me.callGoogleAutocomplete(function(predictions, status){
			if (status != google.maps.places.PlacesServiceStatus.OK) {
			    console.error(status);
			    return;
			}
				console.log(predictions);
				// check whether there is a valid prediction
				if(predictions.length == 0){
					console.error('invalid city name');
					return;
				}
				// get the place information from google places api
				var request = {
						placeId: predictions[0].place_id
				}
				placesService.getDetails(request, function(place, status){
					console.log(place);
					var cityData = me.cityData;
					// convert dates
					if (cityData.start_date != null) cityData.start_date = (new Date(cityData.start_date)).toISOString();
					if (cityData.end_date != null) cityData.end_date = (new Date(cityData.end_date)).toISOString();
					// build city object for backend
					var city = {
							name: place.name, 			// the name of the city (without country etc.)
							place_id: place.place_id,	// the unique placeid
							trip_id: parseInt($stateParams.trip_id),
							longitude: place.geometry.location.lng(),
							latitude: place.geometry.location.lat(),
							//ranking: ,
							start_date: cityData.start_date,
							end_date: cityData.end_date
					};
					console.log(city);
					// call rest service
					restAPI.trip.city.create($stateParams.trip_id, {city: city}, function(city){
						console.log('city created. Data returned:');
						console.log(city);
						$state.go('app.locationList', {city_id: city.city_id});
					});	
				});

		})
	};
	
}]);