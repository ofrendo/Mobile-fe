app.controller("tripListController", 
	["$scope", "$http", "$state", "$ionicPopup", "$timeout", "restAPI", "loginService", "globals",
	 function($scope, $http, $state, $ionicPopup, $timeout, restAPI, loginService, globals) {
	
	console.log("----INIT tripListController----");
	$scope.trips = [];
	var me = this;

	//be able to reorder list
	this.data = {
			showReordering: false
	};
	
	loginService.onInit(function() {
		globals.setTripID(-1); //also connects chat WS to server
		
		restAPI.user.readTrips(globals.user.user_id, function(trips) {
			console.log(trips);
			$scope.trips = trips;
		});
	});
	
	//get Trips
	this.getTrip = function(){
		restAPI.user.readTrips(globals.user.user_id, function(trips) {
			console.log(trips);
			$scope.trips = trips;
		});
	};
	
	// calls the cityList view
	this.navToCityList = function(trip){
		globals.setTripID(trip.trip_id);
		$state.go('app.cityList', {trip_id: trip.trip_id});
	};
	
	this.navToAddTrip = function(){
		$state.go('app.addTrip');
	};
	
	this.deleteTrip = function(trip){
		console.log(trip);
	};
	
	this.navToEditTrip = function(trip){
		globals.setTripID(trip.trip_id);
		$state.go('app.editTrip', {trip_id: trip.trip_id});
	};
	
	this.reorderTrip = function(trip, fromLocalIndex, toLocalIndex){
		console.log('Move Trip ' + trip.trip_id + ' from = ' + $scope.trips[fromLocalIndex].index + ' to ' + $scope.trips[toLocalIndex].index);
		$timeout(function(){
			restAPI.trip.move(trip.trip_id, {fromIndex: $scope.trips[fromLocalIndex].index , toIndex: $scope.trips[toLocalIndex].index},  
				function(){
					//Update frontend on success
					console.log('Move Trip ' + trip.trip_id + ' from ' + $scope.trips[fromLocalIndex].index + ' to ' + $scope.trips[toLocalIndex].index + " success");
					me.getTrip();
				}
			);
		});
	};
	
}]);