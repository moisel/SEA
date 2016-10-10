'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:UsuariosPerfilCtrl
 * @description
 * # UsuariosPerfilCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('UsuariosPerfilCtrl', ["$scope", "$location", "$http", "sessionService", "configService", "loginService", "sweet", "alerts", "sha1", function ($scope, $location, $http, sessionService, configService, loginService, sweet, alerts, sha1) {
 	$scope.usuario={};
    $scope.usuario.nuevaPass='';
    $scope.usuario.nuevaPass2='';
 	$scope.usuario.oldEmail = '';
 	$http.get(configService.url()+'usuarios/usuarios.php?action=verPerfil&userToken='+sessionService.get('user'))
    .success(function (response) {//llamado no asíncrono
    	$scope.usuario = response;
    	$scope.usuario.oldEmail = response.email;
    });

    $scope.actualizarPerfil = function(){
        setTimeout(function(){
            $scope.usuario.pass = sha1.of($scope.usuario.pass);
            if($scope.usuario.nuevaPass && $scope.usuario.nuevaPass2){
                $scope.usuario.nuevaPass=sha1.of($scope.usuario.nuevaPass);
                $scope.usuario.nuevaPass2=sha1.of($scope.usuario.nuevaPass2);
            }
        	var $promise = $http.post(configService.url()+'usuarios/usuarios.php?action=actualizarPerfil&userToken='+sessionService.get('user'), $scope.usuario);
        	$promise.then(function(msg){
                sweet.show(alerts.dinamic(msg.data));
                if(parseInt(msg.data)){
                    sweet.show(alerts.new('perfil Actualizado'));
                    if($scope.usuario.oldEmail != $scope.usuario.email){
                        $scope.forcedLogout();
                    }else{
                        $location.path('/academicos/main');
                    }
                }else{
                    sweet.show(alerts.duplicated('El correo ya se encuentra ocupado o la contraseña es inválida'));
                }
                $scope.usuario.pass = '';
                $scope.usuario.nuevaPass='';
                $scope.usuario.nuevaPass2='';
            });//promise
        },1100);//esperamos un poco, para no bombardear la base de datos
    };//actualizarPerfil
}]);
