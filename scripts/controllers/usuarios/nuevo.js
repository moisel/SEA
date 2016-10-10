'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:UsuariosNuevoCtrl
 * @description
 * # UsuariosNuevoCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('UsuariosNuevoCtrl', ["$scope", "htp", "comboLoader", "sweet", "alerts", function ($scope, htp, comboLoader, sweet, alerts) {
    $scope.permisos = ['Secretario', 'Administrador'];
    $scope.usuario = {};
    $scope.facultadesSeleccion=[];//llenaremos de nombres de facultades existentes para elegir (admin)
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
        $scope.usuario.cod_facultad = $scope.facultadesSeleccion[facultad];
    };//cambiarCodFacultad

    $scope.agregar = function(){
        $scope.sending=true;
        if($scope.usuario.cod_facultad === 0){
            sweet.show(alerts.warning('Se debe seleccionar una Facultad', 'Facultad sin Seleccionar'));
            $scope.sending=false;
        }else{
            var url = 'usuarios/usuarios.php?action=agregarUsuario';
            htp.post(url, $scope.usuario)
            .then(function(response){
                if(response){
                    if(parseInt(response.data)){
                        sweet.show(alerts.new('Usuario Ingresado Correctamente'));
                        $scope.limpia();
                        $scope.forma.$setPristine();
                    }else{
                        sweet.show(alerts.duplicated('El correo ya se encuentra ocupado'));
                    }
                }//if(response)
                $scope.sending=false;
            })//.then
        }//else
    };


    $scope.limpia = function(){
        $scope.changer.facultad='Seleccionar Facultad';
        $scope.usuario.email = '';
        $scope.usuario.permiso = 'Secretario'; 
        $scope.usuario.cod_facultad = 0; 
        $scope.usuario.rut = '';
 		$scope.usuario.pass = ''; 
 		$scope.usuario.nombre = ''; 
 		$scope.usuario.apellidos = ''; 
        $scope.usuario.estado = 'ACTIVO';

    };
    $scope.limpia();  //limpiamos el datafactory
}]);
