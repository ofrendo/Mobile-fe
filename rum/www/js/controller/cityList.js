app.controller("cityListController", 
	[  "$state", "$stateParams", "$timeout", "restAPI", "loginService", "globals", "maps", "$translate", "$ionicPopup",
    function(  $state, $stateParams, $timeout, restAPI, loginService, globals, maps, $translate, $ionicPopup) {


	//VARIABLES
	var me = this;
	this.trip = {};
	this.cities = [];
	this.tab = 'list'; // can be "map" or "list"
	this.distance = 0;		// distance in km
	this.travelTime = 0;	// travel time in min
	
	var mapManager = new maps.MapManager();
	
	//INIT
	console.log("----INIT cityListController----");
	loginService.onInit(function() {
		globals.setTripID($stateParams.trip_id);
	});
	
	//be able to reorder list
	this.data = {
		showReordering: false
	};
	
	// Callback to globals for reordering
	globals.setReorderCallback(function(){
		me.data.showReordering = !me.data.showReordering;
	});
	
	//set callback for reload
	globals.setReloadCallback(function(){
		me.reloadDetails();
	});
	
	
	
	//FUNCTIONS
	
	// the tabbing functions
	this.setTab = function(index){
		me.tab = index;
		mapManager.onTabSwitch(function(distance, travelTime) {
			$timeout(function() {
				me.distance = distance;
				me.travelTime = travelTime;
			});
		});
	};
	
	//check if list or map is active
	//true = list ; false = map
	this.isActiveTab = function(index){
		return this.tab === index;
	};
	
	//reorder Items
	this.reorderCity = function(city, fromLocalIndex, toLocalIndex) {
		//fromLocalIndex and toLocalIndex are positions in list BEFORE reorder, AND also in sorted me.cities array
		//update backend
		me.moveCity(city, me.cities[fromLocalIndex].index, me.cities[toLocalIndex].index);
	};
	
	//sorts the cities array
	function sortCitiesByIndex() {
		me.cities.sort(function(a, b) {
			return a.index - b.index;
		});
	}

	// navigation functions
	this.navToAddCity = function(){
		$state.go('app.addCity', {trip_id: me.trip.trip_id});
	};
	this.navToEditCity = function(city){
		$state.go('app.editCity', {trip_id: me.trip.trip_id, city_id: city.city_id})
	};
	this.navToLocationList = function(city){
		$state.go('app.locationList', {trip_id: me.trip.trip_id, city_id: city.city_id})
	};
	
	// get the tripData from the backend
	this.loadTripData = function(trip_id){
		console.log('INIT loadTripData with id = ' + trip_id);
		$timeout(function(){
			restAPI.trip.read($stateParams.trip_id, 
				function(trip){
					console.log('GET Trip callback with data:');
					console.log(trip);
					me.trip = trip;
					// get the cities
					me.getCityList(me.trip);
				}
			);
		});
	};
	this.loadTripData($stateParams.trip_id);
	
	//move city (reorder)
	this.moveCity = function(city, fromIndex, toIndex) {
		console.log('Move City ' + city.city_id + ' from = ' + fromIndex + ' to ' + toIndex);
		$timeout(function(){
			restAPI.trip.city.move($stateParams.trip_id, city.city_id, {fromIndex: fromIndex , toIndex: toIndex},  
				function(){
					//Update frontend on success
					console.log('Move City ' + city.city_id + ' from ' + fromIndex + ' to ' + toIndex + " success");
					me.getCityList({trip_id: $stateParams.trip_id});
					mapManager.first = true;
				}
			);
		});
	};
	
	//remove city
	this.deleteCity = function(city){
		// show popup to confirm deletion
		$translate(['EDIT_CITY.CONFIRM_DELETE_TITLE', 'EDIT_CITY.CONFIRM_DELETE_TEXT', 'DIALOG.OK_BTN', 'DIALOG.CANCEL_BTN']).then(function(translations){
			var confirmPopup = $ionicPopup.confirm({
			     title: translations['EDIT_CITY.CONFIRM_DELETE_TITLE'],
			     template: translations['EDIT_CITY.CONFIRM_DELETE_TEXT'],
			     okText: translations['DIALOG.OK_BTN'],
			     cancelText: translations['DIALOG.CANCEL_BTN']
			   });
			confirmPopup.then(function(res){
				if(res){
				   // delete the city
				   restAPI.trip.city.delete($stateParams.trip_id, city.city_id, function(){
					   console.log('city deleted!');
					   $state.go('app.cityList', {trip_id: $stateParams.trip_id});
					   me.loadTripData($stateParams.trip_id);
				   });
				} else {
					console.log('city deletion canceled.');
				}
			});
		});
	};
	
	// get the corresponding cities
	this.getCityList = function(trip){
		console.log('INIT getCityList with trip_id = ' + trip.trip_id);
		$timeout(function(){
			restAPI.trip.readCities(trip.trip_id, 
				function(cities){
					console.log('GET cities callback with data:');
					console.log(cities);
					me.cities = cities;
					sortCitiesByIndex();
					// initialize map
					mapManager.initMap(cities, "map-canvas-cities");
				}
			);
		});
	};
	
	//reload city List
	this.reloadDetails = function(){
		me.getCityList(me.trip);
	};
}]);