'use strict';

/**
 * @ngdoc service
 * @name seaApp.sessionService
 * @description
 * # sessionService
 * Service in the seaApp.
 */
angular.module('seaApp')
  .service('sessionService', ['$http', 'configService',
   function ($http, configService) {
    return {
    	set: function(key, value){
    		//console.log(key+' <-key | value-> '+ value);
    		return sessionStorage.setItem(key, value);
    	},
    	get: function(key){
    		return sessionStorage.getItem(key);
    	},
    	destroy: function(key){
    		return sessionStorage.removeItem(key);
    	}

    }//return
}]);