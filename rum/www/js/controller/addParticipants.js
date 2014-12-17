app.controller("addParticipantsController",
		["$scope", "restAPI", "$timeout", "$stateParams",
        function($scope, restAPI, $timeout, $stateParams){
	
		try {
			console.log("Kontaktliste wird geladen");
			document.addEventListener("deviceready", onDeviceReady, false);
			function onDeviceReady() {
				console.log("Kontakte werden geladen:");
			    console.log(navigator.contacts);
			};
		} catch (e) {
			console.log("Debug" + e);
		}		
			
	this.getContactList = function(){
		$timeout(function(){
			console.log('INIT getParticipants with id = ' + $stateParams.trip_id);
			restAPI.trip.readUsers($stateParams.trip_id, 
				function(contacts){
				$timeout(function(){
					console.log('GET participants callback with data for ContactList:');
					console.log(contacts);
					$scope.contacts = contacts;
				});
				}
			);
		});

	};
	
	this.closeDialog = function(){
		$scope.modal.hide();
	};

	
}]);



