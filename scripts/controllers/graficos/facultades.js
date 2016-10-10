'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:GraficosFacultadesCtrl
 * @description Submódulo sólo accesible por un Administrador, muestra un gráfico de torta con
 * la distribución de tiempo de las actividades que realizan los académicos y es completamente
 * moldeable de acuerdo a los combobox periodods, facultad y departamento
 * # GraficosFacultadesCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('GraficosFacultadesCtrl', ["$scope", "$location", "Facultad", "Academico", "htp", "comboLoader", function ($scope, $location, Facultad, Academico, htp, comboLoader) {

  $scope.sending = true; // muestra spinners mientras se esperan Datos
  
  $scope.changer = {}; // objeto que tendrá dos atributos:
                       // Departamento, que obtendrá el nombre {string} de un departamento desde un combobox
                       // Facultad, que obtendrá el nombre {string} de un facultad desde un combobox

  $scope.datafactoryFacultad = Facultad; // objeto enlazado a la fábrica, para compartir datos entre controladores
  
  $scope.datafactoryAcademico = Academico; // objeto enlazado a la fábrica, para compartir datos entre controladores

  $scope.curPage = 0; // página en la que se encuentra el usuario actualmente en la grilla
  
  $scope.pageSize = 5; // cantidad de elementos a mostrar por cada página de la grilla

  $scope.academicos = []; // objeto que almacenará una colección con académicos existentes
  
  $scope.facultades = []; // objeto que almacenará una colección con facultades existentes

  $scope.periodosSeleccion=[]; // llenaremos con nombres de periodos existentes

  $scope.departamentosSeleccion=[]; // llenaermos con departamentos existentes

/////////////cambiando pk por nombre/////////////
  $scope.array = [];//guardará tanto el arreglo de facultades como el de departamento
  $scope.array.facultades = [];//arreglo de facultades
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

  $scope.facultadesSeleccion=[];//
  /**
   * Método que carga el combobox 'Facultad' con las facultades existentes
   * @method cargarComboboxFacultades
   */
   $scope.cargarComboboxFacultades = function(){
     comboLoader.facultad()
     .then(function(response){
      if(response){
        $scope.facultadesSeleccion=response;
      }
    });
  };// fin cargarComboboxFacultades
  $scope.cargarComboboxFacultades();

  
  /**
   * Método que carga el combobox 'Departamento' con los departamentos existentes para
   * una facultad
   * @method cargarComboDepartamentos
   * @param {int} cod_facultad código de la facultad a la cual se le pedirán datos
   * para llenar un combobox
   */
   $scope.cargarComboDepartamentos = function(cod_facultad){
    comboLoader.departamento(cod_facultad)
    .then(function(response){
      if(response){
        $scope.departamentosSeleccion=response;
      }
    })//.then
  };//cargarComboDepartamentos

  $scope.cargarComboDepartamentos(0);


  /**
   * Método que carga el arreglo de académicos con los académicos 
   * activos en el sistema
   * @method reload1
   */
   $scope.reload1 = function(){
    $scope.showSpinner=true;
    htp.get('academicos/academicos.php?action=ver')
    .then(function(response){
      $scope.academicos = response.data.records;
      $scope.showSpinner=false;
    });
  };//reload1
  $scope.reload1();
  /**
   * Método que carga el arreglo de facultades con las facultades
   * activas en el sistema
   * @method reload2
   */
   $scope.reload2 = function(){
    $scope.showSpinner=true;
    htp.get('facultades/facultades.php?action=verActivas')
    .then(function(response){
      $scope.facultades = response.data.records;
      $scope.showSpinner=false;
    });
  };//reload2
  $scope.reload2();


  $scope.options = { // datos y configuraciones para el gráfico circular
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
 * de acuerdo a lo elegido en el combobox Periodos y/o Departamento y/o Facultad.
 * Además cambia la descripción del gráfico
 * @method switchUrl
 * return {string} URL que servirá para hacer la distinta petición al back-end
 */
 var switchUrl = function(){
  var periodo = ($scope.periodo!=='Seleccionar Periodo');
  var facultad = !($scope.facultad==0);
  var departamento = !($scope.departamento==0);

  var baseUrl = 'evaluaciones/evaluaciones.php?action='
  switch(true){
    case !periodo && !facultad && !departamento: // si los tres estan en 'Seleccionar *'
    $scope.explain = 'Distribución de tiempo de todos los académicos de la universidad hacia una actividad determinada durante todos los años';
    return baseUrl+'ver';

    case periodo && !facultad && !departamento: // si sólo hemos elegido un periodo
    $scope.explain = 'Distribución de tiempo de todos los académicos de la universidad hacia una actividad determinada para el año '+$scope.periodo;
    return baseUrl+'verPorPeriodo&inicioPeriodo='+$scope.periodo;

    case periodo && facultad && !departamento: // si no elegimos un departamento
    $scope.explain = 'Distribución de tiempo de todos los académicos pertenecientes a la '+$scope.changer.facultad+' hacia una actividad determinada para el año '+$scope.periodo;
    return baseUrl+'verPeriodoFacultad&cod_facultad='+$scope.facultad+'&inicioPeriodo='+$scope.periodo;

    case periodo && facultad && departamento:
    $scope.explain='Distribución de timepo de todos los académicos pertenecientes al '+$scope.changer.departamento+' hacia una actividad determinada para el año '+$scope.periodo;
    return baseUrl+'verPeriodoDepartamento&cod_departamento='+$scope.departamento+'&inicioPeriodo='+$scope.periodo;

    case !periodo && facultad && departamento:
    $scope.explain = 'Distribución de tiempo de todos los académicos pertenecientes al '+$scope.changer.departamento+' hacia una actividad determinada';
    return baseUrl+'verPorDepartamento&cod_departamento='+$scope.departamento

    case !periodo && facultad && !departamento: // si sólo eligió una facultad
    $scope.explain = 'Distribución de tiempo de todos los académicos pertenecientes a la '+$scope.changer.facultad+' hacia una actividad determinada';
    return baseUrl+'verPorFacultad&cod_facultad='+$scope.facultad;   
  }//switch
}//switchUrl

var act1=0;
var act2=0;
var act3=0;
var act4=0;
var act5=0;
$scope.periodo='Seleccionar Periodo';
$scope.facultad=0;//si no tiene pk
$scope.departamento=0;
$scope.changer.periodo='Seleccionar Periodo';
$scope.changer.facultad='Seleccionar Facultad';
$scope.changer.departamento='Seleccionar Departamento';
/**
 * Método que actualiza el gráfico circular
 * @method reloadChartData
 * @param {string} argument Variable que sirve para ver
 * con cuál comboboc el usuario ha interactuado
 * (el usuario sóo interactúa con un combobox a la vez)
 * @param {string/int} changer Variable que almacena el valor del combobox
 * es una string para el combobox de departamentos y facultades y es un int para el de años
 * <<separar este método en dos, una parte que bloquea y otra que
 * actualiza el gráfico de torta>>
 */
 $scope.reloadChartData = function(argument, changer){
  $scope.sending=true;
  switch(argument){ // depende de lo que le pasamos uno de los combobox se tiene que bloquear
    case 'Facultad':
    $scope.changer.departamento='Seleccionar Departamento';
    $scope.departamento=0;
    if (changer === 'Seleccionar Facultad') {
        $scope.facultad=0;//bug en el server
      }else{
        $scope.facultad=$scope.facultadesSeleccion[changer];
      }
      $scope.cargarComboDepartamentos($scope.facultad);
      break;
      case 'Departamento':
      if (changer === 'Seleccionar Departamento') {//bugfix en el server
        $scope.departamento=0;
      }else{
        $scope.departamento=$scope.departamentosSeleccion[changer];//le pasamos la clave primaria, no el nombre (performance)
      }
      break;
      case 'Periodo':
      $scope.periodo=changer;//el período ya es un número y clave primaria a la vez
      break;
    }//switch
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
    $scope.sending=false;//este gráfico es el que esconde los spinners
  });//.then(function(response)
};//reloadChartData
$scope.reloadChartData();

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
* Método que enlaza los datos de una Facultad con los de la fábrica para compartir entre controladores
* y redirige al usuario al submódulo para revisar los gráficos correspondientes
* a esta Facultad 
* @method revisarFacultad
* @param {object} facultad Objeto que representa a la Facultad seleccionada
*/
$scope.revisarFacultad = function(facultad){
  $scope.datafactoryFacultad.cod_facultad = facultad.cod_facultad;
  $scope.datafactoryFacultad.nombre = facultad.nombre;
  $scope.datafactoryFacultad.decano = facultad.decano;
  $scope.datafactoryFacultad.estado = facultad.estado;

  $location.path('/graficos/facultad');
 };//revisarFacultad


