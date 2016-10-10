'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:AcademicosEvaluacionCtrl
 * @description
 * # AcademicosEvaluacionCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('EvaluarEvaluacionCtrl', ["$scope", "htp", "$location", "Academico", "Comision", "evaTools", "sweet", "alerts", function ($scope, htp, $location, Academico, Comision, evaTools, sweet, alerts) {
 	//$scope.log = $log;
  $scope.evaluacion = {};
  $scope.academico = Academico;
  $scope.comision = Comision;
  $scope.evaluacion.argumento = '';
  $scope.nombres={};
  $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos
  $scope.nota = 0;//nota final
  $scope.escala = '';
  $scope.validacion=false;//valida las celdas y el text area
  $scope.columns = ['% TIEMPO ASIGNADO A TAREAS PROGRAMADAS',
  'E', 'MB', 'B', 'R', 'D', '% T x C / 100'];
  //el arreglo rows también se utiliza para almacenar la nota correspondiente a la actividad
  $scope.rows = ['1.  Actividades de Docencia', '2.  Actividades de Investigación', '3. Extensión y Vinculación',
  '4. Administración Académica', '5.  Otras Actividades Realizadas'];
  $scope.cells = {};//todos los valores posibles de la tabla de evaluación

  /*
  * Maneras de referirse a una celda en particular
  * scope.cells[column+row];//ambas son variables
  * $scope.cells['% TIEMPO ASIGNADO A TAREAS PROGRAMADAS1.  Actividades de Docencia'];  //se ve feo porque son dos strings concatenadas
  * $scope.cells[$scope.columns[0]+row];//solo row es variable
  * $scope.cells[$scope.columns[6]+row] = $scope.cells[column+row];
  * $scope.cells[$scope.columns[6]+row] = ($scope.cells[$scope.columns[$scope.columns.indexOf(column)]+$scope.rows[$scope.rows.indexOf(row)]]);
  *
  */

  for (var i = $scope.rows.length - 1; i >= 0; i--) {//inicializamos nuestro sistema
      $scope.rows[$scope.rows[i]]='';//inicializamos la nota correspondiente a la fila
      for (var j = $scope.columns.length - 1; j >= 0; j--) {
        $scope.cells[$scope.columns[j]+$scope.rows[i]]='';//pone en '' todos los valores de la tabla de evaluación  
      };
  };


  htp.get('facultades/facultades.php?action=verUna&cod_facultad='+$scope.academico.cod_facultad)
  .then(function(response){
    if(response){
      $scope.nombres.nombreFacultad=response.data.records[0].nombre;
    }
  });//htp
  htp.get('departamentos/departamentos.php?action=verUna&cod_departamento='+$scope.academico.cod_departamento)
  .then(function(response){
    if(response){
      $scope.nombres.nombreDepartamento=response.data.records[0].nombre;
    }
  });//htp


  switch(''){//todavía no encontramos algo que itere los atributos
    case $scope.academico.nombres:
    $scope.academico.nombres = 'Sin Definir';
    case $scope.academico.apellidos:
    $scope.academico.apellidos = 'Sin Definir';
    case $scope.academico.cod_facultad:
    $scope.academico.cod_facultad = 'Sin Definir'
    case $scope.academico.cod_departamento:
    $scope.academico.cod_departamento = 'Sin Definir';
    case $scope.academico.tituloProfesional:
    $scope.academico.tituloProfesional = 'Sin Definir';
    case $scope.academico.horas:
    $scope.academico.horas = 'Sin Definir';
    case $scope.academico.categoria:
    $scope.academico.categoria = 'Sin Definir';
    case $scope.academico.gradoAcademico:
    $scope.academico.gradoAcademico = 'Sin Definir';
    case $scope.academico.tipoPlanta:
    $scope.academico.tipoPlanta = 'Sin Definir';
    case $scope.academico.calificacionAnterior:
    $scope.academico.calificacionAnterior = 'Sin Definir';
    case $scope.academico.estado:
    $scope.academico.estado = 'Sin Definir';
  }


  

  
  $scope.calcularNotaFinal = function() {
    evaTools.calcularNotaFinal($scope);
  };//calcularNotaFinal

  $scope.validar = function(invalido, pristine, column, row){
    evaTools.validar($scope, invalido, pristine, column, row);
  };//validar

  $scope.recortarValores = function(column, row){//recorta (trunca) los valores que van dentro de la matriz
    evaTools.recortarValores($scope, column, row);
  };//recortarValores

  $scope.compute = function(row){//realiza las acciones cada vez que se hace un cómputo
    evaTools.compute($scope, row);//computa la nota ponderada para cada fila
    evaTools.tope($scope);//verificamos si no se ha exedido el 100% cada que computamos
  };//compute

  $scope.move = function(column, row) {//evaluar
    evaTools.move($scope, column, row);
  };//move

