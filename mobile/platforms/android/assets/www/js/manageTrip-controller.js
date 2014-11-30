app.controller("manageTripController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {
	$scope.title = "Deine Reise: " + $routeParams.tripId;
	
	this.showAddCityBool = false;
	
	this.showAddCity = function(){
		this.showAddCityBool = true;
	}
	this.hideAddCity = function(){
		this.showAddCityBool = false;
	}
	
	// get the corresponding trip
	// later on: perform a call to the backend to receive trip with id = $routeparams.tripId
	this.trip = trip;
}]);

// demo data to manage trip
var trip = {
		id: 1,
		name: 'trip1',
		dateStart: new Date(2014, 11, 30),
		dateEnd: new Date(2014, 11, 31),
		cities: {
			'1': {
				id: 1,
				name: 'New York',
				dateStart: new Date(2014, 0, 2)
			},
			'2': {
				id: 2,
				name: 'Boston',
				dateStart: new Date(2014, 0, 5)
			}
		}
};