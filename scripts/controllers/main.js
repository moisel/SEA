'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:MainCtrl
 * @description Controlador principal de la aplicación encargado de
 * brindar la posibilidad de que un usuario ingrese al sistema
 * y mantiene las variables globales que modifican la barra de herramientas
 * en el front-end
 * # MainCtrl
 * Controller of the seaApp
 */
angular.module('seaApp')
 .controller('MainCtrl', ["$scope", "loginService", "hideFactory", "sweet", "alerts", "RouteChanger", function ($scope, loginService, hideFactory, sweet, alerts, RouteChanger) {
    //cuano partre verifica si esconde
    // $location.path('reportes/facultades');//DEBUG
    $scope.showMainSpinner=false;
    $scope.user = {};
    $scope.user.email='';
    $scope.user.pass='';
    $scope.hide = true;
    $scope.hide = hideFactory; // se actualiza tan pronto otro controlador haga uso de esta fábrica

    /**
     * Description
     * @method login
     * @param {} user
     * @return 
     */
    $scope.login = function(user){
      $scope.showMainSpinner=true;
      $scope.mensajeParaUsuario=''; // limpiamos el mensaje con cada click
      loginService.login(user, $scope);
    };//login

    /**
     * Description
     * @method logout
     * @return 
     */
    $scope.logout = function(){
      sweet.show(alerts.choose('¿Desea realmente salir del sistema?','Cerrar Sesión', true),
      function(){
         /* loginService.logout($scope);
          $location.path('/');*/
          $scope.forcedLogout();
      });//sweet.show
    };
    //$scope.logout(); //mirelease
    /**
     * Description
     * @method forcedLogout
     * @return 
     */
    $scope.forcedLogout = function(){
      loginService.logout($scope);
      //$location.path('/');
      RouteChanger.changeRoute('#/', $scope);//routechanger funciona después de un sweetalert
    };
    $scope.forcedLogout();

}]);//MainCtrl
