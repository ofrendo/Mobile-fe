app.controller("editTripController", 
	["$scope", "$http", "$state", "$ionicPopup", "$stateParams", "restAPI", "$timeout", "loginService", 
	 "globals", "$ionicModal", "utils", "$translate",
	 function($scope, $http, $state, $ionicPopup, $stateParams, restAPI, $timeout, loginService, 
	 globals, $ionicModal, utils, $translate) {
	
	loginService.onInit(function() {
		globals.setTripID($stateParams.trip_id);
	});

	var me = this;
	
	this.getParticipants = function(){
		console.log('INIT getParticipants with id = ' + $stateParams.trip_id);
			restAPI.trip.readUsers($stateParams.trip_id, 
				function(participants){
				$timeout(function(){
					console.log('GET participants callback with data:');
					console.log(participants);
					for ( var i = 0; i < participants.length; i++) {
						//check if name is null
						if (participants[i].name) {
							if (participants[i].email) {
								participants[i].name = participants[i].email;
							}
						}
					}
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

					// convert date
					if(trip.start_date != null){
						trip.start_date = utils.DateToHtmlDate(new Date(trip.start_date));
					}
					if(trip.end_date != null){
						trip.end_date = utils.DateToHtmlDate(new Date(trip.end_date));
					}
					$scope.tripData = trip;
				}
			);
		});
	};
	
	this.saveTrip = function(){
		// copy JSON so the date conversion doesn't break the visualization
		var trip = JSON.parse(JSON.stringify($scope.tripData));
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
		// check user
		// if you want to remove yourself
		if (globals.user.user_id == participant.user_id) {
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
				    	 var trip = $scope.tripData;
					 		$timeout(function(){
					    	 restAPI.trip.removeUserFromTrip(trip.trip_id, {user: {user_id: participant.user_id}}, function(){
					    		 console.log("Delete success");
								     $state.go("app.tripList");
					    	 });
					 		});
				     } else {
				       console.log("Delete Canceled");
				     }
				   });
			});
		}else{
			console.log("Delete Participant Dialog open");
			$translate(['EDIT_TRIP.DELETE_PARTICIPANT_TITLE', 'EDIT_TRIP.DELETE_PARTICIPANT_TEXT', 'DIALOG.OK_BTN', 
						'DIALOG.CANCEL_BTN']).then(function(translations){
				var confirmPopup = $ionicPopup.confirm({
				     title: translations['EDIT_TRIP.DELETE_PARTICIPANT_TITLE'],
				     template: translations['EDIT_TRIP.DELETE_PARTICIPANT_TEXT'],
				     okText: translations['DIALOG.OK_BTN'],
				     cancelText: translations['DIALOG.CANCEL_BTN'],
				   });
				   confirmPopup.then(function(res) {
				     if(res) {
				    	 // remove user from trip
				    	 var trip = $scope.tripData;
					 		$timeout(function(){
					    	 restAPI.trip.removeUserFromTrip(trip.trip_id, {user: {user_id: participant.user_id}}, function(){
					    		 console.log("Delete success");
								     // reload participant list
								     me.getParticipants();
					    	 });
					 		});
				     } else {
				       console.log("Delete Canceled");
				     }
				   });
			});
		}
	};
	
	this.addParticipant = function() {
		//set ionicModal for popup
		$ionicModal.fromTemplateUrl('partials/addParticipants.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.modal = modal;
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
		  });
	}
	
}]);