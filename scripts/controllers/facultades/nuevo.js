'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:FacultadesNuevoCtrl
 * @description
 * # FacultadesNuevoCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('FacultadesNuevoCtrl', ["$scope", "htp", "sweet", "alerts", function ($scope, htp, sweet, alerts) {
  $scope.facultad = {};

  $scope.agregar = function(){
    $scope.sending=true;
    var url='facultades/facultades.php?action=agregarFacultad';
    htp.post(url, $scope.facultad)
    .then(function(response){
      if(response){
        if(parseInt(response.data)){
          sweet.show(alerts.new('Facultad Ingresada Correctamente'));
          $scope.limpia();
          $scope.forma.$setPristine();
        }else{
          sweet.show(alerts.duplicated('La facultad que intenta ingresar ya existe en la base de datos'));
        }//else
      }//if(response)
      $scope.sending=false;
    });//.then
  };


$scope.limpia = function(){
  $scope.facultad.nombre = '';
  $scope.facultad.decano = '';
  $scope.facultad.estado = 'Activo';
};//limpia
    $scope.limpia();  //limpiamos el datafactory
}]);//FacultadesNuevoCtrl
