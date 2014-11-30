var app = angular.module('app', ['ngRoute']);

//Configure routes for the different screens
app.config(["$routeProvider", function($routeProvider) {
	$routeProvider.
		when('/tripList', {
			templateUrl: 'partials/tripList.html',
			controller: 'tripListController as tripListCtrl'
		}).
		when('/manageTrip/:tripId', {
			templateUrl: 'partials/manageTrip.html',
			controller: 'manageTripController as manageTripCtrl'
		}).
		otherwise({
			redirectTo: '/tripList'
		});
}]);