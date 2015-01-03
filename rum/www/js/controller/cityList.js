app.controller("cityListController", 
	["$scope", "$http", "$state", "$stateParams", "$timeout", "restAPI", "loginService", "globals", "$translate",
    function($scope, $http, $state, $stateParams, $timeout, restAPI, loginService, globals, $translate) {
	
	console.log("----INIT cityListController----");
	loginService.onInit(function() {
		globals.setTripID($stateParams.trip_id);
	});

	var me = this;
	this.trip = {};
	this.cities = [];
	this.tab = 'list'; // can be "map" or "list"
	this.map = {};
	this.first = true;
	this.distance = 0;		// distance in km
	this.travelTime = 0;	// travel time in min
	
	// be able to use Math object in angular bindings
	$scope.Math = window.Math;
	//be able to reorder list
	this.data = {
			showReordering: false
	};
	
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();

	
	// the tabbing functions
	this.setTab = function(index){
		me.tab = index;
		// workaround to width height problems with google maps when hiding the map and showing it again
		$timeout(function(){
			google.maps.event.trigger(me.map, 'resize');
			me.map.setZoom( me.map.getZoom() );
		});
		// center map on trip's starting point if first time
		if(me.first){
			$timeout(function(){
				me.map.setCenter(new google.maps.LatLng(me.cities[0].latitude, me.cities[0].longitude));
				me.showRouting();
				me.first = false;
			}, 0);
		}
	};
	
	this.isActiveTab = function(index){
		return this.tab === index;
	};
	
	//reorder Items
	this.reorderCity = function(city, fromIndex, toIndex){
		var test = me.cities.splice(fromIndex, 1);
		me.cities.splice(toIndex, 0, city);
		// new city order
		console.log(me.cities);
		//update backend
		me.moveCity(city, me.cities[fromIndex].index, me.cities[toIndex].index);
	};
	
	// map functions
	// returns distance in km
	this.calculateOverallDistance = function(route){
		var distance = 0;
		for(var i = 0; i < route.legs.length; i++){
			distance += route.legs[i].distance.value;
		}
		distance /= 1000;
		console.log('Distance: ' + distance + " km");
		return distance;
	};
	
	// returns travel time in min
	this.calculateOverallTravelTime = function(route){
		var time = 0;
		for(var i = 0; i < route.legs.length; i++){
			time += route.legs[i].duration.value;
		}
		time = Math.round(time / 60)	// from seconds to minutes
		console.log('Travel time: ' + time + " min");
		return time;
	};
	
	this.showRouting = function(){
		// create waypoints
		var waypoints = [];
		for(var i = 1; i < me.cities.length - 1; i++){
			var pos = new google.maps.LatLng(me.cities[i].latitude, me.cities[i].longitude);
			var waypoint = {
				location: pos,
				stopover: true
			};
			waypoints.push(waypoint);
		}
		// send maps request
		var request = {
			origin: new google.maps.LatLng(me.cities[0].latitude, me.cities[0].longitude),
			destination: new google.maps.LatLng(
							me.cities[me.cities.length - 1].latitude, 
							me.cities[me.cities.length - 1].longitude),
			waypoints: waypoints,
			provideRouteAlternatives: false,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC
		};
		directionsService.route(request, function(result, status) {
			if (status != google.maps.DirectionsStatus.OK) {
				console.error('Fehler beim Berechnen der Route: ' + status);
				$translate('CITY_LIST.ROUTING_NOT_POSSIBLE').then(function(text){
					toast.showLong(text);
				});
				return
			}
			$timeout(function(){
				console.log(result);
				directionsDisplay.setDirections(result);
				me.distance = me.calculateOverallDistance(result.routes[0]);
				me.travelTime = me.calculateOverallTravelTime(result.routes[0]);
			});
		});
	}
	
	this.initMap = function() {
		console.log('INIT google maps object');
		var posCenter = new google.maps.LatLng(me.cities[0].latitude, me.cities[0].longitude);
		console.log(posCenter.toString());
		var mapOptions = {
				zoom: 8,
				streetViewControl: false,
				zoomControl: false,
				panControl: false,
				mapTypeControl: false,
				center: posCenter // the center positioning won't really work because the div size is not speicified (the tab is not shown at initialization)
		};
		me.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		// add markers for each city
		for(var i = 0; i < me.cities.length; i++){
			var pos = new google.maps.LatLng(me.cities[i].latitude, me.cities[i].longitude);
			var marker = new google.maps.Marker({
			    position: pos,
			    map: me.map,
			    title: me.cities[i].name
			});
		}
		// init directions
		directionsDisplay.setMap(me.map);
		// don't show the standard markers (A, B, C, ...)
		directionsDisplay.setOptions({ 
			suppressMarkers: true
		});
	};
	
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
	
	// get the trip
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
	
	//move city
	this.moveCity = function(city, x, y){
		console.log('Move City ' + city.city_id + ' from = ' + x + ' to ' + y);
		$timeout(function(){
			restAPI.trip.city.move($stateParams.trip_id, city.city_id, {fromIndex: x , toIndex: y},  
				function(){
					console.log('Move City ' + city.city_id + ' from ' + x + ' to ' + y + " success");
				}
			);
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
					// initialize map
					me.initMap();
				}
			);
		});
	};
}]);