/*A continucaión, para la función guardar,
todos y cada uno de los datos son necesarios,
si bien, alguno de estos pueden ser recalculables
a partir del mismo modelo, los criterios de evaluación
podrían cambiar a futuro, y podrían estropearno algunos de
los cálculos*/
$scope.evaluar = function(){
  $scope.sending=true;
  $scope.evaluacion.rutAcademico = $scope.academico.rut;
  $scope.evaluacion.nombresAcademico = $scope.academico.nombres;
  $scope.evaluacion.apellidosAcademico = $scope.academico.apellidos;
  $scope.evaluacion.cod_facultad = $scope.academico.cod_facultad;
  $scope.evaluacion.cod_departamento = $scope.academico.cod_departamento;
  $scope.evaluacion.tituloProfesionalAcademico = $scope.academico.tituloProfesional;
  $scope.evaluacion.horasAcademico = $scope.academico.horas;
  $scope.evaluacion.categoriaAcademico = $scope.academico.categoria;
  $scope.evaluacion.gradoAcademico = $scope.academico.gradoAcademico;
  $scope.evaluacion.tipoPlantaAcademico = $scope.academico.tipoPlanta;
  $scope.evaluacion.calificacionAnteriorAcademico = $scope.academico.calificacionAnterior;
  $scope.evaluacion.tiempo1 = $scope.cells[$scope.columns[0]+$scope.rows[0]];
  $scope.evaluacion.tiempo2 = $scope.cells[$scope.columns[0]+$scope.rows[1]];
  $scope.evaluacion.tiempo3 = $scope.cells[$scope.columns[0]+$scope.rows[2]];
  $scope.evaluacion.tiempo4 = $scope.cells[$scope.columns[0]+$scope.rows[3]];
  $scope.evaluacion.tiempo5 = $scope.cells[$scope.columns[0]+$scope.rows[4]];
  $scope.evaluacion.nota1 = $scope.rows['1.  Actividades de Docencia'];//recordar que la nota sin ponderar 
  $scope.evaluacion.nota2 = $scope.rows['2.  Actividades de Investigación'];//^la guardamos derechamente en 
  $scope.evaluacion.nota3 = $scope.rows['3. Extensión y Vinculación'];//^el array rows, y no en las 
  $scope.evaluacion.nota4 = $scope.rows['4. Administración Académica'];//^celdas ya que estas cambian
  $scope.evaluacion.nota5 = $scope.rows['5.  Otras Actividades Realizadas'];//^de posición
  $scope.evaluacion.ponderado1 = $scope.cells[$scope.columns[6]+$scope.rows[0]];
  $scope.evaluacion.ponderado2 = $scope.cells[$scope.columns[6]+$scope.rows[1]];
  $scope.evaluacion.ponderado3 = $scope.cells[$scope.columns[6]+$scope.rows[2]];
  $scope.evaluacion.ponderado4 = $scope.cells[$scope.columns[6]+$scope.rows[3]];
  $scope.evaluacion.ponderado5 = $scope.cells[$scope.columns[6]+$scope.rows[4]];
  $scope.evaluacion.rutComision = $scope.comision.rut;
  $scope.evaluacion.miembro1Comision = $scope.comision.miembro1;
  $scope.evaluacion.miembro2Comision = $scope.comision.miembro2;
  $scope.evaluacion.decanoComision = $scope.comision.decano;
  $scope.evaluacion.inicioPeriodo = 'inicioPeriodo';//se modifica cuando se cierra el periodo
  $scope.evaluacion.finPeriodo = 'finPeriodo';
  $scope.evaluacion.fecha = 'fecha';
  $scope.evaluacion.argumento = $scope.evaluacion.argumento.replace(/\n/g, '-nl-');//espacios arruinan formato json
  $scope.evaluacion.notaFinal = $scope.nota;

  var url = 'evaluaciones/evaluaciones.php?action=evaluarAcademico';
  htp.post(url, $scope.evaluacion)
  .then(function(response){
    if(response){
      sweet.show(alerts.dinamic(response.data));
      $location.path('/evaluaciones/facultad');
    }
    $scope.sending=false;
  });//.then

};//guardar

}]);