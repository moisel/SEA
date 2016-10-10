'use strict';

/**
 * @ngdoc overview
 * @name seaApp
 * @description
 * # seaApp
 *
 * Main module of the application.
 */
(function() {
 var app = angular
 .module('seaApp', [
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'platanus.rut',
  'nvd3',
  'hSweetAlert'
  ]);
 app.config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {
  $compileProvider.debugInfoEnabled(false);
  $routeProvider
  .when('/', {
    /*templateUrl: 'views/main.html',*/
    controller: 'MainCtrl'
  })
  .when('/error', {
    templateUrl: '/404.html',
  })
  .when('/academicos/main', {
    templateUrl: 'views/academicos/main.html',
    controller: 'AcademicosMainCtrl'
  })
  .when('/academicos/nuevo', {
    templateUrl: 'views/academicos/nuevo.html',
    controller: 'AcademicosNuevoCtrl'
  })
  .when('/academicos/edicion', {
    templateUrl: 'views/academicos/edicion.html',
    controller: 'AcademicosEdicionCtrl'
  })
  .when('/comisiones/main', {
    templateUrl: 'views/comisiones/main.html',
    controller: 'ComisionesMainCtrl'
  })
  .when('/comisiones/nuevo', {
    templateUrl: 'views/comisiones/nuevo.html',
    controller: 'ComisionesNuevoCtrl'
  })
  .when('/comisiones/edicion', {
    templateUrl: 'views/comisiones/edicion.html',
    controller: 'ComisionesEdicionCtrl'
  })
  .when('/facultades/main', {
    templateUrl: 'views/facultades/main.html',
    controller: 'FacultadesMainCtrl'
  })
  .when('/facultades/nuevo', {
    templateUrl: 'views/facultades/nuevo.html',
    controller: 'FacultadesNuevoCtrl'
  })
  .when('/facultades/edicion', {
    templateUrl: 'views/facultades/edicion.html',
    controller: 'FacultadesEdicionCtrl'
  })
  .when('/departamentos/main', {
    templateUrl: 'views/departamentos/main.html',
    controller: 'DepartamentosMainCtrl'
  })
  .when('/departamentos/nuevo', {
    templateUrl: 'views/departamentos/nuevo.html',
    controller: 'DepartamentosNuevoCtrl'
  })
  .when('/departamentos/edicion', {
    templateUrl: 'views/departamentos/edicion.html',
    controller: 'DepartamentosEdicionCtrl'
  })
  .when('/usuarios/main', {
    templateUrl: 'views/usuarios/main.html',
    controller: 'UsuariosMainCtrl'
  })
  .when('/usuarios/nuevo', {
    templateUrl: 'views/usuarios/nuevo.html',
    controller: 'UsuariosNuevoCtrl'
  })
  .when('/usuarios/edicion', {
    templateUrl: 'views/usuarios/edicion.html',
    controller: 'UsuariosEdicionCtrl'
  })
  .when('/configuraciones/main', {
    templateUrl: 'views/configuraciones/main.html',
    controller: 'ConfiguracionesMainCtrl'
  })
  .when('/evaluaciones/facultades', {
    templateUrl: 'views/evaluaciones/facultades.html',
    controller: 'EvaluarFacultadesCtrl'
  })
  .when('/evaluaciones/facultad', {
    templateUrl: 'views/evaluaciones/facultad.html',
    controller: 'EvaluarFacultadCtrl'
  })
  .when('/evaluaciones/evaluacion', {
    templateUrl: 'views/evaluaciones/evaluacion.html',
    controller: 'EvaluarEvaluacionCtrl'
  })
  .when('/evaluaciones/terminado', {
    templateUrl: 'views/evaluaciones/terminado.html',
    controller: 'EvaluacionesTerminadoCtrl'
  })
  .when('/reportes/facultades', {
    templateUrl: 'views/reportes/facultades.html',
    controller: 'ReportesFacultadesCtrl'
  })
  .when('/reportes/facultad', {
    templateUrl: 'views/reportes/facultad.html',
    controller: 'ReportesFacultadCtrl'
  })
  .when('/usuarios/perfil', {
    templateUrl: 'views/usuarios/perfil.html',
    controller: 'UsuariosPerfilCtrl'
  })
  .when('/evaluaciones/edicion', {
    templateUrl: 'views/evaluaciones/edicion.html',
    controller: 'EvaluacionesEdicionCtrl'
  })
  .when('/graficos/facultad', {
    templateUrl: 'views/graficos/facultad.html',
    controller: 'GraficosFacultadCtrl'
  })
  .when('/graficos/facultades', {
    templateUrl: 'views/graficos/facultades.html',
    controller: 'GraficosFacultadesCtrl'
  })
  .when('/graficos/academico', {
    templateUrl: 'views/graficos/academico.html',
    controller: 'GraficosAcademicoCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);//routeProvider
app.run(['$rootScope', '$location', 'loginService', 'hideFactory', 'periodoService', function($rootScope, $location, loginService, hideFactory, periodoService){

  //RELEASE
  //var routePermisson=['comisiones/main'];//ruta que requiera de login
  var disponibleSoloConPeriodoActivo=['/evaluaciones/facultades', '/evaluaciones/facultad', '/evaluaciones/evaluacion'];//rutas que requieran de un periodo activo
  var disponibleSinLogin=['/'];//rutas que no requieran de un login
  var disponibleSoloParaAdmin=['/configuraciones/main',
   '/evaluaciones/facultades', '/reportes/facultades', '/graficos/facultades',
  '/departamentos/edicion', '/departamentos/main', '/departamentos/nuevo',
   '/facultades/edicion', '/facultades/main', '/facultades/nuevo',
   '/usuarios/edicion', '/usuarios/main', 'usuarios/nuevo'];//rutas que solo pueden acceder los administradores
  $rootScope.$on('$routeChangeStart', function(){
   // alert('indexOf->'+disponibleSinLogin.indexOf($location.path())+' | '+$location.path()+'<-path');
    if ( disponibleSinLogin.indexOf($location.path()) == -1 ) {//si entramos a algo que requiere login
      loginService.islogged().then(function(response){
     //   alert('response checksession.js: '+response.data);
     if(response.data!=1){
      $location.path('/');  
    }
  });
    }
    //alert(disponibleSoloConPeriodoActivo.indexOf($location.path()));
    if ( disponibleSoloConPeriodoActivo.indexOf($location.path()) != -1 ) {//si entramos a algo que requiera de un periodo activo
      periodoService.getState().then(function(response){
        //alert('response app.js: '+response.data);
        //console.log(response);
        if(parseInt(response.data)==1){
           
        }else{
		$location.path('/evaluaciones/terminado'); 
	}
      });
    }
        //alert('soloParaAdmin->'+disponibleSoloParaAdmin.indexOf($location.path()));
        //alert('hideFactory.adminContent->'+hideFactory.adminContent);
    if ( (disponibleSoloParaAdmin.indexOf($location.path()) != -1)
    && hideFactory.adminContent ) {//si debemos esconder el contenido para admin, esta variable estará en true
      //^quiere decir que estamos intentando ingresar como secretario a una zona resttringida
      switch($location.path()){
        case '/evaluaciones/facultades'://no puede elegir entre facultades
        $location.path('/evaluaciones/facultad');
        break;
        case '/reportes/facultades':
        $location.path('/reportes/facultad');
        break;
        case '/graficos/facultades':
        $location.path('/graficos/facultad');
        break;
        default:
        $location.path('/error');
        break;
      }
    }
  });

}]);
}.call(this));
