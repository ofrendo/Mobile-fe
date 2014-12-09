app.controller("tripListController", ["$scope", "$http", "$state", function($scope, $http, $state) {
	$scope.title = "Deine Reisen";
	
	this.trips = trips;
	
	// calls the manageTrip view
	this.navToManageTrip = function(trip){
		$state.go('app.manageTrip', {tripId: trip.id});
	};
}]);

// fill with demo data
var trips = {
	'1': {
		id: 1,
		name: 'Amerika - Rundreise',
		noParticipants: 5,
		dateStart: new Date(2014, 11, 30),
		dateEnd: new Date(2014, 11, 31)
	},
	'2': {
		id: 2,
		name: 'trip2',
		noParticipants: 3,
		dateStart: new Date(2015, 3, 10),
		dateEnd: new Date(2015, 3, 15)
	},
	'3': {
		id: 3,
		name: 'trip3',
		noParticipants: 1,
		dateStart: new Date(2013, 0, 1),
		dateEnd: new Date(2013, 0, 14)
	}
};