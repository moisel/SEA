'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:ComisionesEdicionCtrl
 * @description
 * # ComisionesEdicionCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('ComisionesEdicionCtrl', ["$scope", "$location", "Comision","htp", "sweet", "alerts", function ($scope, $location, Comision, htp, sweet, alerts) {
  $scope.datafactory = Comision;
  $scope.oldAnio = $scope.datafactory.anio;
  $scope.estados = ['ACTIVO', 'INACTIVO'];
  $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos

  $scope.editar = function(){
    $scope.sending=true;
    var data = {
        anio: $scope.datafactory.anio, 
        cod_facultad: $scope.datafactory.cod_facultad, 
        rut: $scope.datafactory.rut, 
        decano: $scope.datafactory.decano, 
        miembro1: $scope.datafactory.miembro1, 
        miembro2: $scope.datafactory.miembro2, 
        fechaPie: $scope.datafactory.fechaPie, 
        estado: $scope.datafactory.estado, 
        oldAnio: $scope.oldAnio
    };
    var url = 'comisiones/comisiones.php?action=editarComision';
    htp.put(url, data)
    .then(function(response){
      if(response){
        if(parseInt(response.data)){
          $location.path('/comisiones/main');
        }else{
            sweet.show(alerts.duplicated('Ya se Configuró una Comisión para el año '+$scope.datafactory.anio));
        }//else
      }//if(response)
      $scope.sending=false;
    });//.then
  };//editar
}]);//ComisionesEdicionCtrl