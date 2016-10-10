'use strict';

/**
 * @ngdoc service
 * @name seaApp.loginService
 * @description
 * # loginService
 * Service in the seaApp.
 */

 angular.module('seaApp')
 .service('loginService', ["$http", "$location", "sessionService", "configService", "sha1", "sweet", "alerts", function ($http, $location, sessionService, configService, sha1, sweet, alerts) {
   return{
    login: function(user, scope){
      
      var sendUsr={};
      sendUsr.email=user.email;
      sendUsr.pass=sha1.of(user.pass);
      
      $http.post(configService.url()+'login.php', sendUsr)
      .then(function(msg){

        var token = msg.data.token;
        if(token){
         sessionService.set('user', token);
         if(msg.data.permiso === 'Administrador'){
          scope.hide.adminContent = false;
        }
              scope.hide.mainContent = false; //dejamos de esconder cosas
              scope.showMainSpinner=false;//el spinner se va
              user.pass='';
              $location.path('/graficos/facultades');
            }else{
              scope.showMainSpinner=false;//el spinner se va
              scope.mensajeParaUsuario='Correo o contraseña inválidos';
            }
        }, function(response){//en caso de haber problemas con la conexión
          sweet.show(alerts.error());
          scope.showMainSpinner=false;//el spinner se va
          scope.mensajeParaUsuario='Error: Intentelo de nuevo más tarde';
        });//.then
    },//login
        logout: function(scope){//
          //scope.hide = hideFactory;
          //console.log('chekeamos si la sess se destruyó ANTES: '+sessionService.get('user'));
          scope.hide.mainContent = true;
          scope.hide.adminContent = true;
          sessionService.destroy('user');
          //console.log('chekeamos si la sess se destruyó DESPUÉS: '+sessionService.get('user'));
          
          //alert(scope.hide.adminContent);
          
        },
        islogged: function(){//pregunta si la key todavía sirve
          /*var $checkSessionServer=$http.post(configService.url()+'checksession.php?userToken='+sessionService.get('user'));
          return $checkSessionServer;*/
          var promise = $http.get(configService.url()+'checksession.php?userToken='+sessionService.get('user'))
          .then(function (response) {
            return response;
          });
          return promise;

          //if(sessionService.get('user')) return true;
          //else return false;
        }
      }//return
 }]);//loginService
