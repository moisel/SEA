'use strict';

/**
 * @ngdoc service
 * @name seaApp.comboLoader
 * @description
 * # comboLoader
 * Service in the seaApp.
 */
 angular.module('seaApp')
 .service('comboLoader', ["$http", "configService", "sessionService", "sweet", "alerts", function ($http, configService, sessionService, sweet, alerts) {
 	return{
 		facultad: function(){//carga todas las facultades
 			var url='facultades/facultades.php?action=ver';
 			var sendingUrl = configService.url()+url+'&userToken='+sessionService.get('user');
 			//console.log(sendingUrl);
 			var promise = $http.get(sendingUrl)
 			.then(function (response) {
                var inicial = 'Seleccionar Facultad';
                var combobox = [inicial];
                combobox[inicial]=0;
 				var aux = response.data.records;
 				angular.forEach(aux, function(value){
 					combobox.push(value.nombre);
 					combobox[value.nombre]=value.cod_facultad;
 				});//angular.foreach
                return combobox;
        	}, function(response) {//al ocurrir un error, lo desplegamos
                sweet.show(alerts.error());
            });//.then
            return promise;
 		},//facultad
 		departamento: function(cod_facultad){//departamentos de una facultad
 			var url='departamentos/departamentos.php?action=verDeUnaFacultad&cod_facultad='+cod_facultad;
 			var sendingUrl = configService.url()+url+'&userToken='+sessionService.get('user');
 			var promise = $http.get(sendingUrl)
 			.then(function (response) {
                var inicial = 'Seleccionar Departamento';
                var combobox = [inicial];
                combobox[inicial]=0;
 				var aux = response.data.records;
 				angular.forEach(aux, function(value){
 					combobox.push(value.nombre);
 					combobox[value.nombre]=value.cod_departamento;
 				});//angular.foreach
                return combobox;
        	}, function(response) {//al ocurrir un error, lo desplegamos
                sweet.show(alerts.error());
            });//.then
        	return promise;
 		},//departamento
 		periodo: function(){//cambia en el valor al que se le hace push
            var url='configuraciones/periodos.php?action=ver';
 			var sendingUrl = configService.url()+url+'&userToken='+sessionService.get('user');
 			//console.log(sendingUrl);
 			var promise = $http.get(sendingUrl)
 			.then(function (response) {
                var combobox = ['Seleccionar Periodo'];
 				var aux = response.data.records;
 				angular.forEach(aux, function(value){
 					combobox.push(value.inicio);
 				});//angular.foreach
                return combobox;
        	}, function(response) {//al ocurrir un error, lo desplegamos
                sweet.show(alerts.error());
            });//.then
        	return promise;
 		},//periodo
  	}//return
  }]);//.service
