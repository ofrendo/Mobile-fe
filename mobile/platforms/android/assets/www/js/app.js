var app = angular.module('app', ['ngRoute']);

//Configure routes for the different screens
app.config(["$routeProvider", function($routeProvider) {
	$routeProvider.
		when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'homeCtrl as homeCtrl'
		}).
		when('/manageTrip/:tripId', {
			templateUrl: 'partials/manageTrip.html',
			controller: 'manageTripCtrl'
		}).
		otherwise({
			redirectTo: '/home'
		});
}]);