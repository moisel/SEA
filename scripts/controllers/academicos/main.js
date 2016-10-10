'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:AcademicosMainCtrl
 * @description
 * # AcademicosMainCtrl
 * Controller of the seaApp
 */
angular.module('seaApp')
.controller('AcademicosMainCtrl', ["$scope", "Academico", "$location", "htp", function ($scope, Academico, $location, htp) {
/////////////cambiando pk por nombre/////////////
  $scope.array = [];//guardará tanto el arreglo de facultades como el de departamento
  $scope.array.facultades = [];//arreglo de facultades
  $scope.showSpinner=true;//inicializamos una varable para mostrar/ocultar el spinner
  $scope.academicos=[];//contedrá la colección de académicos
  $scope.datafactory = Academico;//nos sirve para pasarle un académico a otros controladores
  $scope.curPage = 0;//para paginador
  $scope.pageSize = 5;//tamanio página

  htp.get('facultades/facultades.php?action=ver')
  .then(function(response){
    var aux = response.data.records;
    angular.forEach(aux, function(value){
      $scope.array.facultades[value.cod_facultad]=value.nombre;//hacemos coincidir la pk con el index del array
    });//angular.foreach
  });//then
  $scope.array.departamentos = [];//arreglo de departamentos
  htp.get('departamentos/departamentos.php?action=ver')
  .then(function(response){
    var aux = response.data.records;
    angular.forEach(aux, function(value){
      $scope.array.departamentos[value.cod_departamento]=value.nombre;//hacemos coincidir la pk con el index del array
    });//angular.foreach
  });//then
/////////////fin cambiando pk por nombre/////////////


  $scope.reload = function(){
  $scope.showSpinner=true;
  htp.get('academicos/academicos.php?action=ver')
  .then(function(response){
      if(response){
        $scope.academicos = response.data.records;
      }
      $scope.showSpinner=false;
    });//.then
  };//reload
  $scope.reload();    


  $scope.editar = function(academico){
    $scope.datafactory.rut = academico.rut,
    $scope.datafactory.nombres = academico.nombres,
    $scope.datafactory.apellidos = academico.apellidos,
    $scope.datafactory.cod_facultad = academico.cod_facultad,
    $scope.datafactory.cod_departamento = academico.cod_departamento,
    $scope.datafactory.tituloProfesional = academico.tituloProfesional,
    $scope.datafactory.horas = parseInt(academico.horas),
    $scope.datafactory.categoria = academico.categoria,
    $scope.datafactory.gradoAcademico = academico.gradoAcademico,
    $scope.datafactory.tipoPlanta = academico.tipoPlanta,
    $scope.datafactory.calificacionAnterior = academico.calificacionAnterior,
    $scope.datafactory.estado = academico.estado;

    $location.path('/academicos/edicion');

  };//editar

  $scope.ordenarPor = function(orden){
    $scope.ordenSeleccionado = orden;
  };

  $scope.numberOfPages = function() 
  {
    return Math.ceil($scope.academicos.length / $scope.pageSize);
  };
}]);

