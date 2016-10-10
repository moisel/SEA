'use strict';

/**
 * @ngdoc service
 * @name seaApp.configService
 * @description
 * # configService
 * Service in the seaApp.
 */
 //configService.urlString
angular.module('seaApp')
  .service('configService', function () {
    return {
      url: function(){return 'http://ingenieriasoftware.cl/SEA/';},//terminar con un '/' en la url 
      foo: function(){return 'bar';}
  	}//return
  });
/*


*/
