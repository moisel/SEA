'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:EvaluacionesTerminadoCtrl
 * @description
 * # EvaluacionesTerminadoCtrl
 * Controller of the seaApp
 */
angular.module('seaApp')
  .controller('EvaluacionesTerminadoCtrl', ["$scope", "sweet", "alerts", function ($scope, sweet, alerts) {
  	sweet.show(alerts.warning('El proceso de evaluación académica se encuentra cerrado','Fuera de plazo'));
  }]);
