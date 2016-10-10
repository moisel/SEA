'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:EvaluarFacultadesCtrl
 * @description
 * # EvaluarFacultadesCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('EvaluarFacultadesCtrl', ["$scope", "htp", "Facultad", "$location", function ($scope, htp, Facultad, $location) {
 	$scope.facultades = [];
  $scope.datafactory = Facultad
  $scope.curPage = 0;
  $scope.pageSize = 5;

 	$scope.limpia = function(){
      $scope.datafactory.cod_facultad = '';
      $scope.datafactory.nombre = '';
      $scope.datafactory.decano = '';
      $scope.datafactory.estado = 'Activo';
   };
  $scope.limpia();  //limpiamos el datafactory

 	$scope.reload = function(){
    $scope.showSpinner=true;
    htp.get('facultades/facultades.php?action=verActivas')
    .then(function(response){
      if(response){
        $scope.facultades = response.data.records;
      }
      $scope.showSpinner=false;
    });//.then
  };//reload
  $scope.reload();
 	
 	

 	$scope.evaluar = function(facultad){
    $scope.datafactory.cod_facultad =  facultad.cod_facultad;
 		$scope.datafactory.nombre = facultad.nombre;
 		$scope.datafactory.decano = facultad.decano;
 		$scope.datafactory.estado = facultad.estado;

 		$location.path('/evaluaciones/facultad');

 	};

 	$scope.ordenarPor = function(orden){
 		$scope.ordenSeleccionado = orden;
 	};

 	$scope.numberOfPages = function() 
 	{
 		return Math.ceil($scope.facultades.length / $scope.pageSize);
 	};
 }]);
