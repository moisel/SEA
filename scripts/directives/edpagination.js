'use strict';

/**
 * @ngdoc directive
 * @name seaApp.directive:edPagination
 * @description
 * # edPagination
 */
angular.module('seaApp')
  .directive('edPagination', function () {
    return {
      templateUrl: 'views/directivas/pagination.html',
      restrict: 'E',
    };
  });
