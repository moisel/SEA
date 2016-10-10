'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:EvaluacionesEdicionCtrl
 * @description
 * # EvaluacionesEdicionCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('EvaluacionesEdicionCtrl', ["$scope", "$location", "Comision", "htp", "Academico", "evaTools", "evaFasteners", "sweet", "alerts", function ($scope, $location, Comision, htp, Academico, evaTools, evaFasteners, sweet, alerts) {
 	$scope.academico = Academico;
  $scope.comision = Comision;
 	$scope.evaluacion = {};
 	$scope.argumento = '';
  $scope.nombres={};
  $scope.sending=true;//bloquea botones y muestra spinners mientras se envían datos
  $scope.nota = 0;
  $scope.escala = '';
  $scope.columns = ['% TIEMPO ASIGNADO A TAREAS PROGRAMADAS',
  'E', 'MB', 'B', 'R', 'D', '% T x C / 100'];
  //el arreglo rows también se utiliza para almacenar la nota correspondiente a la actividad
  $scope.rows = ['1.  Actividades de Docencia', '2.  Actividades de Investigación', '3. Extensión y Vinculación',
  '4. Administración Académica', '5.  Otras Actividades Realizadas'];

  $scope.cells = {};//nos guarda los valores de la matriz
  /*
  * Maneras de referirse a una celda en particular
  * scope.cells[column+row];//ambas son variables
  * $scope.cells['% TIEMPO ASIGNADO A TAREAS PROGRAMADAS1.  Actividades de Docencia'];  //se ve feo porque son dos strings concatenadas
  * $scope.cells[$scope.columns[0]+row];//solo row es variable
  * $scope.cells[$scope.columns[6]+row] = $scope.cells[column+row];
  * $scope.cells[$scope.columns[6]+row] = ($scope.cells[$scope.columns[$scope.columns.indexOf(column)]+$scope.rows[$scope.rows.indexOf(row)]]);
  *
  */

  htp.get('facultades/facultades.php?action=verUna&cod_facultad='+$scope.academico.cod_facultad)
  .then(function(response){
    $scope.nombres.nombreFacultad=response.data.records[0].nombre;
  });//htp
  htp.get('departamentos/departamentos.php?action=verUna&cod_departamento='+$scope.academico.cod_departamento)
  .then(function(response){
    $scope.nombres.nombreDepartamento=response.data.records[0].nombre;
  });//htp

  
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
/*todos y cada uno de los datos son necesarios
si bien, alguno de estos pueden ser recalculables
a partir del mismo modelo, los criterios de evaluación
podrían cambiar a futuro, y podrían estropearno algunos de
los cálculos*/
$scope.guardar = function(){
  $scope.sending=true;
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
  	$scope.evaluacion.argumento = $scope.evaluacion.argumento.replace(/\n/g, '-nl-');//espacios arruinan formato json
  	$scope.evaluacion.notaFinal = $scope.nota;
    var url = 'evaluaciones/evaluaciones.php?action=editarEvaluacion';
    htp.put(url, $scope.evaluacion)
    .then(function(response){
      if(response){
        $location.path('/evaluaciones/facultad');
      }
      $scope.sending=false;
    });//.then
  };//guardar

  var url = 'evaluaciones/evaluaciones.php?action=verEvaluacion&rutAcademico='+$scope.academico.rut+'&inicioPeriodo=inicioPeriodo';
  htp.get(url)
  .then(function(response){
    if(response){
      if(!response.data.records[0]){
        sweet.show(alerts.dinamicError('Academico Sin Evaluación'));
        $location.path('/evaluaciones/facultades');
      }else{
        $scope.evaluacion = response.data.records[0];
        /*Timpos Ponderados*/
        $scope.cells[$scope.columns[0]+$scope.rows[0]] = parseFloat($scope.evaluacion.tiempo1);
        $scope.cells[$scope.columns[0]+$scope.rows[1]] = parseFloat($scope.evaluacion.tiempo2);
        $scope.cells[$scope.columns[0]+$scope.rows[2]] = parseFloat($scope.evaluacion.tiempo3);
        $scope.cells[$scope.columns[0]+$scope.rows[3]] = parseFloat($scope.evaluacion.tiempo4);
        $scope.cells[$scope.columns[0]+$scope.rows[4]] = parseFloat($scope.evaluacion.tiempo5);

        /*Notas donde Corresponden*/
          var aux = 0;//guardará las escalas de las notas
          aux = evaFasteners.selectorDeEscalas($scope.evaluacion.nota1);
          evaTools.limpia($scope, aux, $scope.rows[0], parseFloat($scope.evaluacion.nota1));//al limpiar aprovecha de poner la nota si pasamos una columna

          aux = evaFasteners.selectorDeEscalas($scope.evaluacion.nota2);
          evaTools.limpia($scope, aux, $scope.rows[1], parseFloat($scope.evaluacion.nota2));

          aux = evaFasteners.selectorDeEscalas($scope.evaluacion.nota3);
          evaTools.limpia($scope, aux, $scope.rows[2], parseFloat($scope.evaluacion.nota3));

          aux = evaFasteners.selectorDeEscalas($scope.evaluacion.nota4);
          evaTools.limpia($scope, aux, $scope.rows[3], parseFloat($scope.evaluacion.nota4));

          aux = evaFasteners.selectorDeEscalas($scope.evaluacion.nota5);
          evaTools.limpia($scope, aux, $scope.rows[4], parseFloat($scope.evaluacion.nota5));

          $scope.evaluacion.rutComision = $scope.comision.rut;
          $scope.evaluacion.miembro1Comision = $scope.comision.miembro1;
          $scope.evaluacion.miembro2Comision = $scope.comision.miembro2;
          $scope.evaluacion.decanoComision = $scope.comision.decano;
        }//else
    }//if(response)
    $scope.sending=false;
});//.then
}]);//EvaluacionesEdicionCtrl
