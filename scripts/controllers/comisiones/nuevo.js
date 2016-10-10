'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:ComisionesNuevoCtrl
 * @description
 * # ComisionesNuevoCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('ComisionesNuevoCtrl', ["$scope", "htp", "comboLoader", "sweet", "alerts", function ($scope, htp, comboLoader, sweet, alerts) {
    $scope.comision = {};
    $scope.changer = {};//variable que toma el valor de texto del combobox
    $scope.facultadesSeleccion=[];//llenaremos de nombres de facultades existentes para elegir (admin)
    $scope.cargarComboboxFacultades = function(){
        $scope.sending=true;
       comboLoader.facultad()
        .then(function(response){
            if(response){
                $scope.facultadesSeleccion=response;
            }
            $scope.sending=false;
        });
    };// fin cargarComboboxFacultades
    $scope.cargarComboboxFacultades();
    $scope.cambiarCodFacultad = function(facultad){
        $scope.comision.cod_facultad = $scope.facultadesSeleccion[facultad];
    };//cambiarCodFacultad
    $scope.agregar = function(){
        $scope.sending=true;
        if($scope.comision.cod_facultad === 0 && !$scope.hide.adminContent){
            sweet.show(alerts.warning('Se debe seleccionar una Facultad', 'Facultad en blanco'));
            $scope.sending=false;
        }else{
            var url = 'comisiones/comisiones.php?action=agregarComision';
            htp.post(url, $scope.comision)
            .then(function(response){
                if(response){
                    if(parseInt(response.data)){
                        sweet.show(alerts.new('Comisión Ingresada Correctamente'));
                        $scope.limpia();
                        $scope.forma.$setPristine();
                    }else{
                        sweet.show(alerts.duplicated('Ya se Configuró una Comisión para el año '+$scope.comision.anio));
                    }
                }//if(response)
                $scope.sending=false;
            });//.then
        }//else
    };//agregar


    $scope.limpia = function(){

        $scope.changer.facultad='Seleccionar Facultad';
        $scope.comision.anio = '';
        $scope.comision.cod_facultad = 0;
        $scope.comision.rut = '';
        $scope.comision.decano = '';
        $scope.comision.miembro1 = '';
        $scope.comision.miembro2 = ''; 
        $scope.comision.fechaPie = '';
        $scope.comision.estado = 'ACTIVO';
    };
    $scope.limpia();  //limpiamos el datafactory
}]);
