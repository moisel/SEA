'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:ConfiguracionesMainCtrl
 * @description
 * # ConfiguracionesMainCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('ConfiguracionesMainCtrl', ["$scope", "htp", "sweet", "alerts", function ($scope, htp, sweet, alerts) {
 	$scope.periodo = {};
 	$scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos
 	var date = new Date();//tomamos la fecha actual completa
 	var age = date.getFullYear();//tomamos solo el año
 	$scope.ages = [];//declaramos un arreglo de años para el combobox

 	for (var i = 6; i >= 1; i--) {//iteramos hasta llegar a uno (para no ingresar el año dos veces)
 		$scope.ages.push(age+i);//ingresamos años hasta acercarnos al año actual
 		$scope.ages.push(age-i);
 	};

 	$scope.ages.push(age);//le agregamos el año actual al arreglo de años
 	$scope.ages.sort();//ordemanos el arreglo de años
 	$scope.periodo.inicio=age;//sugerimos el año actual como año a evaluar

 	$scope.iniciarPeriodo = function(){
 		sweet.show(alerts.choose('¿Está seguro de que desea iniciar este Periodo?', 'Iniciar Periodo Año '+$scope.periodo.inicio, false),
 		function(){
 			$scope.sending=true;
 			var url = 'configuraciones/periodos.php?action=iniciarPeriodo&inicioPeriodo='+$scope.periodo.inicio;
 			htp.post(url)
 			.then(function(response){
 				if(response){
 					sweet.show(alerts.dinamic(response.data));
 				}
 				$scope.sending=false;
 			});//.then
 		});//sweet.show
 	};//iniciarPeriodo
 	$scope.finalizarPeriodo = function(){
 		sweet.show(alerts.choose('¿Está seguro de que desea Finalizar este Periodo?', 'Finalizar Periodo Existente', false),
 		function(){
 			$scope.sending=true;
 			var url = 'configuraciones/periodos.php?action=finalizarPeriodo';
 			htp.post(url)
 			.then(function(response){
 				if(response){
 					sweet.show(alerts.dinamic(response.data));
 				}
 				$scope.sending=false;
 			});//.then
	  	});//sweet.show
 	};//finalizarPeriodo
 }]);
