'use strict';

/**
 * @ngdoc directive
 * @name seaApp.directive:edAgregar
 * @description
 * # edAgregar
 */
angular.module('seaApp')
  .directive('edAgregar', function () {
    return {
      template: '<button ng-class="{\'btn\': true, \'my-form-btn\': true, \'btn-success\': forma.$valid && forma.$dirty, \'btn-danger\': forma.$invalid && forma.$dirty, \'btn-default\': forma.$pristine}" ng-disabled="forma.$invalid || sending" ng-click="agregar()">Agregar</button>',
      restrict: 'E'
    };
  });
