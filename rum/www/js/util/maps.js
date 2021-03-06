app.service("maps", ["$timeout", "restAPI", function($timeout, restAPI) {

	this.MapManager = function() {
		var me = this;
		this.first = true;
		this.objects = []; //can be either locations or cities
		this.markers = [];
		var range = 10000;

		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var infoWindow = new google.maps.InfoWindow();

		this.onTabSwitch = function(onDataChange) {
			// workaround to width height problems with google maps when hiding the map and showing it again
			$timeout(function(){
				google.maps.event.trigger(me.map, 'resize');
				me.map.setZoom( me.map.getZoom() );
			});
			// center map on trip's starting point if first time
			if(me.first === true) {
				$timeout(function() {
					me.map.setCenter(new google.maps.LatLng(me.objects[0].latitude, me.objects[0].longitude));
					if (typeof(onDataChange) == "function") me.showRouting(onDataChange);
					me.first = false;
				}, 0);
			}
		};

		// map functions
		// returns distance in km
		this.calculateOverallDistance = function(route) {
			var distance = 0;
			for(var i = 0; i < route.legs.length; i++){
				distance += route.legs[i].distance.value;
			}
			distance /= 1000;
			console.log('Distance: ' + distance + " km");
			return Math.round(distance) + " km";
		};
		
		this.changeRange = function (newRange){
			range = newRange;
		}
		
		// returns travel time in min
		this.calculateOverallTravelTime = function(route) {
			var time = 0;
			for(var i = 0; i < route.legs.length; i++){
				time += route.legs[i].duration.value;
			}
			time = Math.round(time / 60)	// from seconds to minutes
			console.log('Travel time: ' + time + " min");
			return Math.floor(time / 60) + " h " + (time % 60) + " min ";
		};
		
		this.suggestLocations = function(categoryString) {
			clearMarkers();

			var cityCenter = new google.maps.LatLng(me.objects[0].latitude, me.objects[0].longitude);
			var request = {
				location: cityCenter,
				radius: range,
			};

			if (categoryString !== undefined && categoryString !== "Choose categories") {
				var keywordString = ""; 
				var categories = categoryString.split(",");
				for (var i = 0; i < categories.length; i++) {
					keywordString += categories[i].trim();

					if (i !== categories.length-1) keywordString += "+";
				}
				request.keyword = keywordString;
			}

			console.log("Suggesting locations with keywords:" + keywordString);
			console.log(request);

			var placesService = new google.maps.places.PlacesService(me.map);
			placesService.nearbySearch(request, onPlacesSearch);
			restAPI.loading = true;
		};

		function onPlacesSearch(results, status) {
			console.log("onPlacesSearch results:");
			console.log(results);
			restAPI.loading = false;
			if (status == google.maps.places.PlacesServiceStatus.OK) {
			    for (var i = 0; i < results.length; i++) {
			    	var place = results[i];
			    	createPlacesMarker(results[i]);
			    }
			    if (typeof me.onPlacesSuggestCallback == "function") me.onPlacesSuggestCallback(results);
			} 
			else {
				console.log("Error during nearbySearch");
			}
		}
		function createPlacesMarker(place) {
			var placeLoc = place.geometry.location;
			var marker = new google.maps.Marker({
				map: me.map,
				position: place.geometry.location
			});
			me.markers.push(marker);

			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.setContent(place.name);
				infoWindow.open(me.map, this);
			});
		}
		
		this.createPositionMarker = function (position) {
			createPlacesMarker(position);
		}
		
		function clearMarkers() {
			for (var i = 0; i < me.markers.length; i++) {
				me.markers[i].setMap(null);
			}
			me.markers = [];
		}
		
		this.showOnlyCheckedMarkers = function (suggestions){
			clearMarkers(); //clear all markers
			var oneChecked = false; //check if one marker is at least shown
			suggestions.forEach(function (suggestion){
				if(suggestion.checked === true){
					createPlacesMarker(suggestion);  //show all markes with "checked"
					oneChecked = true;
				}
			});			
			if(oneChecked === false){ //show all markes if no marker isshown yet
				suggestions.forEach(function (suggestion){			
					createPlacesMarker(suggestion);		
				});
			}		
		}


		this.showRouting = function(onDataChange) {
			// create waypoints
			var waypoints = buildWaypoints(me.objects);
			// send maps request
			var request = buildDirectionsRequest(
				new google.maps.LatLng(me.objects[0].latitude, me.objects[0].longitude),
				new google.maps.LatLng(me.objects[me.objects.length - 1].latitude, 
									       me.objects[me.objects.length - 1].longitude),
				waypoints
			);
			directionsService.route(request, function(result, status) {
				if (status != google.maps.DirectionsStatus.OK) {
					console.error('Fehler beim Berechnen der Route: ' + status);
					$translate('MAP.ROUTING_NOT_POSSIBLE').then(function(text){
						toast.showLong(text);
					});
					return;
				}
				$timeout(function(){
					console.log("Showrouting result:");
					console.log(result);
					directionsDisplay.setDirections(result);
					if (typeof(onDataChange) == "function") {
						onDataChange(
							me.calculateOverallDistance(result.routes[0]),
							me.calculateOverallTravelTime(result.routes[0])
						);
					}
				});
			});
		}

		this.optimize = function(locations, onLocationsOptimized) {
			//https://developers.google.com/maps/documentation/javascript/reference#DirectionsRequest
			// create waypoints
			var waypoints = buildWaypoints(locations);
			var request = buildDirectionsRequest(
				new google.maps.LatLng(me.objects[0].latitude, me.objects[0].longitude),
				new google.maps.LatLng(
								me.objects[me.objects.length - 1].latitude, 
								me.objects[me.objects.length - 1].longitude),
				waypoints,
				true
			);
			console.log("Sending optimization request:");
			console.log(request);
			// send maps request
			directionsService.route(request, function(result, status) {
				if (status != google.maps.DirectionsStatus.OK) {
					console.error('Error optimizing route: ' + status);
					$translate('MAP.ROUTING_NOT_POSSIBLE').then(function(text){
						toast.showLong(text);
					});
					return;
				}
				console.log("Optimzation result:");
				console.log(result);
				var changes = [];
				var waypointOrder = result.routes[0].waypoint_order;
				for (var i = 0; i < waypointOrder.length; i++) {
					var currentIndex = i+1; //current index in locations array
					var newIndex = waypointOrder[i]+locations[0].index+1; //what the new index should be. needs to be +index of first location because index doesnt start at 1
					changes.push({
						location_id: locations[currentIndex].location_id,
						newIndex: newIndex 
					});
				}
				if (typeof(onLocationsOptimized) == "function") onLocationsOptimized(changes);
			});
		};

		function buildWaypoints(objects) {
			var waypoints = [];
			for(var i = 1; i < objects.length - 1; i++){
				var pos = new google.maps.LatLng(objects[i].latitude, objects[i].longitude);
				var waypoint = {
					location: pos,
					stopover: true
				};
				waypoints.push(waypoint);
			}
			return waypoints;
		}

		function buildDirectionsRequest(origin, destination, waypoints, optimizeWaypoints) {
			return {
				origin: origin,
				destination: destination,
				waypoints: waypoints,
				provideRouteAlternatives: false,
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.METRIC,
				optimizeWaypoints: optimizeWaypoints || false
			};
		}

		function initMap(objects, mapDivID) {
			console.log('INIT google maps objects');
			me.first = true;
			console.log(objects);
			me.objects = objects;
			var posCenter = new google.maps.LatLng(me.objects[0].latitude, me.objects[0].longitude);
			console.log(posCenter.toString());
			var mapOptions = {
					zoom: 11,
					streetViewControl: false,
					zoomControl: false,
					panControl: false,
					mapTypeControl: false,
					center: posCenter // the center positioning won't really work because the div size is not specified (the tab is not shown at initialization)
			};
			me.map = new google.maps.Map(document.getElementById(mapDivID), mapOptions);
		}

		this.initMap = function(objects, mapDivID) {
			initMap(objects, mapDivID);
			// add markers for each object
			for (var i = 0; i < me.objects.length; i++){
				var pos = new google.maps.LatLng(me.objects[i].latitude, me.objects[i].longitude);
				var marker = new google.maps.Marker({
				    position: pos,
				    map: me.map,
				    title: me.objects[i].name
				});
			};;;
			// init directions
			directionsDisplay.setMap(me.map);
			// don't show the standard markers (A, B, C, ...)
			directionsDisplay.setOptions({ 
				suppressMarkers: true
			});
		};
		this.initSuggestMap = function(objects, mapDivID) {
			initMap(objects, mapDivID);
		}
	}
	
}]);