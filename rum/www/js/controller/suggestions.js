app.controller("suggestionsController", 
	["$scope", "$state", "$ionicPopup", "loginService", "globals", "maps", "$stateParams", "$timeout", "$translate",
	function($scope, $state, $ionicPopup, loginService, globals, maps, $stateParams, $timeout, $translate) {
	

	//VARIABLES
	
	var mapManagerSuggest = new maps.MapManager();

	$scope.suggestCategories = [];
	

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
	
	
	
	mapManagerSuggest.onPlacesSuggestCallback = function(places) {
		$timeout(function() {
			$scope.suggestedPlaces = places;
		});
	}
	
	var initLocation = function() {
		navigator.geolocation.getCurrentPosition (function (position){
			console.log(position);
			
			mapManagerSuggest.initSuggestMap([position.coords], "map-canvas-locations-suggestions");
			mapManagerSuggest.suggestLocations();
		})
	};
	
	initLocation();
	
	$scope.onChooseCategories = function(categoryString) {
		mapManagerSuggest.suggestLocations(categoryString);
	};



}]);