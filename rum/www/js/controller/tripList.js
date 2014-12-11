app.controller("tripListController", ["$scope", "$http", "$state", "$ionicPopup", "restAPI", "globals", function($scope, $http, $state, $ionicPopup, restAPI, globals) {
	console.log("----INIT tripListController----");
	$scope.title = "Deine Reisen";
	
	this.trips = [];
	restAPI.user.readTrips(globals.user.user_id, function(trips) {
		console.log(trips);
		this.trips = trips;
	});
	
	// calls the manageTrip view
	this.navToManageTrip = function(trip){
		$state.go('app.manageTrip', {tripId: trip.id});
	};
	
	this.navToAddTrip = function(){
		$state.go('app.addTrip');
	}
	
	this.addPerson = function(trip){
		// to be done
		console.log('add person');
	}
	
	this.deleteTrip = function(trip){
		// show popup
	   var confirmPopup = $ionicPopup.confirm({
		   title: 'Reise löschen',
		   template: 'Möchten Sie die Reise "' + trip.name + '" wirklich löschen?'
	   });
	   confirmPopup.then(function(res) {
		   if(res) {
			   // delete trip from json
			   delete trips[trip.id];
			   // delete trip from server
			   // to be done
		   } else {
			   // do nothing
			   console.log('deletion of trip cancelled');
		   }
	   });
	}
}]);

/*
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
};*/