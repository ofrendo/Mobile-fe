app.service("maps", ["$timeout", function($timeout) {

	var me = this;
	this.first = true;
	this.objects = []; //can be either locations or cities

	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();

	this.onTabSwitch = function(onDataChange) {
		// workaround to width height problems with google maps when hiding the map and showing it again
		$timeout(function(){
			google.maps.event.trigger(me.map, 'resize');
			me.map.setZoom( me.map.getZoom() );
		});
		// center map on trip's starting point if first time
		if(me.first === true){
			$timeout(function(){
				me.map.setCenter(new google.maps.LatLng(me.objects[0].latitude, me.objects[0].longitude));
				me.showRouting(onDataChange);
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
	
	this.showRouting = function(onDataChange) {
		// create waypoints
		var waypoints = [];
		for(var i = 1; i < me.objects.length - 1; i++){
			var pos = new google.maps.LatLng(me.objects[i].latitude, me.objects[i].longitude);
			var waypoint = {
				location: pos,
				stopover: true
			};
			waypoints.push(waypoint);
		}
		// send maps request
		var request = {
			origin: new google.maps.LatLng(me.objects[0].latitude, me.objects[0].longitude),
			destination: new google.maps.LatLng(
							me.objects[me.objects.length - 1].latitude, 
							me.objects[me.objects.length - 1].longitude),
			waypoints: waypoints,
			provideRouteAlternatives: false,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC
		};
		directionsService.route(request, function(result, status) {
			if (status != google.maps.DirectionsStatus.OK) {
				console.error('Fehler beim Berechnen der Route: ' + status);
				$translate('MAP.ROUTING_NOT_POSSIBLE').then(function(text){
					toast.showLong(text);
				});
				return
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
	
	this.initMap = function(objects) {
		console.log('INIT google maps objects');
		console.log(objects);
		me.objects = objects;
		var posCenter = new google.maps.LatLng(me.objects[0].latitude, me.objects[0].longitude);
		console.log(posCenter.toString());
		var mapOptions = {
				zoom: 8,
				streetViewControl: false,
				zoomControl: false,
				panControl: false,
				mapTypeControl: false,
				center: posCenter // the center positioning won't really work because the div size is not specified (the tab is not shown at initialization)
		};
		me.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		// add markers for each city
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
}]);