app.controller("locationListController", 
	["$scope", "$state", "$ionicPopup", "loginService", "globals", "maps", "$stateParams", "$timeout", "$translate",
	function($scope, $state, $ionicPopup, loginService, globals, maps, $stateParams, $timeout, $translate) {
	

	//VARIABLES
	var me = this;
	this.tab = 'list'; // can be "map" or "list"
	this.map = {};
	this.distance = 0;		// distance in km
	this.travelTime = 0;	// travel time in min

	var mapManager = new maps.MapManager();
	var mapManagerSuggest = new maps.MapManager();

	this.data = {
		showReordering: false
	};
	
	//INIT
	console.log("---INIT locationListController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});	
	// Callback to globals for reordering
	globals.setReorderCallback(function(){
		me.data.showReordering = !me.data.showReordering;
	});
	
	// the tabbing functions
	this.setTab = function(index){
		me.tab = index;
		if (index == "map") {
			mapManager.onTabSwitch(function(distance, travelTime) {
				$timeout(function() {
					me.distance = distance;
					me.travelTime = travelTime;
				});
			});
		}
		else if (index == "suggest") {
			mapManagerSuggest.onTabSwitch();
		}
	};

	//checks if list or map is active
	//true  = list ; false = map
	this.isActiveTab = function(index){
		return this.tab === index;
	};

	//gets the locations from the backend
	this.getLocationList = function(){
		console.log('INIT getLocations with city_id = ' + $stateParams.city_id);
		restAPI.trip.city.readLocations($stateParams.trip_id, $stateParams.city_id, function(locations){
			console.log('Getting locations:');
			console.log(locations);
			me.locations = locations;
			$scope.locations = locations;

			// initialize map
			mapManager.initMap(locations, "map-canvas-locations");
		});
	};
	this.getLocationList();
	
	//gets the city data from the backend
	this.getCityData = function(){
		console.log('INIT getCityData with id = ' + $stateParams.city_id);
		restAPI.trip.city.read($stateParams.trip_id, $stateParams.city_id, function(city){
			console.log('getting cityData: ');
			console.log(city);
			$scope.city = city;

			//Initialize suggestions map
			mapManagerSuggest.initMap([$scope.city], "map-canvas-locations-suggest");
		});
	};
	this.getCityData();
	
	//Suggest tab
	//Load keys
	$scope.multiple = null;
	$scope.textPlacesCategories = "Choose categories";
	$scope.placesCategories = [];
	loadPlacesCategories(function(translations) {
		$timeout(function() {
			var i = 0;
			for (var key in translations) {
				i++;
				$scope.placesCategories.push({
					id: i,
					text: translations[key],
					icon: null
				});
			}
		});
	});

	function loadPlacesCategories(callback) {
		$translate(["PLACES_CATEGORIES.SIGHTSEEING", 
			"PLACES_CATEGORIES.CULTURE", 
			"PLACES_CATEGORIES.TRANSPORT", 
			"PLACES_CATEGORIES.ACCOMODATION", 
			"PLACES_CATEGORIES.SHOPPING", 
			"PLACES_CATEGORIES.FOOD",
			"PLACES_CATEGORIES.SPORTS",
			"PLACES_CATEGORIES.NATURE",
			"PLACES_CATEGORIES.FUN",
			"PLACES_CATEGORIES.RELIGION",
			"PLACES_CATEGORIES.EDUCATION"])
		.then(callback);
	}

	//NAVIGATIONS
	this.navToAddLocation = function(){
		$state.go('app.addLocation', {trip_id: $stateParams.trip_id, city_id: $stateParams.city_id});
	};
	
	this.navToLocationDetail = function(location){
		$state.go('app.locationDetail', {
			trip_id: $stateParams.trip_id, 
			city_id: $stateParams.city_id, 
			location_id: location.location_id});
	};
	
	//reorders the locations
	this.reorderLocation = function(location, fromLocalIndex, toLocalIndex){
		console.log('Move Location ' + location.location_id + ' from = ' + me.locations[fromLocalIndex].index + ' to ' + me.locations[toLocalIndex].index);
		$timeout(function(){
			restAPI.trip.city.location.move($stateParams.trip_id, $stateParams.city_id, location.location_id, 
					{fromIndex: me.locations[fromLocalIndex].index , toIndex: me.locations[toLocalIndex].index},  
				function(){
					//Update frontend on success
					console.log('Move Location ' + location.location_id + ' from ' + me.locations[fromLocalIndex].index + ' to ' + me.locations[toLocalIndex].index + " success");
					me.getLocationList();
					me.first = true;
				}
			);
		});
	};
	
	//deletes a location
	this.deleteLocation = function(location){
		// show popup to confirm deletion
		$translate(['LOCATION_LIST.CONFIRM_DELETE_TITLE', 'LOCATION_LIST.CONFIRM_DELETE_TEXT', 'DIALOG.OK_BTN', 'DIALOG.CANCEL_BTN']).then(function(translations){
			var confirmPopup = $ionicPopup.confirm({
			     title: translations['LOCATION_LIST.CONFIRM_DELETE_TITLE'],
			     template: translations['LOCATION_LIST.CONFIRM_DELETE_TEXT'],
			     okText: translations['DIALOG.OK_BTN'],
			     cancelText: translations['DIALOG.CANCEL_BTN']
			   });
			confirmPopup.then(function(res){
				if(res){
					//delete Location
					console.log("Delete Location");
					$timeout(function(){
						restAPI.trip.city.location.delete($stateParams.trip_id, $stateParams.city_id, location.location_id, function(){
							// reload frontend
							$state.reload();
							me.getLocationList();
						});
					});
				} else {
					console.log('location deletion canceled.');
				}
			});
		});
	};
	

}]);