app.controller("editTripController", 
		["$scope", "$http", "$state", "$ionicPopup", "$stateParams", "restAPI", "$timeout", "globals", "$ionicModal", 
		 function($scope, $http, $state, $ionicPopup, $stateParams, restAPI, $timeout, globals, $ionicModal) {
			
	var me = this;
	//set ionicModal for popup
	$ionicModal.fromTemplateUrl('partials/addParticipants.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
			
	function DateToHtmlDate(jsDate){
		var dateString = 
			jsDate.getFullYear() + '-'
			+ ('0' + (jsDate.getMonth()+1)).slice(-2) + '-'
			+ ('0' + jsDate.getDate()).slice(-2);
		return dateString;
	}
	
	this.getParticipants = function(){
		console.log('INIT getParticipants with id = ' + $stateParams.trip_id);
			restAPI.trip.readUsers($stateParams.trip_id, 
				function(participants){
				$timeout(function(){
					console.log('GET participants callback with data:');
					console.log(participants);
					$scope.participants = participants;
				});
				}
			);
	};
	
	this.getTripData = function(){
		console.log('INIT getTripData with id = ' + $stateParams.trip_id);
		$timeout(function(){
			restAPI.trip.read($stateParams.trip_id, 
				function(trip){
					console.log('GET Trip callback with data:');
					console.log(trip);
					// set global variable
					globals.setTripID(trip.trip_id);
					// convert date
					if(trip.start_date != null){
						trip.start_date = DateToHtmlDate(new Date(trip.start_date));
					}
					if(trip.end_date != null){
						trip.end_date = DateToHtmlDate(new Date(trip.end_date));
					}
					$scope.tripData = trip;
				}
			);
		});
	};
	
	this.saveTrip = function(){
		var trip = $scope.tripData;
		// convert dates to iso format
		if (trip.start_date != null) trip.start_date = (new Date(trip.start_date)).toISOString();
		if (trip.end_date != null) trip.end_date = (new Date(trip.end_date)).toISOString();
		// save trip
		restAPI.trip.update(trip.trip_id, {trip: trip}, function(trip){
			console.log('-> update trip successful!');
			// navigate to tripList
			$state.go('app.tripList');
		});
	};
	
	this.deletPaticipant = function(participant){
		console.log("Delet Participant Dialog open");
		   var confirmPopup = $ionicPopup.confirm({
		     title: 'Teilnehmer entfernen',
		     template: 'Wollen Sie diesen Teilnehmer von Reise entfernen?',
		     cancelText: 'Abbrechen',
		   });
		   confirmPopup.then(function(res) {
		     if(res) {
		    	 // remove user from trip
		    	 console.log(participant);
		    	 // reload participant list
		    	 me.getParticipants();
		     } else {
		       console.log("Logout Canceled");
		     }
		   });
	};
	
	this.addParticipant = function() {
		//open modal dialog to add participants
			 $scope.modal.show();
			 
			 $scope.closeModal = function() {
			  $scope.modal.hide();
			 };
			 
			 //Cleanup the modal when we're done with it!
			 $scope.$on('$destroy', function() {
			 $scope.modal.remove();
			 });
			 
			 // Execute action on hide modal
			 $scope.$on('modal.hidden', function() {
			 // Execute action
			 });
			 
			 // Execute action on remove modal
			 $scope.$on('modal.removed', function() {
			 // Execute action
			 });
	}
	
}]);