'use strict';

/**
 * @ngdoc filter
 * @name seaApp.filter:pagination
 * @function
 * @description
 * # pagination
 * Filter in the seaApp.
 */
 angular.module('seaApp')
 .filter('pagination', function () {
 	return function (input, cut) {//recortamos los últimos
 		if(input){//si existe un imput
 			//le recortamos los x primeros elementos para que no los muestre
      		return input.slice(cut);
  		}
  };
});