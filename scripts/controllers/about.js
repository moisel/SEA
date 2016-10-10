'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the seaApp
 */
angular.module('seaApp')
  .controller('AboutCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
