describe('Unit: Controller', function () {
	beforeEach(module('starter',['ionic'])); 
	var ctrl,state,loginService2,ionicPopup;



	/*
	beforeEach(inject(function($controller){
		ctrl = $controller('loginController',{
			$state: state ,
			loginService: loginService2 , 
			$ionicPopup: ionicPopup
		})     
	}));
	
*/	
	it('test VerifyLoginButton', function () {
		expect('hallo').toEqual('hallo');
	})
})  