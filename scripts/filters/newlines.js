'use strict';

/**
 * @ngdoc filter
 * @name seaApp.filter:newlines
 * @function
 * @description
 * # newlines
 * Filter in the seaApp.
 */
angular.module('seaApp')
  .filter('newlines', function () {
    return function (input) {
      return input.replace(/\n/g, '<br/>');
    };
  });
