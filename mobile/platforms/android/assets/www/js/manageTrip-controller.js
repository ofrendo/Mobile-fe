app.controller("manageTripCtrl", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {
	$scope.title = "Deine Reise: " + $routeParams.tripId;
}]);