app.controller("globalCtrl", ["$scope", "$http", function($scope, $http) {
	this.trips = trips;
}]);

// fill with demo data
var trips = [
	{
		name: 'trip1',
		dateStart: new Date(2014, 12, 30)
	},
	{
		name: 'trip2',
		dateStart: '20150304'
	},
	{
		name: 'trip3',
		dateStart: '20130507'
	}
];