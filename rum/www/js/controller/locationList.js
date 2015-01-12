app.controller("locationListController", 
	["$scope", "$state", "$ionicPopup", "loginService", "globals", "maps", "$stateParams", "$timeout", "$translate",
	function($scope, $state, $ionicPopup, loginService, globals, maps, $stateParams, $timeout, $translate) {
	
	console.log("---INIT locationListController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	var me = this;
	this.tab = 'list'; // can be "map" or "list"
	this.map = {};
	this.distance = 0;		// distance in km
	this.travelTime = 0;	// travel time in min
	
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();

	
	// the tabbing functions
	this.setTab = function(index){
		me.tab = index;
		maps.onTabSwitch(function(distance, travelTime) {
			$timeout(function() {
				me.distance = distance;
				me.travelTime = travelTime;
			});
		});
	};

	this.isActiveTab = function(index){
		return this.tab === index;
	};

	//be able to reorder list
	this.data = {
		showReordering: false
	};

	this.getLocationList = function(){
		console.log('INIT getLocations with city_id = ' + $stateParams.city_id);
		restAPI.trip.city.readLocations($stateParams.trip_id, $stateParams.city_id, function(locations){
			console.log('Getting locations:');
			console.log(locations);
			me.locations = locations;

			// initialize map
			maps.initMap(locations);
		});
	};
	this.getLocationList();
	
	this.getCityData = function(){
		console.log('INIT getCityData with id = ' + $stateParams.city_id);
		restAPI.trip.city.read($stateParams.trip_id, $stateParams.city_id, function(city){
			console.log('getting cityData: ');
			console.log(city);
			$scope.city = city;
		});
	};
	this.getCityData();
	
	this.navToAddLocation = function(){
		$state.go('app.addLocation', {trip_id: $stateParams.trip_id, city_id: $stateParams.city_id});
	};
	
	this.navToLocationDetail = function(location){
		$state.go('app.locationDetail', {
			trip_id: $stateParams.trip_id, 
			city_id: $stateParams.city_id, 
			location_id: location.location_id});
	};
	
	this.reorderLocation = function(location, fromLocalIndex, toLocalIndex){
		console.log('Move Location ' + location.location_id + ' from = ' + $scope.locations[fromLocalIndex].index + ' to ' + $scope.locations[toLocalIndex].index);
		$timeout(function(){
			restAPI.trip.city.location.move($stateParams.trip_id, $stateParams.city_id, location.location_id, 
					{fromIndex: $scope.locations[fromLocalIndex].index , toIndex: $scope.locations[toLocalIndex].index},  
				function(){
					//Update frontend on success
					console.log('Move Location ' + location.location_id + ' from ' + $scope.locations[fromLocalIndex].index + ' to ' + $scope.locations[toLocalIndex].index + " success");
					me.getLocationList();
					me.first = true;
				}
			);
		});
	};
	
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