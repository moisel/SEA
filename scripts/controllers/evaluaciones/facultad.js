'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:EvaluarFacultadCtrl
 * @description Submódulo encargado de presentar al usuario una lista con académicos existentes para
 * evaluar/editar la pauta de evaluación según corresponda. Además, este controlador debe permitir alguna
 * de estas acciones si existe a lo menos una comisión seleccionada (tarea que se realiza dentro de
 * este mismo controlador)
 * # EvaluarFacultadCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('EvaluarFacultadCtrl', 
  ["$scope", "Facultad", "Comision", "Academico", "$location", "hideFactory", "htp", "sweet", "alerts", "RouteChanger", function ($scope, Facultad, Comision, Academico, $location, hideFactory, htp, sweet, alerts, RouteChanger) {
  
  $scope.datafactoryComision = Comision; // usado para almacenar la comisión seleccionada con el radio button
  
  $scope.datafactoryAcademico = Academico // usado para almacenar el academico seleccionado
  
  $scope.curPage = 0; // página en la que se encuentra el usuario actualmente en la grilla
  
  $scope.pageSize = 5; // cantidad de elementos a mostrar por cada página de la grilla

  $scope.academicos = []; // objeto que almacenará una colección con académicos existentes
  
  $scope.datafactoryFacultad = {}; // objeto enlazado a la fábrica, para compartir datos entre controladores
  
  $scope.datafactoryFacultad.cod_facultad = ''; // en caso de ser usuario secretario, se necesita inicializar este atributo
  
  $scope.hideRadios = false; // esconde los radios si hay solo una o menos comisiones
  
  $scope.existeComisionSeleccionada = false; // no deja entrar a evaluar/editar una evaluación mientras no exista una comisión seleccionada.
  
  $scope.alertaSinComisiones = true; // nos permite mostrar un mensaje si no existen comisiones para seleccionar

  if(!hideFactory.adminContent){ // si estamos logueado con un Usuario Administrador
      $scope.datafactoryFacultad = Facultad; // tomamos la facultad que elegimos
  }//if(!hideFactory.adminContent)
  
  /////////////cambiando pk por nombre/////////////
  $scope.array = []; // guardará tanto el arreglo de facultades como el de departamento
  $scope.array.facultades = []; // arreglo de facultades
  htp.get('facultades/facultades.php?action=ver')
  .then(function(response){
    var aux = response.data.records;
    angular.forEach(aux, function(value){
      $scope.array.facultades[value.cod_facultad]=value.nombre; // hacemos coincidir la pk con el index del array
    });//angular.foreach
  });//then
  $scope.array.departamentos = []; // arreglo de departamentos
  htp.get('departamentos/departamentos.php?action=ver')
  .then(function(response){
    var aux = response.data.records;
    angular.forEach(aux, function(value){
      $scope.array.departamentos[value.cod_departamento]=value.nombre; // hacemos coincidir la pk con el index del array
    });//angular.foreach
  });//then
  /////////////fin cambiando pk por nombre/////////////
    
    /**
     * Método que carga las distintas comisiones desde un recurso, 
     * el usuario puede llamar a este método directamente pero se ejecuta mínimo una vez
     * si el back-end arroja una sóla comisión, este método además llamará al método 
     * seleccionarComision para seleccionarla de manera automática
     * @method reloadComisiones
     */
      $scope.reloadComisiones = function(){
        $scope.showSpinnerComisiones=true;
        $scope.alertaSinComisiones=true;
        htp.get('comisiones/comisiones.php?action=comisionesActivas&cod_facultad='+$scope.datafactoryFacultad.cod_facultad)
        .then(function(response){
          if(response){
            $scope.comisiones = response.data.records;
            if($scope.comisiones.length===1){
              $scope.hideRadios=true;
              $scope.seleccionarComision($scope.comisiones[0]);
            }
            if($scope.comisiones.length>0){
              $scope.alertaSinComisiones=false;
            }
          }//if(response)
          $scope.showSpinnerComisiones=false;
        });//.then
      };//reloadComisiones
    
    $scope.reloadComisiones();
    
    /**
     * Método que carga los distintos académicos desde un recurso, 
     * el usuario puede llamar a este método directamente pero se ejecuta mínimo una vez
     * @method reload
     */
      $scope.reloadAcademicos = function(){
        $scope.showSpinnerAcademicos=true;
        htp.get('academicos/academicos.php?action=verActivos&cod_facultad='+$scope.datafactoryFacultad.cod_facultad)
        .then(function(response){
          if(response){
            $scope.academicos = response.data.records;
          }
          $scope.showSpinnerAcademicos=false;
      });//.then
    };//reloadAcademicos

    $scope.reloadAcademicos();
 	
 
  /**
   * Método que redirige al usuario a una nueva página para 
   * evaluar a un académico, si el académico ya ha sido evaluado
   * este método despliega un mensaje avisando que ya se ha evaluado
   * y pregunta al usuario si desea editar la evaluación en vez
   * @method evaluar
   * @param {object} academico objeto que representa al académico seleccionado
   */
  $scope.evaluar = function(academico){
    $scope.showSpinnerAcademicos = true;
    if($scope.existeComisionSeleccionada){ // antes que todo, debemos ver si se ha seleccionado alguna comisión
      var url='evaluaciones/evaluaciones.php?action=verEvaluacion&rutAcademico='+academico.rut+'&inicioPeriodo=inicioPeriodo';
      htp.get(url)
      .then(function(response){ // luego vemos si se ha evaluado previamente
        if(response){
          if(response.data.records[0]){

            sweet.show(alerts.choose('Desea editar la evaluación? (Se trabajará con la Comisión elegida en caso de existir más de una)', 'Este Académico ya ha sido Evaluado!', true),
            function(){
              $scope.seleccionarAcademico(academico);
              RouteChanger.changeRoute('#/evaluaciones/edicion', $scope); // $location no funciona después de un sweet alert
            });//sweet.show

          }else{

            $scope.seleccionarAcademico(academico);
            $location.path('/evaluaciones/evaluacion');

          }//else
        }//if(response)
        $scope.showSpinnerAcademicos=false;
      });//.then
    }else{
      sweet.show(alerts.dinamicError('Se debe seleccionar una comisión'));
      $scope.showSpinnerAcademicos=false;
    }
  };

 /**
  * Método que enlaza los datos de un académico con los de la fábrica para compartir etre controladores
  * además desbloquea la opción de evaluar a un académico si se ha seleccionado una comisión
  * @method seleccionarComision
  * @param {object} comision objeto que representa a la comisión seleccionada
  */
 $scope.seleccionarComision = function(comision){
    $scope.existeComisionSeleccionada = true;
    $scope.datafactoryComision.anio = comision.anio;
    $scope.datafactoryComision.cod_facultad = comision.cod_facultad;
    $scope.datafactoryComision.rut = comision.rut;
    $scope.datafactoryComision.decano = comision.decano;
    $scope.datafactoryComision.miembro1 = comision.miembro1;
    $scope.datafactoryComision.miembro2 = comision.miembro2;
    $scope.datafactoryComision.fechaPie = new Date(comision.fechaPie);
    $scope.datafactoryComision.estado = comision.estado;
  };
   /**
    * Método que enlaza los datos de un académico con los de la fábrica para compartir entre controladores
    * @method editar
    * @param {object} academico Objeto que representa al Académico seleccionado
    */
  $scope.seleccionarAcademico = function(academico){
    $scope.datafactoryAcademico.rut = academico.rut,
    $scope.datafactoryAcademico.nombres = academico.nombres,
    $scope.datafactoryAcademico.apellidos = academico.apellidos,
    $scope.datafactoryAcademico.cod_facultad = academico.cod_facultad,
    $scope.datafactoryAcademico.cod_departamento = academico.cod_departamento,
    $scope.datafactoryAcademico.tituloProfesional = academico.tituloProfesional,
    $scope.datafactoryAcademico.horas = parseInt(academico.horas),
    $scope.datafactoryAcademico.categoria = academico.categoria,
    $scope.datafactoryAcademico.gradoAcademico = academico.gradoAcademico,
    $scope.datafactoryAcademico.tipoPlanta = academico.tipoPlanta,
    $scope.datafactoryAcademico.calificacionAnterior = academico.calificacionAnterior,
    $scope.datafactoryAcademico.estado = academico.estado;
  };//seleccionarAcademico

  /**
   * Método que calcula el número de paginas que contendrá la grilla principal
   * de acuerdo a la cantidad de elementos almacenados en $scope.academicos
   * @method numberOfPages
   * @return CallExpression
   */
  $scope.numberOfPages = function(){
    return Math.ceil($scope.academicos.length / $scope.pageSize);
  };//$scope.numberOfPages
}]);
