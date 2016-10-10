'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:GraficosAcademicoCtrl
 * @description
 * # GraficosAcademicoCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('GraficosAcademicoCtrl', ["$scope", "Academico", "htp", "comboLoader", function ($scope, Academico, htp, comboLoader) {
  $scope.datafactoryAcademicio = Academico;
  $scope.sending=true;//muestra spinners mientras se esperan Datos

  $scope.periodosSeleccion=[];//llenaremos con nombres de periodos existentes;
  $scope.cargarComboboxPeriodos = function(){
    comboLoader.periodo()
    .then(function(response){
      if(response){
        $scope.periodosSeleccion=response;
      }
    });//.then
  };//cargarComboboxPeriodos
  $scope.cargarComboboxPeriodos();

  $scope.options1 = {//opciones para el gráfico circular
   chart: {
    type: 'pieChart',
    height: 400,
    x: function(d){return d.key;},
    y: function(d){return d.y;},
    showLabels: false,//muestra los labels EN el gráfico 
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

var switchUrl = function(){//función que devuelve una url de acuerdo a los combobox y también cambia la explicación del gráfico
  var periodo = ($scope.periodo!=='Seleccionar Periodo');
  var baseUrl = 'evaluaciones/evaluaciones.php?action='
  switch(true){

    case !periodo://si no seleccionó un período
    $scope.explain = 'Distribución de tiempo hacia una actividad determinada durante todos los años'
    return baseUrl+'evaluacionesAcademico&rutAcademico='+$scope.datafactoryAcademicio.rut;

    case periodo://si sólo hemos elegido un periodo
    $scope.explain = 'Distribución de tiempo hacia una actividad determinada para el año '+$scope.periodo;
    return baseUrl+'verEvaluacion&rutAcademico='+$scope.datafactoryAcademicio.rut+'&inicioPeriodo='+$scope.periodo;

  }//switch
}//switchUrl

var act1=0;
var act2=0;
var act3=0;
var act4=0;
var act5=0;
$scope.periodo='Seleccionar Periodo';
$scope.reloadChartData = function(){//carga los datos para el gráfico circular
  $scope.sending=true;
  var url = switchUrl();
  act1=0;//reiniciamos los contadores
  act2=0;
  act3=0;
  act4=0;
  act5=0;
  htp.get(url)
  .then(function(response){
    if(response){
      if(response.data.records[0]){//si llegó algo 
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
    $scope.data1 = [
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
    $scope.sending=false;//este gráfico es el que esconde los spinners
  });//.then(function(response)
};//reloadChartData
$scope.reloadChartData();


$scope.options2 = {//opciones para el gráfico de barras
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
    axisLabel: 'Periodo'
  },
  yAxis: {
    axisLabel: 'Notas',
    axisLabelDistance: 30
  },
  noData: 'No Hay Datos Disponibles'
}
};

$scope.values= [];
 	$scope.data2 = [{values: $scope.values}];//información para el chart
 	$scope.loadChartData = function(){//carga los datos para el gráfico de barras
     htp.get('evaluaciones/evaluaciones.php?action=evaluacionesAcademico&rutAcademico='+$scope.datafactoryAcademicio.rut)
     .then(function(response){
      if(response){
        if(response.data.records[0]){//si llegó algo
           $scope.evaluaciones = response.data.records;
           angular.forEach($scope.evaluaciones, function(evaluacion){
            if(evaluacion.notaFinal && evaluacion.inicioPeriodo!=0){
             $scope.values.push({"label":evaluacion.inicioPeriodo, "value":evaluacion.notaFinal});
    			  		}//if
    		    });//angular.forEach
        }//if(response.data.records[0]){//si llegó algo
      }//if(response)
		 });//.then
	 };//loadChartData
  $scope.loadChartData();
}]);//GraficosAcademicoCtrl
