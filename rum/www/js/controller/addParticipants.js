app.controller("addParticipantsController",
		["$scope", "restAPI", "$timeout", "$stateParams", "loginService", "globals",
        function($scope, restAPI, $timeout, $stateParams, loginService, globals){
	
	var me = this;
	
    console.log("----INIT addParticipantsController----");
    loginService.onInit(function() {
    	globals.checkTripID();
    });

	this.getContactList = function(){
			console.log("Kontaktliste wird geladen");
			console.log($scope.participants);
			function onSuccess(contacts) {
			    console.log('Found ' + contacts.length + ' contacts.');
			    console.log(contacts);
			    
			    $timeout(function(){
			    	$scope.contacts = contacts;
			    	//modify contacts to display photos
				    for ( var i = 0; i < $scope.contacts.length; i++) {
						if ($scope.contacts[i].photos != null) {
							var imageURI = $scope.contacts[i].photos[0].value;
							$scope.contacts[i].photos[0].value = me.modifyPhotoURL(imageURI);
						}
					}
			    	// check whether a contact already is a participant
				    for(var i = 0; i < $scope.contacts.length; i++){
				    	console.log('contact');
				    	var isParticipant = false;
				    	// check the participants list
				    	for(var j = 0; j < $scope.participants.length; j++){
				    		// here it would be necessary to compare the phone numbers / mail addresses
				    		// unfortunately the phone numbers are NOT in the participants data
				    		if(false){
				    			$scope.contacts[i].is_participant = true;
				    			break;
				    		}
				    	}
				    }
				    console.log('check completed');
			    });
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
	};
	
	this.closeDialog = function(){
		$scope.editTripCtrl.getParticipants()
		$scope.modal.hide();
	};

	this.modifyPhotoURL = function(imageUrl){
	       //if (imageUrl.substring(0,21)=="content://com.android") {
        if(imageUrl.indexOf('content://') != -1 && imageUrl.indexOf("%3A") != -1){
            //"PlainFileUrl = content://com.android.providers.media.documents/document/image%3A14",
            photo_split=imageUrl.split("%3A");
            imageUrl="content://media/external/images/media/"+photo_split[1];
        }
        // workaround end

        var fileName = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        var extension;

        // check for content: protocol to make sure is not
        // a file with no extension
        if (imageUrl.indexOf('content://') != -1) {
            if(imageUrl.lastIndexOf('.') > imageUrl.lastIndexOf('/')){
                extension = imageUrl.substr(imageUrl.lastIndexOf('.') + 1);
            }else{
                extension = "jpg";
                fileName = fileName + ".jpg";
                console.log("Created File Extension jpg");
            }
        } else {
            if (imageUrl.lastIndexOf('.') == -1 || (imageUrl.lastIndexOf('.') < imageUrl.lastIndexOf('/')) ) {
                extension = "invalid";
            } else {
                extension = imageUrl.substr(imageUrl.lastIndexOf('.') + 1);
            }
        }
        return imageUrl;
	};
	
	
	this.addUser = function(contact){
		console.log("AddUser called");
		var userData = {};
		if (contact.displayName) {
			userData.name = contact.displayName;
		}
		if (contact.emails){ 
			userData.email = contact.emails[0];
		}
		if (contact.phoneNumbers){
			userData.phone = contact.phoneNumbers[0].value;
		}
		if(userData.email == null && userData.phone == null){
			console.log('The contact doesn\'t have a phone number or mail address!');
			return;
		}
		// if all data are specified, set isParticipant variable to show that this contact has already been added
		contact.is_participant = true;
		// perform backend call to add the user
		restAPI.trip.addUserToTrip($stateParams.trip_id, {user: userData}, function() {
			console.log("add User successful");			
		});
	};

}]);