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
			function onSuccess(contacts) {
			    console.log('Found ' + contacts.length + ' contacts.');
			    console.log(contacts);
			    //modify contacts to display photos
			    for ( var i = 0; i < contacts.length; i++) {
					if (contacts[i].photos != null) {
						var imageURI = contacts[i].photos[0].value;
						contacts[i].photos[0].value = me.modifyPhotoURL(imageURI);
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
		}else if (contact.phoneNumbers){
			userData.phone = contact.phoneNumbers[0].value;
		}else{
			return;
		}; 
			
		restAPI.trip.addUserToTrip($stateParams.trip_id, {user: userData}, function() {
			console.log("add User successful");
			
		});
	};

	
}]);