$scope.tabs=['Academicos', 'Facultades'];//arreglo con tabs disponibles
/**
 * Método que sirve para intercambiar tabs
 * @method switchTab
 * @param {string} argument Nombre de la tab que queremos que se muestre
 * @return 
 */
$scope.switchTab = function(argument){ // la string que pasemos como argumento debe ir entre comillas
  for (var i = $scope.tabs.length - 1; i >= 0; i--) {
    $scope.tabs[$scope.tabs[i]] = false; // Dejamos todas las tabs sin seleccionar
  };//for
  $scope.tabs[argument] = true; // seleccionamos la que le pasamos
}//switchTab
$scope.switchTab('Academicos'); // tab activa por default
/**
 * Método que calcula el número de paginas que contendrá 
 * la grilla principal de acuerdo a la 
 * cantidad de elementos almacenados en $scope.académicos
 * @method numberOfPages1
 * @return CallExpression
 */
 $scope.numberOfPages1 = function() {
  return Math.ceil($scope.academicos.length / $scope.pageSize);
};
/**
 * Método que calcula el número de paginas que contendrá 
 * la grilla principal de acuerdo a la 
 * cantidad de elementos almacenados en $scope.facultades
 * @method numberOfPages2
 * @return CallExpression
 */
 $scope.numberOfPages2 = function() {
  return Math.ceil($scope.facultades.length / $scope.pageSize);
};
/**
* Método que ordenará los elementos de la grilla de acuerdo al nombre del atributo escogido
* @method ordenarPor
* @param {string} orden Nombre del atributo 
* seleccionado del objeto que está iterado en la grilla, para que esta se ordene 
* @return 
*/
 $scope.ordenarPor = function(orden){
  $scope.ordenSeleccionado = orden;
};
}]);//GraficosFacultadesCtrl

