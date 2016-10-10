'use strict';

/**
 * @ngdoc directive
 * @name seaApp.directive:disableArrows
 * @description
 * # disableArrows
 */
 angular.module('seaApp')
 .directive('disableArrows', function () {
 	function disableArrows(event) {
 		if (event.keyCode === 38 || event.keyCode === 40) {
 			event.preventDefault();
 		}
 	}

 	return {
 		link: function(scope, element, attrs) {
 			element.on('keydown', disableArrows);
 		}
 	}; 
 });
