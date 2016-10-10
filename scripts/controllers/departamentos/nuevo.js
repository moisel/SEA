'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:DepartamentosNuevoCtrl
 * @description
 * # DepartamentosNuevoCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('DepartamentosNuevoCtrl', ["$scope", "htp", "comboLoader", "sweet", "alerts", function ($scope, htp, comboLoader, sweet, alerts) {
    $scope.departamento = {};
    $scope.facultadesSeleccion={};//llenaremos de nombres de facultades existentes para elegir (admin)
    $scope.changer = {};//variable que toma el valor de texto del combobox
    $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos


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
        $scope.departamento.cod_facultad = $scope.facultadesSeleccion[facultad];
    };//cambiarCodFacultad

    $scope.agregar = function(){
        $scope.sending=true;
        if($scope.departamento.cod_facultad === 0){
            sweet.show(alerts.warning('Se debe seleccionar una Facultad', 'Facultad en blanco'));
            $scope.sending=false;
        }else{
            var url = 'departamentos/departamentos.php?action=agregarDepartamento';
            htp.post(url, $scope.departamento)
            .then(function(response){
                if(response){
                    if(parseInt(response.data)){
                            sweet.show(alerts.new('Departamento Ingresado Correctamente'));
                            $scope.limpia();
                            $scope.forma.$setPristine();
                    }else{
                            sweet.show(alerts.duplicated('El Departamento ya existe en la base de datos'));
                    }//else
                }//if(response)
                $scope.sending=false;
            });//.then
        }//else
    };//agregar


    $scope.limpia = function(){
        $scope.changer.facultad='Seleccionar Facultad';
        $scope.departamento.nombre = '';
        $scope.departamento.cod_facultad = 0;
        $scope.departamento.estado = 'ACTIVO';

   };
    $scope.limpia();  //limpiamos el datafactory
}]);

