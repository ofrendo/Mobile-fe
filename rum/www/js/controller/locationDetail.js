app.controller("locationDetailController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", "$stateParams", "restAPI", 
	 "$ionicScrollDelegate", "$timeout", "$interval", "utils",
	function($scope, $http, $state, $ionicPopup, loginService, globals, $stateParams, restAPI,
	 $ionicScrollDelegate, $timeout, $interval, utils) {
	
	console.log("---INIT locationDetailController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});
	
	var me = this;
	
	// initialize places service
	var html_attr = document.getElementById('google_attr');
	var placesService = new google.maps.places.PlacesService(html_attr);
	
	this.slideChanged = function(index){
		$scope.photoIndex = index;
	}
	
	this.autoScroll = function(){
		var i = 0;
		$timeout(function(){
			var scroll = $interval(function(){
				console.log('scroll');
				// if pictures aren't available anymore, stop automatic scrolling
				if (document.getElementById('photos') == null || document.getElementById('photos').children[0].children.length == 0) {
		            $interval.cancel(scroll);
		            scroll = undefined;
		            return;
		        }
				var children = document.getElementById('photos').children[0].children;
				var width = children[i].width;
				$ionicScrollDelegate.$getByHandle('photoScroll').scrollBy(width, 0, true);
				i++;
				if(i == children.length){
					i = 0;
					$ionicScrollDelegate.$getByHandle('photoScroll').scrollTo(0, 0, true);
				}
			}, 4000);
		}, 100);
		
	}
	
	this.getLocation = function(){
		restAPI.trip.city.location.read($stateParams.trip_id, $stateParams.city_id, $stateParams.location_id, function(location){
			console.log('getting Location Details:');
			console.log(location);
			$scope.location = location;
			// use the place_id to get additional information from google places API
			var request = {
					placeId: location.place_id
			}
			console.log('Request Details from google places');
			placesService.getDetails(request, function(place, status){
				if(status != 'OK'){
					console.error('NO place returned from google api: ' + status);
					return;
				}
				// modify time for output
				var weekday = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
				for(var i = 0; i < place.opening_hours.periods.length; i++){
					place.opening_hours.periods[i].weekDay = weekday[i];
					place.opening_hours.periods[i].open.timeString = utils.timeFormat(place.opening_hours.periods[i].open.time);
					place.opening_hours.periods[i].close.timeString = utils.timeFormat(place.opening_hours.periods[i].close.time);
				}
				console.log(place);
				$scope.googlePlace = place;
				me.autoScroll();
			});
		});
	};
	this.getLocation();
		
}]);