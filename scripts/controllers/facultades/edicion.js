'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:FacultadesEdicionCtrl
 * @description
 * # FacultadesEdicionCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('FacultadesEdicionCtrl', ["$scope", "htp", "$location", "Facultad", "sweet", "alerts", function ($scope, htp, $location, Facultad, sweet, alerts) {
 	$scope.datafactory = Facultad;
 	$scope.oldFacultad=$scope.datafactory.nombre;//lo necesitamos para checkear si cambiamos el nombre, que este no se repita
 	$scope.estados = ['ACTIVO', 'INACTIVO'];
 	$scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos

 	$scope.editar = function(){
 		$scope.sending=true;
 		var data= {
 			cod_facultad: $scope.datafactory.cod_facultad,
 			nombre: $scope.datafactory.nombre,
 			decano: $scope.datafactory.decano,
 			estado: $scope.datafactory.estado,
 			oldFacultad: $scope.oldFacultad
 		};//data
 		var url = 'facultades/facultades.php?action=editarFacultad';
 		htp.put(url, data)
 		.then(function(response){
 			if(response){
 				if(parseInt(response.data)==1){
 					$location.path('/facultades/main');
 				}else{
 					sweet.show(alerts.duplicated('Ya existe una Facultad con tal nombre'));
 				}
 			}//if(response)
 			$scope.sending=false;
 		});//.then
 	};//editar
}]);//FacultadesEdicionCtrl
