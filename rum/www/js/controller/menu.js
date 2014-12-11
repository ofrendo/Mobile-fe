app.controller("menuController", ["$ionicSideMenuDelegate", "$scope","$timeout", function($ionicSideMenuDelegate, $scope , $timeout){
	

	$scope.checkRight = function(){
		//überprüfe ob chat angezeigt werden soll
		//return:
		//true enabled
		//false disabled
		return true;
	};
	
	$scope.checkLeft = function(){
		//überprüfe ob menü angezeigt werden soll
		//return:
		//true enabled
		//false disabled
		return true;
	};
	
	
}]);