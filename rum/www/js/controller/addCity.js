app.controller("addCityController", ["$scope", "$timeout", "$state", "$http", function($scope, $timeout, $state, $http) {
	
//	var geocoder = new google.maps.Geocoder();
//	
//	 var autocomplete = new google.maps.places.Autocomplete(
//			 (document.getElementById('searchText')),
//			{ types: ['(cities)'] });
	
	this.autocompletionData;
	this.cityData;
	var me = this;
	
	// initialize autocompletion service
	var service = new google.maps.places.AutocompleteService();
	
	this.selectCity = function(city){
		console.log('select city');
		me.cityData.name = city.description;
		me.autocompletionData = [];
	}
	
	this.autocomplete = function(){
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
		service.getPlacePredictions(input, callback);
		// the callback function
		function callback(predictions, status){
			$timeout(function(){
				if (status != google.maps.places.PlacesServiceStatus.OK) {
				    console.log(status);
				    return;
				}
					// if everything is fine
					me.autocompletionData = predictions; 
				}
			);
		}
	}
	
	this.addCity = function(){
		console.log('add city');
	}
	
	
}]);