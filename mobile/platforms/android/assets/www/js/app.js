var app = angular.module('app', ['ngRoute']);

//Configure routes for the different screens
app.config(["$routeProvider", function($routeProvider) {
	$routeProvider.
		when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		}).
		when('/manageTrip', {
			templateUrl: 'partials/manageTrip.html',
			controller: 'ManageTripCtrl'
		}).
		otherwise({
			redirectTo: '/home'
		});
}]);