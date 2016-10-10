'use strict';

/**
 * @ngdoc service
 * @name seaApp.periodoService
 * @description
 * # periodoService
 * Service in the seaApp.
 */
 angular.module('seaApp')
 .service('periodoService', ["$http", "configService", "sessionService", function ($http, configService, sessionService) {
 	return{
 		getState: function(){
			var url = configService.url()+'configuraciones/periodos.php?action=existePeriodo&userToken='+sessionService.get('user');
			//console.log(url);
 			var promise = $http.get(url)
 			.then(function (response) {
 				return response;
 			});
 			return promise;
 		},
 		getInicio: function(){
 			var promise = $http.get(configService.url()+'configuraciones/periodos.php?action=verInicio&userToken='+sessionService.get('user'))
 			.then(function (response) {
 				return response;
 			});
 			return promise;
 		}
 	};
}]);//periodoService
