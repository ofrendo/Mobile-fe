app.controller("addCityController", ["$scope", "$timeout", "$state", function($scope, $timeout, $state) {
	$scope.title = "Stadt hinzufügen";
	
	var geocoder = new google.maps.Geocoder();
	
	 var autocomplete = new google.maps.places.Autocomplete(
			 (document.getElementById('searchText')),
			{ types: ['(cities)'] });
	
	// provide autocompletion
	this.autocomplete = function(){
		
	}
}]);