'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:UsuariosMainCtrl
 * @description
 * # UsuariosMainCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('UsuariosMainCtrl', ["$scope", "Usuario", "$location", "sweet", "alerts", "htp", function ($scope, Usuario, $location, sweet, alerts, htp) {
  $scope.usuarios=[];
  $scope.datafactory = Usuario
  $scope.curPage = 0;
  $scope.pageSize = 5;
/////////////cambiando pk por nombre/////////////
  $scope.array = [];//guardará tanto el arreglo de facultades como el de departamento
  $scope.array.facultades = [];//arreglo de facultades
  htp.get('facultades/facultades.php?action=ver')
  .then(function(response){
    var aux = response.data.records;
    angular.forEach(aux, function(value){
      $scope.array.facultades[value.cod_facultad]=value.nombre;//hacemos coincidir la pk con el index del array
    });//angular.foreach
  });//then
/////////////fin cambiando pk por nombre/////////////
  $scope.reload = function(){
    $scope.showSpinner=true;
    htp.get('usuarios/usuarios.php?action=ver')
    .then(function(response){
      if(response){
        $scope.usuarios = response.data.records;
      }
      $scope.showSpinner=false;
    });//.then
    
  };//reload
  $scope.reload();

  $scope.seleccionar = function(usuario){
    $scope.datafactory.email = usuario.email;    
    $scope.datafactory.permiso = usuario.permiso;
    $scope.datafactory.cod_facultad = usuario.cod_facultad;
    $scope.datafactory.rut = usuario.rut;
    $scope.datafactory.pass = usuario.pass;
    $scope.datafactory.nombre = usuario.nombre;
    $scope.datafactory.apellidos = usuario.apellidos;
    $scope.datafactory.estado = usuario.estado;

    $location.path('/usuarios/edicion');

  };

  $scope.ordenarPor = function(orden){
    $scope.ordenSeleccionado = orden;
  };

  $scope.numberOfPages = function() 
  {
   return Math.ceil($scope.usuarios.length / $scope.pageSize);
 };
 $scope.reenviarPassword = function(usuario){
    sweet.show(alerts.choose('¿Desea realmente reenviar contraseña a '+usuario.email+'?', 'Reenviar contraseña a '+usuario.nombre, false),
    function(){
      $scope.showSpinner=true;
      var url = 'usuarios/usuarios.php?action=reenviarPassword&email='+usuario.email;
      htp.post(url)
      .then(function(response){
        if(response){
          sweet.show(alerts.dinamic(response.data));
        }
        $scope.showSpinner=false;
      });//.then
    });//sweet.show
 };//reenviarPassword
}]);//UsuariosMainCtrl