app.controller("exportController", 
	["$scope","restAPI", "$translate", "$timeout","$stateParams","utils","loginService","globals",
	function($scope,restAPI, $translate, $timeout,$stateParams,utils,loginService,globals) {
		

		var trip_id = $stateParams.trip_id;
		var me = this;
		this.trip;
		this.start;
		this.end;
		this.name;
		var nameError = false;
		var dateError = false;
		
		loginService.onInit(function() {
			globals.setTripID($stateParams.trip_id);
		});
		
		var loadTripData = function(trip_id){
			console.log('INIT loadTripData with id = ' + trip_id);
			$timeout(function(){
				restAPI.trip.read($stateParams.trip_id, 
					function(trip){
						console.log('GET Trip callback with data:');
						console.log(trip);
						me.trip = trip;
						
						me.name = me.trip.name;
						me.start = utils.DateToHtmlDate(new Date(me.trip.start_date));
						me.end = utils.DateToHtmlDate(new Date(me.trip.end_date));
				
						// get the cities
						//me.getCityList(me.trip);
					}
				);
			});
		};
		loadTripData();
		
		this.changeName = function (){
			if(me.name ==""){
				nameError = true;
			}
			else{
				nameError = false;
			}
		}
		
		this.changeDate = function (){
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
		this.hasNameError = function() {
			return nameError;
		}
		this.hasDateError = function () {
			return dateError;
		}
		
		this.disableExportButton = function () {
			if(nameError || dateError){
				return true;
			}
			else{
				return false;
			}

		}
		
		this.doExport = function (){
			// prep some variables
			  var startDate = new Date((new Date(me.start)).toISOString());
			  var endDate = new Date((new Date(me.end)).toISOString());
			  var title = me.name;
			  var location = "On the Road";
			  var notes = "Some notes about this event.";
			  var success = function(message) { alert("Success: " + JSON.stringify(message)); };
			  var error = function(message) { alert("Error: " + message); };
			console.log("Export to Calendar");
			  window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
			console.log("exportieren");
		}
}]);