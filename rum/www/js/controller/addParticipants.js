app.controller("addParticipantsController",
		["$scope", "restAPI", "$timeout", "$stateParams", "loginService", "globals", "$translate" , "$ionicPopup",
        function($scope, restAPI, $timeout, $stateParams, loginService, globals, $translate,$ionicPopup){
	
			
	//INIT
    console.log("----INIT addParticipantsController----");
    loginService.onInit(function() {
    	globals.checkTripID();
    });		
			
    //VARIABLES
	var me = this;
	
	//FUNCTIONS
	
	this.addUserWithMail = function(){
		// check email-address
		//simple email validation
		var re = /\S+@\S+\.\S+/;  //regularexpression string@sting.string
		if (re.test(me.email)){
			//send mail to server
			var contact = {};
			contact.emails = {};
			contact.emails[0] = {};
			contact.emails[0].value = me.email;
			me.addUser(contact);
		}	
		else{
			//show popup --> no correct mail-address
			$translate(['ADD_PARTICIPANTS.ERROR_TITLE', 'ADD_PARTICIPANTS.ERROR_MAIL']).then(function(translations){
				var alertPopup = $ionicPopup.alert({
					title: translations['ADD_PARTICIPANTS.ERROR_TITLE'],
					template: translations['ADD_PARTICIPANTS.ERROR_MAIL']
				});
			});
		}
	};

	//get contact list frome cordova
	this.getContactList = function(){
			console.log("Kontaktliste wird geladen");
			console.log($scope.participants);
			//onSuccessCallback
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
				    for(var k = 0; k < $scope.contacts.length; k++){
				    	console.log('contact');
				    	var isParticipant = false;
				    	// check the participants list
				    	for(var j = 0; j < $scope.participants.length; j++){
				    		// here it would be necessary to compare the phone numbers / mail addresses
				    		// unfortunately the phone numbers are NOT in the participants data
				    		// check only email-adress
				    		if ($scope.participants[j].email == $scope.contacts[k].emails[0].value) {
				    			$scope.contacts[k].is_participant = true;
				    			break;
							}
				    	}
				    }
				    console.log('check completed');
			    });
			};
			
			//onErrorCallback
			function onError(contactError) {
				//show alert
				$translate(['ADD_PARTICIPANTS.ERROR_TITLE', 'ADD_PARTICIPANTS.ERROR']).then(function(translations){
					var alertPopup = $ionicPopup.alert({
						title: translations['ADD_PARTICIPANTS.ERROR_TITLE'],
						template: translations['ADD_PARTICIPANTS.ERROR']
					});
				});
			};

			// find all contacts with any name field
			try {
				var options      = new ContactFindOptions();
				options.filter   = "";
				options.multiple = true;
				var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
				navigator.contacts.find(fields, onSuccess, onError, options);
			}
			catch (e) {
				//catch if app is called in browser 
				onError();
			}

	};
	
	//closes addParticipant
	this.closeDialog = function(){
		$scope.editTripCtrl.getParticipants()
		$scope.modal.hide();
	};

	//modifies photo URL, to show them in the participant list
	//due to inconsistent android versions
	this.modifyPhotoURL = function(imageUrl){

		//changes directory
        if(imageUrl.indexOf('content://') != -1 && imageUrl.indexOf("%3A") != -1){
            photo_split=imageUrl.split("%3A");
            imageUrl="content://media/external/images/media/"+photo_split[1];
        }

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
	
	//user will be added to trip
	this.addUser = function(contact){
		console.log("AddUser called");
		var userData = {};
		if (contact.displayName) {
			userData.name = contact.displayName;
		}
		if (contact.emails){ 
			userData.email = contact.emails[0].value;
		}
		if (contact.phoneNumbers){
			userData.phone = contact.phoneNumbers[0].value;
		}
		if(userData.email == null && userData.phone == null){
			console.log('The contact doesn\'t have a phone number or mail address!');
			return;
		}
		// if all data is specified, set isParticipant variable to show that this contact has already been added
		contact.is_participant = true;
		// perform backend call to add the user
		restAPI.trip.addUserToTrip($stateParams.trip_id, {user: userData}, function() {
			console.log("add User successful");			
		});
	};

}]);