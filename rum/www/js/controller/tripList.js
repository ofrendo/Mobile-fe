app.controller("tripListController", 
	["$scope", "$http", "$state", "$ionicPopup", "$timeout", "restAPI", "loginService", "globals", "$ionicHistory",
	 function($scope, $http, $state, $ionicPopup, $timeout, restAPI, loginService, globals, $ionicHistory) {
	
	console.log("----INIT tripListController----");
	this.title = "Deine Reisen";
	$scope.trips = [];
	
	$ionicHistory.clearHistory(); 

	if (loginService.isLoggedIn()) {
		onInit();
	}
	else {
		loginService.tryLogin(onInit, function(data, status) {
			$state.go("app.login");
		});
	}
	
	function onInit() {
		globals.setTripID(-1);

		restAPI.user.readTrips(globals.user.user_id, function(trips) {
			console.log(trips);
			$scope.trips = trips;
		});
	}
	
	// calls the cityList view
	this.navToCityList = function(trip){
		globals.setTripID(trip.trip_id);
		$state.go('app.cityList', {trip_id: trip.trip_id});
	};
	
	this.navToAddTrip = function(){
		$state.go('app.addTrip');
	};
	
	this.navToEditTrip = function(trip){
		globals.setTripID(trip.trip_id);
		$state.go('app.editTrip', {trip_id: trip.trip_id});
	};
	
//	this.addPerson = function(trip){
//		// to be done
//		console.log('add person');
//	}
//	
//	this.deleteTrip = function(trip){
//		// show popup
//	   var confirmPopup = $ionicPopup.confirm({
//		   title: 'Reise löschen',
//		   template: 'Möchten Sie die Reise "' + trip.name + '" wirklich löschen?'
//	   });
//	   confirmPopup.then(function(res) {
//		   if(res) {
//			   // delete trip from json
//			   delete trips[trip.id];
//			   // delete trip from server
//			   // to be done
//		   } else {
//			   // do nothing
//			   console.log('deletion of trip cancelled');
//		   }
//	   });
//	}
}]);

/*
// fill with demo data
var trips = {
	'1': {
		id: 1,
		name: 'Amerika - Rundreise',
		noParticipants: 5,
		noCities: 2,
		dateStart: new Date(2014, 11, 30),
		dateEnd: new Date(2014, 11, 31)
	},
	'2': {
		id: 2,
		name: 'trip2',
		noParticipants: 3,
		noCities: 2,
		dateStart: new Date(2015, 3, 10),
		dateEnd: new Date(2015, 3, 15)
	},
	'3': {
		id: 3,
		name: 'trip3',
		noParticipants: 1,
		noCities: 2,
		dateStart: new Date(2013, 0, 1),
		dateEnd: new Date(2013, 0, 14)
	}
};*/
