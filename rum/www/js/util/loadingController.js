app.controller("loadingController", ["$scope", "restAPI", function($scope, restAPI) {
	console.log("----INIT loadingController");

	//Watch restAPI.loading for loading gif
	$scope.$watch(function() {
		return restAPI.loading;
	}, function(loading) {
		$scope.loading = loading;
		//console.log("Loading: " + loading);
	});
}]);