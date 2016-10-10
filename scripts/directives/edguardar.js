'use strict';

/**
 * @ngdoc directive
 * @name seaApp.directive:edGuardar
 * @description
 * # edGuardar
 */
angular.module('seaApp')
  .directive('edGuardar', function () {
    return {
      template: ' <button ng-class="{\'btn\': true, \'my-form-btn\': true, \'btn-success\':forma.$valid, \'btn-danger\': forma.$invalid}" ng-disabled="forma.$invalid || sending" ng-click="editar()">Guardar</button>',
      restrict: 'E'//restringida a elemento,por lo que se llamará como <ed-guardar>
    };
  });
