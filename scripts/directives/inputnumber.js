'use strict';

/**
 * @ngdoc directive
 * @name seaApp.directive:inputNumber
 * @description
 * # inputNumber
 */
 angular.module('seaApp')
 .directive('inputNumber', function () {
 	return {
    restrict: 'A', //atributo, E ara elemento 
    link : function (scope, $element) {
    	$element.on('focus', function () {
    		angular.element(this).on('mousewheel', function (e) {
    			e.preventDefault();
    		});
    	});
    	$element.on('blur', function () {
    		angular.element(this).off('mousewheel');
    	});
    }
};
});
