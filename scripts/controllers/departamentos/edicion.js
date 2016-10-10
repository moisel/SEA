'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:DepartamentosEdicionCtrl
 * @description
 * # DepartamentosEdicionCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('DepartamentosEdicionCtrl', ["$scope", "$location", "Departamento", "RouteChanger", "$http", "configService", "sessionService", "comboLoader", "sweet", "alerts", "htp", function ($scope, $location, Departamento, RouteChanger, $http, configService, sessionService, comboLoader, sweet, alerts, htp) {
  $scope.datafactory = Departamento;
  $scope.oldFacultad = Departamento.cod_facultad;//lo necesitamos para actualizar el dato antiguo
  $scope.changer = {};//variable que toma el valor de texto del combobox
  $scope.estados = ['ACTIVO', 'INACTIVO'];
  $scope.facultadesSeleccion=[];//llenaremos de nombres de facultades existentes para elegir (admin)
  $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos

    $scope.cargarComboboxFacultades = function(){
        $scope.sending=true;//bloquea botones y muestra spinners mientras se envían datos
       comboLoader.facultad()
        .then(function(response){
            if(response){
                $scope.facultadesSeleccion=response;
                for (var i = $scope.facultadesSeleccion.length - 1; i >= 0; i--) {//debemos iterar, al encontrar
                    //el elemento que tiene el mismo valor de la pk facultad
                    //tomamos el nombre y se lo asignamos al combobox
                    if($scope.facultadesSeleccion[$scope.facultadesSeleccion[i]] == $scope.datafactory.cod_facultad){
                        $scope.changer.facultad=$scope.facultadesSeleccion[i];
                    }
                };
            }
            $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos
        });//.then
    };// fin cargarComboboxFacultades
    $scope.cargarComboboxFacultades();

    $scope.cambiarCodFacultad = function(facultad){
        $scope.datafactory.cod_facultad = $scope.facultadesSeleccion[facultad];
    };//cambiarCodFacultad

    //$scope.changer = $scope.facultadesSeleccion[$scope.datafactory.cod_facultad];
  $scope.editar = function(){
    $scope.sending=true;
    if($scope.datafactory.cod_facultad === 0){
      sweet.show(alerts.warning('Se debe seleccionar una Facultad', 'Facultad sin Seleccionar'));
    }else{
      var data = {
        cod_departamento: $scope.datafactory.cod_departamento, 
        nombre: $scope.datafactory.nombre, 
        cod_facultad: $scope.datafactory.cod_facultad, 
        estado: $scope.datafactory.estado, 
        oldFacultad: $scope.oldFacultad
      };//data
      var url = 'departamentos/departamentos.php?action=editarDepartamento';
      htp.put(url, data)
      .then(function(response){
        if(response){
          if(parseInt(response.data)){
              $location.path('/departamentos/main');
          }else{
              sweet.show(alerts.duplicated('Ya existe un Departamento con tal nombre en la Facultad elegida'));
          }//else
        }//if(response)
        $scope.sending=false;
      });//.then
    }//else
  };//editar
}]);//departamentosEdicionCtrl