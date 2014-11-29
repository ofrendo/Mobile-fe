app.controller("homeCtrl", ["$scope", "$http", "$location", function($scope, $http, $location) {
	$scope.title = "Deine Reisen";
	
	this.navToManageTrip = function(trip){
		var path = '/manageTrip/' + trip.id;
		$location.path(path);
	};
}]);