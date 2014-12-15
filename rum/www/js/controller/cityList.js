app.controller("cityListController", ["$scope", "$http", "$state", function($scope, $http, $state) {
	console.log("----INIT cityListController----");
	// calls the addcity view
	this.navToAddCity = function(){
		$state.go('app.addCity', {tripId: trip.id});
	}
	
	this.navToEditCity = function(city){
		$state.go('app.editCity', {cityId: city.id})
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
				noLocations: 5,
				dateStart: new Date(2014, 0, 2),
				dateEnd: new Date(2014, 0, 3)
			},
			'2': {
				id: 2,
				name: 'Boston',
				noLocations: 3,
				dateStart: new Date(2014, 0, 5),
				dateEnd: new Date(2014, 0, 5)
			}
		}
};