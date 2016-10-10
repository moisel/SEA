'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:FacultadesMainCtrl
 * @description
 * # FacultadesMainCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('FacultadesMainCtrl', ["$scope", "Facultad", "$location", "htp", function ($scope, Facultad, $location, htp) {
  $scope.showSpinner=true;
  $scope.facultades= [];
  $scope.datafactory = Facultad
  $scope.curPage = 0;
  $scope.pageSize = 5;
  
  $scope.reload = function(){
    $scope.showSpinner=true;
    htp.get('facultades/facultades.php?action=ver')
    .then(function(response){
      if(response){
        $scope.facultades = response.data.records;
      }
      $scope.showSpinner=false;
    });//.then
  };//reload
  $scope.reload();

  $scope.seleccionar = function(facultad){

    $scope.datafactory.cod_facultad = facultad.cod_facultad;
    $scope.datafactory.nombre = facultad.nombre;
    $scope.datafactory.decano = facultad.decano;
    $scope.datafactory.estado = facultad.estado;

    $location.path('/facultades/edicion');

  };

  $scope.ordenarPor = function(orden){
    $scope.ordenSeleccionado = orden;
  };

  $scope.numberOfPages = function() 
  {
   return Math.ceil($scope.facultades.length / $scope.pageSize);
 };
}]);
