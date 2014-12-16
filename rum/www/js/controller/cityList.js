app.controller("cityListController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "restAPI",
                             function($scope, $http, $state, $stateParams, $timeout, restAPI) {
	console.log("----INIT cityListController----");
	var me = this;
	this.trip = {};
	this.cities = [];
	
	
	// calls the addcity view
	this.navToAddCity = function(){
		$state.go('app.addCity', {trip_id: trip.trip_id});
	}
	
	this.navToEditCity = function(city){
		$state.go('app.editCity', {city_id: city.city_id})
	}
	
	// get the trip
	this.loadTripData = function(trip_id){
		console.log('INIT loadTripData with id = ' + trip_id);
		$timeout(function(){
			restAPI.trip.read($stateParams.trip_id, 
				function(trip){
					console.log('GET Trip callback with data:');
					console.log(trip);
					me.trip = trip;
					// get the cities
					me.getCityList(me.trip);
				}
			);
		});
	};
	this.loadTripData($stateParams.trip_id);
	
	// get the corresponding cities
	this.getCityList = function(trip){
		console.log('INIT getCityList with trip_id = ' + trip.trip_id);
		$timeout(function(){
			restAPI.trip.readCities(trip.trip_id, 
				function(cities){
					console.log('GET cities callback with data:');
					console.log(cities);
					me.cities = cities;
				}
			);
		});
	};
	
}]);

// demo data to manage trip
var cities = [
    {
		id: 1,
		name: 'New York',
		no_locations: 5,
		start_date: new Date(2014, 0, 2),
		end_date: new Date(2014, 0, 3)
	},
	{
		id: 2,
		name: 'Boston',
		no_locations: 3,
		start_date: new Date(2014, 0, 5),
		end_date: new Date(2014, 0, 5)
	}
];