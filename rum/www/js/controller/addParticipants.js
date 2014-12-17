app.controller("addParticipantsController",
		["$scope", "restAPI", "$timeout", "$stateParams", "loginService", "globals",
        function($scope, restAPI, $timeout, $stateParams, loginService, globals){
	
    console.log("----INIT addParticipantsController----");
    loginService.onInit(function() {
    	globals.checkTripID();
    });

	this.getContactList = function(){
			console.log("Kontaktliste wird geladen");
			function onSuccess(contacts) {
			    console.log('Found ' + contacts.length + ' contacts.');
			    console.log(contacts);
			    //modify contacts to display photos
			    for ( var i = 0; i < contacts.length; i++) {
					if (contacts[i].photos != null) {
						var imageURI = contacts[i].photos[0].value;
						if (imageURI.substring(0,21)=="content://com.android") {
							  photo_split=imageURI.split("%3A");
							  imageURI="content://media/external/images/media/"+photo_split[1];
							  contacts[i].photos[0].value = imageURI;
							}
					}
				}
				$scope.contacts = contacts;
			};

			function onError(contactError) {
			    consolse.log('onError!');
			};

			// find all contacts with 'Bob' in any name field
			var options      = new ContactFindOptions();
			options.filter   = "";
			options.multiple = true;
			var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
			navigator.contacts.find(fields, onSuccess, onError, options);
			
			
			document.addEventListener("deviceready", onDeviceReady, false);
			function onDeviceReady() {
				console.log("Kontakte werden geladen:");
			    console.log(navigator.contacts);
			};

	};
	
	this.closeDialog = function(){
		$scope.modal.hide();
	};

	
}]);



