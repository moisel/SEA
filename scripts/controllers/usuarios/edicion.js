'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:UsuariosEdicionCtrl
 * @description
 * # UsuariosEdicionCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('UsuariosEdicionCtrl', ["$scope", "$location", "Usuario", "comboLoader", "sweet", "alerts", "htp", function ($scope, $location, Usuario, comboLoader, sweet, alerts, htp) {
  $scope.datafactory = Usuario;
  $scope.estados = ['ACTIVO', 'INACTIVO'];
  $scope.permisos = ['Administrador', 'Secretario'];
  $scope.changer = {};//variable que toma el valor de texto del combobox
  $scope.facultadesSeleccion=[];//llenaremos de nombres de facultades existentes para elegir (admin)
  $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos

  //función que carga el combobox con el nombre de las facultades existentes
  $scope.cargarComboboxFacultades = function(){
        $scope.sending=true;//bloquea botones y muestra spinners mientras se envían datos
       comboLoader.facultad()
        .then(function(response){
            if(response){
                $scope.facultadesSeleccion=response;
                for (var i = $scope.facultadesSeleccion.length - 1; i >= 0; i--) {//debemos iterar, al encontrar
                    //el elemento que tiene el mismo valor de la pk facultad
                    //tomamos el nombre y se lo asignamos al combobox
                    if($scope.facultadesSeleccion[$scope.facultadesSeleccion[i]]== $scope.datafactory.cod_facultad){
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

  $scope.editar = function(){
    $scope.sending=true;
    if($scope.datafactory.cod_facultad === 0){
            sweet.show(alerts.warning('Se debe seleccionar una Facultad', 'Facultad sin Seleccionar'));
    }else{
      var data = {
        email: $scope.datafactory.email,
        permiso:  $scope.datafactory.permiso,
        cod_facultad:  $scope.datafactory.cod_facultad,
        rut:  $scope.datafactory.rut,
        nombre:  $scope.datafactory.nombre,
        apellidos:  $scope.datafactory.apellidos,
        estado:  $scope.datafactory.estado
      };//data
      var url = 'usuarios/usuarios.php?action=editarUsuario';
      htp.put(url, data)
      .then(function(response){
        if(response){
          $location.path('/usuarios/main');
        }
        $scope.sending=false;
      });//.then
    }//else
  };//editar
}]);//usuariosEdicionCtrl

