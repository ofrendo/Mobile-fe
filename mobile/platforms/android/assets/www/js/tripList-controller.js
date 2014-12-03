app.controller("tripListController", ["$scope", "$http", "$location", function($scope, $http, $location) {
	$scope.title = "Deine Reisen";
	
	this.trips = trips;
	
	// calls the manageTrip view
	this.navToManageTrip = function(trip){
		var path = '/manageTrip/' + trip.id;
		$location.path(path);
	};
}]);

// fill with demo data
var trips = {
	'1': {
		id: 1,
		name: 'trip1',
		dateStart: new Date(2014, 11, 30),
		dateEnd: new Date(2014, 11, 31)
	},
	'2': {
		id: 2,
		name: 'trip2',
		dateStart: new Date(2015, 3, 10),
		dateEnd: new Date(2015, 3, 15)
	},
	'3': {
		id: 3,
		name: 'trip3',
		dateStart: new Date(2013, 0, 1),
		dateEnd: new Date(2013, 0, 14)
	}
};