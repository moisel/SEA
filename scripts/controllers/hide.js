'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the seaApp
 */
 //A este controlador acceden todos los demás
angular.module('seaApp')
  .controller('HideCtrl', ["$scope", "hideFactory", "loginService", function ($scope, hideFactory, loginService) {
  	$scope.hide = hideFactory;
  	$scope.checkhide = function(){
	  	if(loginService.islogged()){
	  		$scope.hide.data = false;
	  	}
	};
	$scope.checkhide();
  	
  	$scope.logout = function(){
    	loginService.logout($scope);
    };

    alert('saludos desede hide controller');
  }]);
