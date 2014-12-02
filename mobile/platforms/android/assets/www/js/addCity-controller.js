app.controller("addCityController", ["$scope", "$http", "$routeParams", "$location", "$timeout", function($scope, $http, $routeParams, $location, $timeout) {
	$scope.title = "Stadt hinzufügen";
	
	var geocoder = new google.maps.Geocoder();
	
	// start search for city via google maps api
	this.search = function(){
		//$scope.results = [];
		geocoder.geocode( { 'address': $scope.searchText}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			$timeout(function() {
				$scope.results = results;
			}, 0);
	      } else {
	        alert("Geocode was not successful for the following reason: " + status);
	      }
	    });
	}
}]);