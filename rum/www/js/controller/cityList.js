app.controller("cityListController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "restAPI",
                             function($scope, $http, $state, $stateParams, $timeout, restAPI) {
	console.log("----INIT cityListController----");
	var me = this;
	this.trip = {};
	this.cities = [];
	this.tab = 'list'; // can be "map" or "list"
	this.map = {};
	this.first = true;
	
	// the tabbing functions
	this.setTab = function(index){
		this.tab = index;
		// workaround to width height problems with google maps when hiding the map and showing it again
		$timeout(function(){
			google.maps.event.trigger(me.map, 'resize');
			me.map.setZoom( me.map.getZoom() );
		});
	}
	
	this.isActiveTab = function(index){
		return this.tab === index;
	}
	
	// map functions
	this.initMap = function() {
		console.log('INIT google maps object');
		var posCenter = new google.maps.LatLng(me.cities[0].latitude, me.cities[0].longitude);
		console.log(posCenter.toString());
		var mapOptions = {
				zoom: 10,
				streetViewControl: false,
				zoomControl: false,
				panControl: false,
				mapTypeControl: false,
				center: posCenter
		};
		me.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}
	
	// navigation functions
	this.navToAddCity = function(){
		$state.go('app.addCity', {trip_id: me.trip.trip_id});
	}
	
	this.navToEditCity = function(city){
		$state.go('app.editCity', {city_id: city.city_id})
	}
	
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

// demo data to manage trip
var cities = [
    {
		id: 1,
		name: 'New York',
		no_locations: 5,
		start_date: new Date(2014, 0, 2),
		end_date: new Date(2014, 0, 3)
	},
	{
		id: 2,
		name: 'Boston',
		no_locations: 3,
		start_date: new Date(2014, 0, 5),
		end_date: new Date(2014, 0, 5)
	}
];