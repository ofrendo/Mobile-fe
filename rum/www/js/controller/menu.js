app.controller("menuController", 
	["$scope", "globals",
	function($scope, globals){
	

	$scope.checkRight = function(){
		//check if chat is supposed to be shown
		return !!globals.trip_id && globals.trip_id >= 0;
	};
	
	$scope.checkLeft = function(){
		//check if menu on left is supposed to be shown
		return true;
	};
	
	
}]);