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
	// Callback to globals for reordering and optimization
	globals.setReorderCallback(function(){
		me.data.showReordering = !me.data.showReordering;
	});

	globals.setOptimizeCallback(function() {
		me.optimize();
	});
	
	//set callback for reload
	globals.setReloadCallback(function(){
		me.reloadDetails();
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
			mapManagerSuggest.suggestLocations();
		}
	};
	mapManagerSuggest.onPlacesSuggestCallback = function(places) {
		$timeout(function() {
			$scope.suggestedPlaces = places;

			//make sure places already added are checked and cant be unchecked
			for (var i = 0; i < $scope.locations.length; i++) {
				for (var j = 0; j < $scope.suggestedPlaces.length; j++) {
					if ($scope.locations[i].place_id == $scope.suggestedPlaces[j].place_id) {
						$scope.suggestedPlaces[j].checked = true;
						$scope.suggestedPlaces[j].addedAlready = true;
					}
				}
			}
		});
	}

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

			// initialize map (only if at least 1 location)
			if (locations.length > 0) {
				mapManager.initMap(locations, "map-canvas-locations");
			}
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
			mapManagerSuggest.initSuggestMap([$scope.city], "map-canvas-locations-suggest");
		});
	};
	this.getCityData();
	
	//Suggest tab
	//Fancy select
	$scope.values = null;
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

	$scope.onChooseCategories = function(categoryString) {
		mapManagerSuggest.suggestLocations(categoryString);
	};
	//Load keys
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
	
	this.navToEditLocation = function(location){
		$state.go('app.editLocation', {
			trip_id: $stateParams.trip_id,
			city_id: $stateParams.city_id,
			location_id: location.location_id
		});
	}
	
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

	//Optimize order of waypoints
	this.optimize = function() {
		mapManagerSuggest.optimize(me.locations, function(changes) {
			//Callback after google maps has responded with new order
			//--> Update backend
			restAPI.trip.city.changeLocationIndexes(
				$stateParams.trip_id,
				$stateParams.city_id, 
				{locations: changes},
				onBackendOptimized
			);
		});
	};
	function onBackendOptimized() {
		me.getLocationList();
	}

	//adds multiple locations, for use on suggest tab
	this.addChosenLocations = function() {
		var chosenLocations = [];
		for (var i = 0; i < $scope.suggestedPlaces.length; i++) {
			var suggestedPlace = $scope.suggestedPlaces[i];
			if (suggestedPlace.checked === true && suggestedPlace.addedAlready !== true) {
				// build location object for backend
				var location = {
						name: suggestedPlace.name, 			// the name of the city (without country etc.)
						place_id: suggestedPlace.place_id,	// the unique placeid
						city_id: parseInt($stateParams.city_id),
						longitude: suggestedPlace.geometry.location.lng(),
						latitude: suggestedPlace.geometry.location.lat(),
						category: suggestedPlace.types[0]
				};
				chosenLocations.push(location);
			}
		}
		restAPI.trip.city.location.create($stateParams.trip_id, $stateParams.city_id, {locations: chosenLocations}, function() {
			me.setTab('list');
			me.getLocationList();
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
	
	//reload Location list
	this.reloadDetails = function(){
		me.getLocationList();
	};
	
}]);