'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:GraficosFacultadCtrl
 * @description Submódulo encargado de presentar dos gráficos, uno de torta, con la 
 * Distribución de tiempo de la Facultad/Departamente durante todos/x años.
 * y otro con Notas Finales Históricas de los académicos de la Facultad/Departamento para el año x
 * # GraficosFacultadCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('GraficosFacultadCtrl', ["$scope", "$location", "Facultad", "Academico", "htp", "hideFactory", "comboLoader", function ($scope, $location, Facultad, Academico, htp, hideFactory, comboLoader) {

  $scope.array = []; // Guardará tanto el arreglo de facultades como el de departamento
  
  $scope.array.facultades = []; // arreglo de facultades
  
  $scope.changer = {}; // objeto que tendrá dos atributos:
                       // Departamento, que obtendrá el nombre {string} de un departamento desde un combobox
                       // Facultad, que obtendrá el nombre {string} de un facultad desde un combobox

  $scope.datafactoryFacultad = {}; // objeto enlazado a la fábrica, para compartir datos entre controladores
  
  $scope.datafactoryFacultad.cod_facultad = ''; // en caso de ser usuario secretario, se necesita inicializar este atributo
  
  $scope.datafactoryAcademico = Academico; // objeto enlazado a la fábrica, para compartir datos entre controladores
  
  $scope.academicos = []; // objeto que almacenará una colección con académicos existentes
  
  $scope.curPage = 0; // página en la que se encuentra el usuario actualmente en la grilla
  
  $scope.pageSize = 5; // cantidad de elementos a mostrar por cada página de la grilla
  
  $scope.sending = true; // muestra spinners mientras se esperan Datos
  
  $scope.explain2 = 'No hay Datos para Presentar'; // variable que almacenará la descripción del gráfico de ebarras

  /////////////cambiando pk por nombre/////////////
  htp.get('facultades/facultades.php?action=ver')
  .then(function(response){
    var aux = response.data.records;
    angular.forEach(aux, function(value){
      $scope.array.facultades[value.cod_facultad] = value.nombre; // hacemos coincidir la pk con el index del array
    });//angular.foreach
  });//then
  $scope.array.departamentos = []; // arreglo de departamentos
  htp.get('departamentos/departamentos.php?action=ver')
  .then(function(response){
    var aux = response.data.records;
    angular.forEach(aux, function(value){
      $scope.array.departamentos[value.cod_departamento] = value.nombre; // hacemos coincidir la pk con el index del array
    });//angular.foreach
  });//then
  /////////////fin cambiando pk por nombre/////////////

 	if(!hideFactory.adminContent){ // si estamos logueado con un admin
    	$scope.datafactoryFacultad = Facultad; // tomamos la facultad que elegimos
  } // if(!hideFactory.adminContent)
  // de lo contrario el servidor sabrá de donde tomamos la facultad

  $scope.departamentosSeleccion=[];
  /**
   * Método que carga el combobox de "Departamento" con el nopmbre de los departamentos existentes
   * @method cargarComboboxDepartamentos
   */
   $scope.cargarComboDepartamentos = function(){
    comboLoader.departamento($scope.datafactoryFacultad.cod_facultad)
    .then(function(response){
      if(response){
        $scope.departamentosSeleccion=response;
      }
    });//.then
  };//cargarComboDepartamentos
  $scope.cargarComboDepartamentos();

   $scope.periodosSeleccion=[];//llenaremos con nombres de periodos existentes;
  /**
   * Método que carga el combobox "Periodos" con una lista con 
   * los periodos evaluados.
   * @method cargarComboboxPeriodos
   */
   $scope.cargarComboboxPeriodos = function(){
    comboLoader.periodo()
    .then(function(response){
      if(response){
        $scope.periodosSeleccion=response;
      }
    });//.then
  };//cargarComboboxPeriodos
  $scope.cargarComboboxPeriodos();

  /**
   * Método que carga los distintos académicos desde un recurso, 
   * el usuario puede llamar a este método directamente pero se ejecuta mínimo una vez
   * @method reload
   */
   $scope.reload = function(){
    $scope.showSpinner = true;
    htp.get('academicos/academicos.php?action=verPorFacultad&cod_facultad='+$scope.datafactoryFacultad.cod_facultad)
    .then(function(response){
      $scope.academicos = response.data.records;
      $scope.showSpinner = false;
    });//.then
  };//reload
  $scope.reload();

  $scope.options = { // Opciones para el gráfico circular
    chart: {
      type: 'pieChart',
      height: 400,
      noData: 'No Hay Datos Disponibles',
      x: function(d){return d.key;},
      y: function(d){return d.y;},
      showLabels: false, // muestra los labels EN el gráfico 
      transitionDuration: 700,
      labelThreshold: 0.01,
      legend: {
      	margin: {
      		top: 5,
      		right: 35,
      		bottom: 5,
      		left: 0
      	}
      }
    }
  };

