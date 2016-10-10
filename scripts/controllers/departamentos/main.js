'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:DepartamentosMainCtrl
 * @description
 * # DepartamentosMainCtrl
 * Controller of the seaApp
 */
 
 angular.module('seaApp')
 .controller('DepartamentosMainCtrl', ["$scope", "Departamento", "$location", "htp", function ($scope, Departamento, $location, htp) {
  /////////////cambiando pk por nombre/////////////
  $scope.array = [];//guardará tanto el arreglo de facultades como el de departamento
  $scope.array.facultades = [];//arreglo de facultades
  $scope.datafactory = Departamento
  $scope.curPage = 0;
  $scope.pageSize = 5;
  $scope.departamentos = [];
  
  htp.get('facultades/facultades.php?action=ver')
  .then(function(response){
    var aux = response.data.records;
    angular.forEach(aux, function(value){
      $scope.array.facultades[value.cod_facultad]=value.nombre;//hacemos coincidir la pk con el index del array
    });//angular.foreach
  });//then
  /////////////fin cambiando pk por nombre/////////////
  $scope.showSpinner=true;
  $scope.departamentos='';
  $scope.reload = function(){
    $scope.showSpinner=true;
    htp.get('departamentos/departamentos.php?action=ver')
    .then(function(response){
      if(response){
        $scope.departamentos = response.data.records;
      }
      $scope.showSpinner=false;
    });//.then
  };//reload
  $scope.reload();

  $scope.seleccionar = function(departamento){

    $scope.datafactory.cod_departamento = departamento.cod_departamento;
    $scope.datafactory.nombre = departamento.nombre;
    $scope.datafactory.cod_facultad = departamento.cod_facultad;
    $scope.datafactory.estado = departamento.estado;

    $location.path('/departamentos/edicion');

  };

  $scope.ordenarPor = function(orden){
    $scope.ordenSeleccionado = orden;
  };

  $scope.numberOfPages = function() 
  {
   return Math.ceil($scope.departamentos.length / $scope.pageSize);
 };
}]);