'use strict';

/**
 * @ngdoc service
 * @name seaApp.htp
 * @description
 * # htp
 * Service in the seaApp.
 */
angular.module('seaApp')
.service('htp', ["$http", "configService", "sessionService", "sweet", "alerts", function ($http, configService, sessionService, sweet, alerts) {
 	return{
 		get: function(url){
 			var sendingUrl = configService.url()+url+'&userToken='+sessionService.get('user');
 			//console.log(sendingUrl);
 			var promise = $http.get(sendingUrl)//es una promesa, por lo que es un
			 .then(function (response) {//llamado no asíncrono
			 	return response;//es la respuesto que va dentro de la promesa en el controlador
			}, function(response) {//al ocurrir un error, lo desplegamos
        		sweet.show(alerts.error());
    		});//.then
			return promise;//retornamos la promesa para usar .then
 		},//get
 		post: function(url, obj){
 			var sendingUrl = configService.url()+url+'&userToken='+sessionService.get('user');
 			var promise = $http.post(sendingUrl, obj)//es una promesa, por lo que es un
			 .then(function (response) {//llamado no asíncrono
			 	return response;//es la respuesto que va dentro de la promesa en el controlador
			}, function(response) {//al ocurrir un error
        		sweet.show(alerts.error());//lo desplegamos
    		});//.then
			return promise;//retornamos la promesa para usar .then
 		},//post
 		put: function(url, obj){
 			var sendingUrl = configService.url()+url+'&userToken='+sessionService.get('user');
 			var promise = $http.post(sendingUrl, obj)//es una promesa, por lo que es un
			 .then(function (response) {//llamado no asíncrono
			 	sweet.show(alerts.edit());
			 	return response;//es la respuesto que va dentro de la promesa en el controlador
			}, function(response) {//al ocurrir un error
        		sweet.show(alerts.error());//lo desplegamos
    		});//.then
			return promise;//retornamos la promesa para usar .then
 		},//put
 	}//return
}]);//htp
