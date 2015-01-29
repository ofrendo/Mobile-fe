app.controller("suggestionsController", 
	["$scope", "loginService", "globals", "maps",  "$timeout", "$translate",
	function($scope, loginService, globals, maps, $timeout, $translate) {
	

	//VARIABLES
	
	var mapManagerSuggest = new maps.MapManager();
	var categories;
	$scope.suggestCategories = [];
	var positionPlace;
	

	//Load keys
	function loadSuggestCategories(callback) {
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
	
	//loads all categories
	loadSuggestCategories(function(translations) {
		$timeout(function() {
			var i = 0;
			for (var key in translations) {
				i++;
				$scope.suggestCategories.push({
					id: i,
					text: translations[key],
					icon: null
				});
			}	
		});
	});
	

	//INIT
	console.log("---INIT locationListController----");
	loginService.onInit(function() {
		globals.checkTripID();
	});	
	
	
	
	var initLocation = function() {
		//get position nad initialize map
		navigator.geolocation.getCurrentPosition (function (position){
			console.log("Position: ");
			console.log(position);
			$translate(["SUGGESTIONS.POSITION"]).then(function(translations){
				positionPlace = {
						geometry : {},
						id : "Position",
						name: translations["SUGGESTIONS.POSITION"],
						place_id : "Position",
						vicinity : "Position"
				};	
				positionPlace.geometry.location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				mapManagerSuggest.initSuggestMap([position.coords], "map-canvas-locations-suggestions");
				
				//rangeSlider Handler
			    $scope.data = {'range' : "5"};
			    
			    var timeoutId = null;
			    
			    
				 $scope.$watch('data.range', function() {
					 console.log('watch');
				            
				        if(timeoutId !== null) {
				           //ignore
				            return;
				        }	    
				        timeoutId = $timeout( function() {
				            
				            $timeout.cancel(timeoutId);
				            timeoutId = null;
				            
				            // Now change range for map
				            mapManagerSuggest.changeRange($scope.data.range*1000);
				            mapManagerSuggest.suggestLocations(categories);
				        }, 1000); 
				        
				 });
				
				mapManagerSuggest.changeRange($scope.data.range*1000);
			})
		})
	};
	
	//save the suggestions
	mapManagerSuggest.onPlacesSuggestCallback = function(places) {  
		$timeout(function() {
			$scope.suggestedPlaces = [positionPlace];
			$scope.suggestedPlaces = $scope.suggestedPlaces.concat(places);
			mapManagerSuggest.createPositionMarker(positionPlace);
			
		});
	}

	
	initLocation();
	
	//if category is choosen
	$scope.onChooseCategories = function(categoryString) {
		mapManagerSuggest.suggestLocations(categoryString);
		categories = categoryString;
	};
	
	
    
	 
	 //checkboxes handler
	 $scope.suggestionChecked = function () {
		 mapManagerSuggest.showOnlyCheckedMarkers($scope.suggestedPlaces);
	 }


}]);