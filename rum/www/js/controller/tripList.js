app.controller("tripListController", 
	["$scope", "$http", "$state", "$ionicPopup", "$timeout", "restAPI", "loginService", "globals", "$translate", "$ionicPopup",
	 function($scope, $http, $state, $ionicPopup, $timeout, restAPI, loginService, globals, $translate, $ionicPopup) {
	
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
		$translate(['EDIT_TRIP.LEAVE_TRIP_TITLE', 'EDIT_TRIP.LEAVE_TRIP_TEXT', 'DIALOG.OK_BTN', 'DIALOG.CANCEL_BTN']).then(function(translations){
			var confirmPopup = $ionicPopup.confirm({
			     title: translations['EDIT_TRIP.LEAVE_TRIP_TITLE'],
			     template: translations['EDIT_TRIP.LEAVE_TRIP_TEXT'],
			     okText: translations['DIALOG.OK_BTN'],
			     cancelText: translations['DIALOG.CANCEL_BTN']
			   });
			   confirmPopup.then(function(res) {
			     if(res) {
			    	 // remove user from trip
				 		$timeout(function(){
				    	 restAPI.trip.removeUserFromTrip(trip.trip_id, {user: {user_id: globals.user.user_id}}, function(){
				    		 console.log("Delete success");
							     me.getTrip();
				    	 });
				 		});
			     } else {
			       console.log("Delete Canceled");
			     }
			   });
		});
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