'use strict';

/**
 * @ngdoc service
 * @name seaApp.hideFactory
 * @description
 * # hideFactory
 * Service in the seaApp.
 */
angular.module('seaApp')
  .service('hideFactory', function () {
    	return {mainContent: true, adminContent: true};
  });