/**
   * Método que cambia la URL para hcaer la distinta petición al back-end
   * de acuerdo a lo elegido en el combobox Periodos y/o Departamento.
   * Además cambia la descripción del gráfico
   * @method switchUrl
   * return {string} URL que servirá para hacer la distinta petición al back-end
   */
  var switchUrl = function(){
    var periodo = ($scope.periodo!=='Seleccionar Periodo');
    var departamento = ($scope.departamento!=0);
    var baseUrl = 'evaluaciones/evaluaciones.php?action='
    switch(true){

      case !periodo && !departamento://si no seleccionó nada
      $scope.explain = 'Distribución de tiempo de la Facultad hacia una actividad determinada durante todos los años'
      return baseUrl+'verPorFacultad&cod_facultad='+$scope.datafactoryFacultad.cod_facultad;

      case periodo && !departamento://si sólo hemos elegido un periodo
      $scope.explain = 'Distribución de tiempo de la Facultad hacia una actividad determinada durante el año '+$scope.periodo;
      $scope.explain2 = 'Notas Finales Históricas de los académicos de la Facultad para el año '+$scope.periodo;
      return baseUrl+'verPeriodoFacultad&cod_facultad='+$scope.datafactoryFacultad.cod_facultad+'&inicioPeriodo='+$scope.periodo;

      case !periodo && departamento://si sólo hemos elegido un departamento
      $scope.explain = 'Distribución de tiempo del '+$scope.changer.departamento+' hacia una actividad determinada durante todos los años';
      return baseUrl+'verPorDepartamento&cod_departamento='+$scope.departamento;

      case periodo && departamento://si elegimos ambos
      $scope.explain = 'Distribución de tiempo del '+$scope.changer.departamento+' hacia una actividad determinada durante el año '+$scope.periodo;
      $scope.explain2 = 'Notas Finales Históricas de los académicos del '+$scope.changer.departamento+' para el año '+$scope.periodo;
      return baseUrl+'verPeriodoDepartamento&cod_departamento='+$scope.departamento+'&inicioPeriodo='+$scope.periodo;

    }//switch
  }//switchUrl

  var act1=0;
  var act2=0;
  var act3=0;
  var act4=0;
  var act5=0;
  $scope.periodo='Seleccionar Periodo';
  $scope.departamento=0;
  $scope.changer.periodo='Seleccionar Periodo';
  $scope.changer.departamento='Seleccionar Departamento';

  /**
   * Método que carga los datos al gráfico circular
   * @method loadPieChart
   */
   $scope.loadPieChart = function(){
    var url = switchUrl();
    act1=0; // reiniciamos los contadores
    act2=0;
    act3=0;
    act4=0;
    act5=0;
    htp.get(url)
    .then(function(response){
      if(response){
        if(response.data.records[0]){ // si llegó algo 
          $scope.evaluaciones = response.data.records;
          angular.forEach($scope.evaluaciones, function(evaluacion){
            var aux = parseFloat(evaluacion.horasAcademico);
            if(aux && evaluacion.inicioPeriodo!=0){
              if(evaluacion.tiempo1){act1 = act1+parseFloat((evaluacion.tiempo1/100)*aux);}
              if(evaluacion.tiempo2){act2 = act2+parseFloat((evaluacion.tiempo2/100)*aux);}
              if(evaluacion.tiempo3){act3 = act3+parseFloat((evaluacion.tiempo3/100)*aux);}
              if(evaluacion.tiempo4){act4 = act4+parseFloat((evaluacion.tiempo4/100)*aux);}
              if(evaluacion.tiempo5){act5 = act5+parseFloat((evaluacion.tiempo5/100)*aux);}
            }
          });//angular.forEach
        }else{//if(response.data.records[0])
          $scope.explain = 'No hay Datos para Presentar';
        }//else
      }//if(response)
      $scope.data = [
      {
        key: "1.  Actividades de Docencia",
        y: act1
      },
      {
        key: "2.  Actividades de Investigación",
        y: act2
      },
      {
        key: "3. Extensión y Vinculación",
        y: act3
      }
      ,
      {
        key: "4. Administración Académica",
        y: act4
      }
      ,
      {
        key: "5.  Otras Actividades Realizadas",
        y: act5
      }
      ];
      $scope.sending = false; // este gráfico es el que esconde los spinners
                              // <<sería bueno personalizar los spinners para cada gráfico>>
    });//.then(function(response)
  };//loadPieChart
  $scope.loadPieChart();

