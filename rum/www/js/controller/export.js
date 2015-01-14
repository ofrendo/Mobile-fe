app.controller("exportController", 
	["restAPI", "$translate", "$timeout","$stateParams","utils","loginService","globals","$ionicPopup",
	function(restAPI, $translate, $timeout,$stateParams,utils,loginService,globals,$ionicPopup) {
		
		//VARIABLES
		var trip_id = $stateParams.trip_id;
		var me = this;
		this.trip;
		this.start;
		this.end;
		this.name;
		var nameError = false;
		var dateError = false;
		
		//INIT
		loginService.onInit(function() {
			globals.setTripID($stateParams.trip_id);
		});
		
		//FUNCTIONS
		//loads trip data from backend
		var loadTripData = function(trip_id){
			console.log('INIT loadTripData with id = ' + trip_id);
			$timeout(function(){
				restAPI.trip.read($stateParams.trip_id, 
					function(trip){
					
						//trip read
						console.log('GET Trip callback with data:');
						console.log(trip);
						me.trip = trip;
						
						//save name and dates in local variables for the frontend
						//converts the date to html date
						me.name = me.trip.name;
						me.start = utils.DateToHtmlDate(new Date(me.trip.start_date));
						me.end = utils.DateToHtmlDate(new Date(me.trip.end_date));

					}
				);
			});
		};
		loadTripData();
		
		//checks if name is empty, called everyytime name is changed
		this.changeName = function (){
			//error if name is empty
			if(me.name ==""){
				nameError = true;
			}
			else{
				nameError = false;
			}
		}
		
		//checks if dates are correct, called everytime a date is changed
		this.changeDate = function (){
			//error if a date is empty or start is after end date
			if(me.start == "" || me.end == ""){
				dateError = true; //error if one date is undefined
			}
			else if (me.start> me.end){
				dateError=true;	//error if start is bigger than end
			}
			else{
				dateError =false;
			}

		}
		//checks if a name error exists
		this.hasNameError = function() {
			return nameError;
		}
		//checks if a date error exists
		this.hasDateError = function () {
			return dateError;
		}
		
		//disables the export button due to error in name or date
		this.disableExportButton = function () {
			if(nameError || dateError){
				return true;
			}
			else{
				return false;
			}

		}
		
		//actually does the export
		this.doExport = function (){
			// prep some variables
			  var startDate = new Date(me.start);
			  var endDate = new Date(me.end);
			  var title = me.name;
			  var location = "On the Road";
			  var notes = "Inported from RUM";
			  var calOptions;
			  //success callback
			  var success = function(message) { 
				  $translate([ 'EXPORT.ERROR', 'EXPORT.SUCCESS','EXPORT.EXPORTBTN']).then(function(translations){
						var msg;						
						if(message){
							msg = translations['EXPORT.SUCCESS'];
						}
						else{ //message can stil contain an error (if for example no calender is available)
							msg = translations['EXPORT.ERROR'];
						}
						var alertPopup = $ionicPopup.alert({
							title: translations['EXPORT.EXPORTBTN'],
							template: msg
						});
					})
				  };
				  
				//error Callback  
			  var error = function(message) { 
				  $translate([ 'EXPORT.ERROR','EXPORT.EXPORTBTN']).then(function(translations){
						
						var alertPopup = $ionicPopup.alert({
							title: translations['EXPORT.EXPORTBTN'],
							template: translations['EXPORT.ERROR']
						});
					})
				  };
				  
				  
			try{
				console.log("exportieren");
				
				var calOptions = {};
				calOptions.firstReminderMinutes = null;
				 window.plugins.calendar.createEventWithOptions(title,location,notes,startDate,endDate,calOptions,success,error);
			}
			catch (e) {
				//if cordova is not available (browser)
				  $translate([ 'EXPORT.ERROR_CORDOVA','EXPORT.ERROR_TITLE']).then(function(translations){
						
						var alertPopup = $ionicPopup.alert({
							title: translations['EXPORT.ERROR_TITLE'],
							template: translations['EXPORT.ERROR_CORDOVA']
						});
					})				  
			}
			 

		}
}]);