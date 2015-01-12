app.controller("locationDetailController", 
	["$scope", "$http", "$state", "$ionicPopup", "loginService", "globals", "$stateParams", "restAPI", 
	 "$ionicScrollDelegate", "$timeout", "$interval",
	function($scope, $http, $state, $ionicPopup, loginService, globals, $stateParams, restAPI,
	 $ionicScrollDelegate, $timeout, $interval) {
	
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
				if (angular.isDefined(scroll) && document.getElementById('photos') == null) {
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
		}, 2000);
		
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
				console.log(place);
				$scope.googlePlace = place;
				me.autoScroll();
			});
		});
	};
	this.getLocation();
		
}]);