$scope.options2 = { // opciones para el gráfico de barra
  chart: {
    type: 'discreteBarChart',
    height: 400,
    margin : {
      top: 20,
      right: 20,
      bottom: 60,
      left: 55
    },
    x: function(d){return d.label;},
    y: function(d){return d.value;},
    showValues: true,
    valueFormat: function(d){
      return d3.format(',.1f')(d);
    },
    transitionDuration: 500,
    xAxis: {
      axisLabel: 'Academicos'
    },
    yAxis: {
      axisLabel: 'Notas',
      axisLabelDistance: 30
    },
    noData: 'No Hay Datos Disponibles'
  }//chart
};//options2

$scope.values=[];
$scope.data2 = [{values: $scope.values}]; // información para el chart
/**
 * Método que carga los datos para elgráfico de barra
 * @method loadDiscreteChart
 */
 $scope.loadDiscreteChart = function(){
  $scope.values.length = 0; // se limpian los valores del arreglo values
  var url = switchUrl();
  if($scope.periodo!=='Seleccionar Periodo'){
    htp.get(url)
    .then(function(response){
      if(response){
        if(response.data.records[0]){//si llegó algo
          $scope.evaluaciones = response.data.records;
          angular.forEach($scope.evaluaciones, function(evaluacion){
            if(evaluacion.notaFinal && evaluacion.inicioPeriodo!=0){
             $scope.values.push({"label":evaluacion.nombresAcademico, "value":evaluacion.notaFinal});
            }//if
          });//angular.forEach
        }else{//if(response.data.records[0])
          $scope.explain2 = 'No hay Datos para Presentar';
        }//else
      }//if(response)
    });//.then
  }//if
};//loadDiscreteChart
$scope.loadDiscreteChart();

/**
 * Método que actualiza el gráfico circular
 * @method loadChartData
 * @param {string} argument variable que sirve para ver
 * con cuál combobox el usuario ha interactuado
 * (el usuario sólo interactúa con un combobox a la vez)
 * @param {string/int} changer Variable que almacena el valor del combobox
 * es una string para el combobox de departamento y un int para el de años
 */
 $scope.loadChartData = function(argument, changer){
  $scope.sending = true;
  switch(argument){
    case 'Departamento':
      if (changer === 'Seleccionar Departamento') { // bugfix en el server 
        $scope.departamento = 0; // bugfix (solo en el server) resetea la pk
      }else{
        $scope.departamento = $scope.departamentosSeleccion[changer]; // le pasamos la clave primaria, no el nombre (performance)
      }
      break;
      case 'Periodo':
      $scope.periodo = changer; // el año es la pk
      break;
      default:
      $scope.sending = false;
  }//switch
  $scope.loadPieChart();
  $scope.loadDiscreteChart();
};//loadChartData



/**
  * Método que enlaza los datos de un académico con los de la fábrica para compartir entre controladores
  * y redirige al usuario al submódulo para revisar los gráficos correspondientes a este
  * académico 
  * @method revisarAcademico
  * @param {object} academico Objeto que representa al Académico seleccionado
  */
  $scope.revisarAcademico = function(academico){
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

    $location.path('/graficos/academico');
  };//revisarAcademico
/**
 * Método que calcula el número de paginas que contendrá la grilla principal de acuerdo a la cantidad de elementos almacenados en $scope.académicos
 * @method numberOfPages
 * @return CallExpression
 */
 $scope.numberOfPages = function() 
 {
  return Math.ceil($scope.academicos.length / $scope.pageSize);
};
}]);
