'use strict';
// todo lo comentado entre "<<>>" corresponde a trabajo futuro
/**
 * @ngdoc function
 * @name seaApp.controller:ReportesFacultadCtrl
 * @description submódulo encargado de generar distintos reportes en excel o en PDF según corresponda,
 * a este submódulo se accede automáticamente si el usuario es Secretario y pincha en la barra de herramientas "Reportes",
 * si el usuario es de tipo Administrador, este será redirigido primero a una tabla para seleccionar la Facultad la cual
 * desea evalar en facultades.js
 * <<Se puede cambiar completamente la manera en que se generan los reportes, como se hace con el submódulo de gráficos>>
 * # ReportesFacultadCtrl
 * Controller of the seaApp
 * 
 */
 angular.module('seaApp')
 .controller('ReportesFacultadCtrl', ["$scope", "htp", "$timeout", "configService", "hideFactory", "Facultad", "sessionService", "fileUpload", "evaFasteners", "comboLoader", "sweet", "alerts", function ($scope, htp, $timeout, configService, hideFactory, Facultad, sessionService, fileUpload, evaFasteners, comboLoader, sweet, alerts) {

  $scope.datafactoryFacultad = {}; // objeto que almacenará la facultad seleccionada desde la fábrica "Facultad" (Administrador)

  $scope.datafactoryFacultad.cod_facultad = ''; // declaramos este atributo en caso de que el que ingrese a este módulo sea un (Secretario)

  $scope.datafactoryFacultad = Facultad;

  $scope.periodos = ''; // string que almacenará cada uno de los periodos provenientes del backend

  $scope.curPage = 0; // página en la que se encuentra el usuario actualmente en la grilla

  $scope.pageSize = 5; // cantidad de elementos a mostrar por cada página de la grilla

  $scope.sending = false; // bloquea botones y muestra spinners mientras se envían datos

  $scope.departamentosSeleccion = []; // objeto que contendrá todos los departamentos para esta Facultad (elegida [Addministrador] o asociada [Secretario]) para usarlos al generar un reporte

  $scope.showSpinner = true; // variable que servirá para decidir si se muestra o algún spinner

  $scope.myFile = null; // variable que almacenará un archivo PDF 

  $scope.sending=false; // booleano encargado de bloquear botones y mostrar algunos spinners
  
  // Se pide la Facultad desde un Recurso
  // (Secretario) obtendrá la Facultad asociado a este
  // (Administrador) obtendrá la Facultad actualizada <<Eliminar esta característica, ya que no es necesario>>
  htp.get('facultades/facultades.php?action=verUna&cod_facultad='+$scope.datafactoryFacultad.cod_facultad)
  .then(function(response){
    $scope.facultad=response.data.records[0];
  });//htp.get

  //cargaremos en el objeto $scope.departamentosSeleccion los departamentos correspondientes
  comboLoader.departamento($scope.datafactoryFacultad.cod_facultad)
  .then(function(response){
    $scope.departamentosSeleccion = response;
  })//comboloader.departamento

  /**
    * Método que guarda los periodos evaluados en el objeto $scope.periodos,
    * además mostrará o esconderá el spinner de carga según corresponda 
    * @method reload
    * @return 
    */
    $scope.reload = function(){
      $scope.showSpinner=true;
      htp.get('configuraciones/periodos.php?action=ver')
      .then(function(response){
        $scope.periodos = response.data.records;
        $scope.showSpinner=false;
      });
  };//reload
  $scope.reload();

  /**
    * Método que ordenará los elementos de la grilla de acuerdo al nombre del atributo escogido
    * @method ordenarPor
    * @param {string} orden Nombre del atributo seleccionado del objeto que está iterado en la grilla, para que esta se ordene 
    * @return 
    */
    $scope.ordenarPor = function(orden){
      $scope.ordenSeleccionado = orden;
  };//$scope.ordenarPor

 /**
   * Método que calcula el número de paginas que contendrá la grilla principal de acuerdo a la cantidad de elementos almacenados en $scope.periodos
   * @method numberOfPages
   * @return CallExpression
   */
   $scope.numberOfPages = function(){
    return Math.ceil($scope.periodos.length / $scope.pageSize);
  };//$scope.numberOfPages

  /**
    * Método que se encarga de subir un archivo PDF que contiene una foto o scan de las pautas ya firmadas para guardar como "evidencia"
    * <<Sería bueno que en vez de esta característica, existiera un módulo que administrara las firmas de manera digital>>
    * <<Aunque el servidor arruina los archivos que no son de extención PDF, sería bueno detectar si el archivo es PDF antes de ser subido al servidor>>
    * @method subirEvidencia
    * @param {} periodo Periodo al cual corresponde todas las pautas para esta Facultad (elegida [Addministrador] o asociada [Secretario])
    * @return 
    */
    $scope.subirEvidencia = function(periodo){

      var file = $scope.myFile;
      if(angular.isUndefined(file)){
        sweet.show(alerts.dinamicError('Primero Debe Seleccionar Un Archivo'));
      }else{
        sweet.show(alerts.choose('¿Desea realmente subir este archivo para el año '+periodo.inicio+'?', 'Subir Archivo', false),
          function(){
            $scope.sending=true;
            var uploadUrl = configService.url()+'reportes/evidencias.php?action=upload&cod_facultad='+ $scope.datafactoryFacultad.cod_facultad+'&inicioPeriodo='+periodo.inicio+'&finPeriodo='+periodo.fin+'&userToken='+sessionService.get('user');
            fileUpload.uploadFileToUrl(file, uploadUrl)
            .then(function (response){
              $scope.sending=false;
            });//.then

        });//sweet.show
    }//else
  };//subirEvidencia

  /**
    * Funciṕn que se encarga de bajar un archivo PDF del servidor (en el caso de encontrarse disponible),
    * además esconderá la query string para que el usuario no pueda ver información importante como su token de usuario
    * @method bajarEvidencia
    * @param {string} periodo Periodo por el cual se desea consultar si almacena o no archivo para guardar en la computadora del usuario  
    * @return 
    */
    $scope.bajarEvidencia = function(periodo){

      var url = configService.url()+'reportes/evidencias.php?action=download';

      var data = {
        cod_facultad: $scope.datafactoryFacultad.cod_facultad,
        inicioPeriodo: periodo.inicio,
        finPeriodo: periodo.fin,
        userToken: sessionService.get('user')
      };

      var form = document.createElement("form");
      form.action = url;
      form.method = 'POST';
    form.target = '_blank'; // se abrirá en una nueva ventana, por lo que querrá mostrar la variable url en el navegador
    
    if (data) {
      for (var key in data) { // sección de código encargado de esconder los atributos del objeto "data"
        var input = document.createElement("textarea");
      input.name = key;
        input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key]; // si es true, el primer parámetro, de lo contrario el segundo
        form.appendChild(input);
      }//for
    }//if(data)

    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();

  };//bajarEvidencia


  /**
    * Método que abre una nueva ventana mostrando todas las pautas de evaluación en PDF correspondiente al periodo seleccionado
    * Método que abre un diálogo de descarga para almacenar un Excel con todos los datos de las evaluaciones correspondientes al periodo seleccionado
    * @method imprimirEvaluaciones
    * @param {string} periodo Periodo por el cual se desea consultar si hay o no evaluaciones almacenadas
    * @param {boolean} PDF Indica si el reporte va en PDF (true) o en Excel (false)
    * @return 
    */
    $scope.imprimirEvaluaciones = function(periodo, PDF){

      $scope.sending=true;
      var url = '';

    if(periodo){ // Si periodo no es false, Imprimiremos un Periodo Seleccionado
      url = 'evaluaciones/evaluaciones.php?action=verPeriodoFacultad&cod_facultad='+ $scope.datafactoryFacultad.cod_facultad+'&inicioPeriodo='+periodo.inicio;
    }else{
      url = 'evaluaciones/evaluaciones.php?action=verPeriodoFacultad&cod_facultad='+$scope.datafactoryFacultad.cod_facultad+'&inicioPeriodo=inicioPeriodo';
    }//else

    htp.get(url)
    .then(function (response) {
      if(response){
        if(!response.data.records[0]){
          sweet.show(alerts.dinamicError('Esta Facultad No Presenta Evaluaciones Para EL Periodo Seleccionado'));
        }else{
          $scope.evaluaciones = response.data.records;
          if(PDF){
            $scope.asPDF();
          }else{
            $scope.asEXCEL();
          }//else
        }//else
      }//if(response)
      $scope.sending=false;
    });//.then
  };



/**
  * Método que se encarga de gestionar los datos de una evaluación para ser guardada en la computadora del usuario en formato Excel
  * @method asEXCEL
  * @return 
  */
  $scope.asEXCEL = function(){

   var i=0;
   var Facultad = []; // arrays que irán coleccionando los valores de un atributo en específico (en este caso, el atributo facultad) por cada iteración
   var Categoria = [];
   var Nombre = []; 
   var CalifiAnt = [];
   var tiempo1 = []; 
   var nota1 = []; 
   var tiempo2 = []; 
   var nota2 = []; 
   var tiempo3 = []; 
   var nota3 = [];
   var tiempo4 = []; 
   var nota4 = []; 
   var tiempo5 = []; 
   var nota5 = []; 
   var nota = []; 
   var concepto = [];

   angular.forEach($scope.evaluaciones, function(evaluacion){
    Facultad[i] = $scope.facultad.nombre;
    Categoria[i] = evaluacion.categoriaAcademico; 
    Nombre[i] = evaluacion.nombresAcademico+' '+evaluacion.apellidosAcademico;
    CalifiAnt[i] = evaluacion.calificacionAnteriorAcademico;
    tiempo1[i] = evaluacion.tiempo1;
    nota1[i] = evaluacion.nota1; 
    tiempo2[i] = evaluacion.tiempo2; 
    nota2[i] = evaluacion.nota2; 
    tiempo3[i] = evaluacion.tiempo3; 
    nota3[i] = evaluacion.nota3;
    tiempo4[i] = evaluacion.tiempo4; 
    nota4[i] = evaluacion.nota4; 
    tiempo5[i] = evaluacion.tiempo5; 
    nota5[i] = evaluacion.nota5; 
    nota[i] = evaluacion.notaFinal; 
    concepto[i] = evaFasteners.CambiarValorPorEscala(nota[i]);
    i++;
    });//angular.forEach

   var data = [Facultad, Categoria, Nombre, CalifiAnt, tiempo1, nota1, tiempo2, nota2, tiempo3, nota3, tiempo4, nota4, tiempo5, nota5, nota, concepto];

   var keys = ['"Facultad"', '"Categoria"', '"Nombre"', '"Calificación Anterior(nota)"',
   '"Tiempo Act de Docencia(%)"', '"Nota"', '"Tiempo Act de Investigación(%)"', '"Nota"', '"Timepo Ext y Vinc(%)"', '"Nota"',
   '"Timepo Admin Académica(%)"', '"Nota"', '"Otras actividades(%)"', '"Nota"', '"Calificación (Total)"', '"Concepto"'];

 /**
   * Método que convierte los datos y sus keys en el formato correspondiente para generar un Excel
   * El código comentado solo sirve para depuración <<lo recomendable es eliminrlo>>
   * @method convertToCSV
   * @param {array} data Datos que rellenan la tabla Excel
   * @param {array} keys Encabezados de cada columna
   * @return BinaryExpression
   */
   var convertToCSV = function(data, keys){

    var orderedData = [];

    for(var i = 0, iLen = data.length; i < iLen; i++){
      var temp = data[i];
      //console.log('data['+i+']='+data[i]);
      for(var j = 0, jLen = temp.length; j < jLen; j++){

        var quotes = ['"'+temp[j]+'"'];
        if(!orderedData[j]){
          orderedData.push([quotes]);
          //console.log('!orderedData['+j+']='+!orderedData[j]);

        }else{

          //console.log('orderedData['+j+'] antes de push='+orderedData[j]);
          orderedData[j].push(quotes);
          //console.log('orderedData['+j+'] DESPUES DE PUSH='+orderedData[j]);
          
          /*if(i+1==iLen){ // si ya terminamos de concatenar los resultados
            //console.log('saludos');
            orderedData[j]=orderedData[j].join(';');

          }//if(i+1==iLen){*/
            
        }//else
      }//end for (j)
    }//end for (i)

    //return keys.join(';') + '\r\n' + orderedData.join('\r\n');
    return keys.join(',') + '\r\n' + orderedData.join('\r\n');
  }//convertToCSV

  var str = convertToCSV(data, keys);
  var blob = new Blob([str], {type: "text/plain;charset=utf-8"});

  saveAs(blob, ['Reporte.csv']);

};//fin de asExcel function

/**
  * documentación de la api https://mrrio.github.io/jsPDF/doc/symbols/jsPDF.html#constructor
  * Método que genera uno o más PDF en el navegador
  * @method asPDF
  * @return 
  */
  $scope.asPDF = function(){

  $(document).ready(function(){//cuando el documento está listo para ejecutar código javascript

  var doc = new jsPDF('p', 'mm', 'letter');//orientación, unidad, formato

  ///////////INICIODOCUMENTO///////////
  angular.forEach($scope.evaluaciones, function(evaluacion){//por cada evaluación

    /**Encabezado **/

  //Imagen
  var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAA5AC8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDvNG8NWGvaz4imv2unaHUnjjC3LqFXavGAa2f+Fe6B/cvf/AyT/wCKpvg3/kJeKP8AsLSf+grWfrEtxeePZtOk8RXOl2sdikqrFKqBnLEHr7Ctbybtcz0SvYbFolpoHxF0WKwa5WOe2uDIsk7uGIAxwTSf2HaeIPiH4hi1B7lo7aG18pY7h0C7kbPAI9K0dJ0Cyj1+31FvEdxqd3BG6RJLOj4DdcAUmq+H7FvEF3qKeJbjTLq5SNZo4p0TIUYXg/WhvXfoFtNiX/hXugf3L3/wMk/+KrlvHHh2y8O2umXOmyXcUsl2Y2JunYFfKkOME+oFa+iy3Fn8QI9Nj8Q3OqWb6c87LLKrhXEgA6e386T4qf8AIK0j/r//APaMtVG6mlfcHa17Gj4N/wCQl4o/7C0n/oK1s6h4d0bVZxPqGl2lzKF2h5Ygxx6ZrG8G/wDIS8Uf9haT/wBBWusrOTtIpK6OFk0XTNH+JWhDTrC3tRJa3JfyYwu7gdcU220XS9Y+JHib+0tPt7vyobTZ50YbblGzjP4Voar/AMlK8Pf9et1/JaTRP+SkeKv+uNn/AOgNVXbXy/Umy/E2tP8ADujaTcGfT9MtbWVl2l4ogpI9OPpXK/FT/kFaR/1//wDtGWu9rgvip/yCtI/6/wD/ANoy0qes0OekWaPg47dX8VRHhl1RmI9iikV1lcZfSf8ACL+Ol1GX5dL1pEgmkP3Yrhc7CfQMCRn1FdnSnvcpdjk9V/5KV4e/69br+S0mif8AJSPFX/XGz/8AQGpdV/5KV4e/69br+S0mif8AJSPFX/XGz/8AQGqlt8v1J6/M62uE+JqNcW2iWsQ3TSXrMq+oEMmf5iu7rjbFx4m8dyaimH03Rke2gfqsk7cSEeuANuamDs+bsOWqsdRqOnWurafNY3sQlt5l2up/z1rlYbjXvBwFtdwT6zoycRXMAzcQL2V1/jA/vDmu0oqU7aDsefx+IdM174j6E2n3PmNFa3PmRspV0JA4IPIpF8RaXoPxF8SnULny2lhtPKjVSzyEI2doHJ6itwf8jpD/ANc5KRf+R0uvpH/IVrp+Bnd/iUZp9d8Yg29rBPoujtxLczcXE6/3UX+AH1PNdVpunWuk6fDY2UKxW8KhUUf19T71aorJu5okf//Z'
  doc.addImage(imgData, 'JPEG', 20, 5, 12.4, 15);

  //Letras
  doc.setFont("times");
  doc.setFontSize(9);
  doc.text(35, 9, 'VICERRECTORIA ACADEMICA.');
  doc.text(35, 13, 'COMISION PROMOCION ACADEMICA.');

  /**TÍTULO**/
  doc.setFontSize(15);
  doc.setFontType("bold");
  doc.text(50, 30, 'PAUTA RESUMEN: PROFESOR');


  /**SUBTÍTULOS**/
  doc.setFontSize(11);
  //doc.setFontType("normal");
  doc.text(20, 40, 'I. IDENTIFICACIÓN:');
  doc.text(20, 100, 'II. CALIFICACIÓN ACADÉMICA:');
  doc.text(20, 160, 'III. ESCALA EVALUATIVA:');
  doc.text(20, 195, 'IV. ARGUMENTOS DE LA CALIFICACION FINAL:');

  ///////////TABLA IDENTIFICACIÓN///////////

  /**BARRAS**/
  //Barras izquierda         //Barras derecha
  doc.rect(20, 45, 87.5, 5); doc.rect(107.5, 45, 87.5, 5);
  doc.rect(20, 54, 87.5, 5); doc.rect(107.5, 54, 87.5, 5);
  doc.rect(20, 63, 87.5, 5); doc.rect(107.5, 63, 87.5, 5);
  doc.rect(20, 72, 87.5, 5); doc.rect(107.5, 72, 87.5, 5);
  doc.rect(20, 81, 87.5, 5); doc.rect(107.5, 81, 87.5, 5);

  /**CINTURONES**/
  doc.setFillColor(235,235,235);//rgb grey
  //Cinturones izquierda            //Cinturones derecha
  doc.rect(20, 50, 87.5, 4, 'FD');  doc.rect(107.5, 50, 87.5, 4, 'FD');
  doc.rect(20, 59, 87.5, 4, 'FD');  doc.rect(107.5, 59, 87.5, 4, 'FD');
  doc.rect(20, 68, 87.5, 4, 'FD');  doc.rect(107.5, 68, 87.5, 4, 'FD');
  doc.rect(20, 77, 87.5, 4, 'FD');  doc.rect(107.5, 77, 87.5, 4, 'FD');
  doc.rect(20, 86, 87.5, 4, 'FD');  doc.rect(107.5, 86, 87.5, 4, 'FD');


  //**Data Identificación (SCOPE)**/
  var nombreDepartamento = '';
  for (var i = $scope.departamentosSeleccion.length - 1; i >= 0; i--) {
    if($scope.departamentosSeleccion[$scope.departamentosSeleccion[i]]===evaluacion.cod_departamento){
          //si el código de departamento coincide con el del array, tomaremos el nombre
          //no el valor
          nombreDepartamento=$scope.departamentosSeleccion[i];
        }
  };//for
  if(evaluacion.inicioPeriodo==0){
    evaluacion.inicioPeriodo='Actual';
  }
  //Data izquierda                                                                //Data derecha
  var strlenght=47;//máxima cantidad de caracteres para que no se desborden del recuadro
  doc.text(25, 49, (''+evaluacion.nombresAcademico+' '+evaluacion.apellidosAcademico).substring(0,strlenght));/***/doc.text(112.5, 49, (''+nombreDepartamento).substring(0,strlenght));
  doc.text(25, 58, (''+$scope.facultad.nombre).substring(0,strlenght));/********************************************/doc.text(112.5, 58, (''+ evaluacion.inicioPeriodo).substring(0,strlenght));
  doc.text(25, 67, (''+evaluacion.tituloProfesionalAcademico).substring(0,strlenght));/************************/doc.text(112.5, 67, (''+evaluacion.horasAcademico).substring(0,strlenght));
  doc.text(25, 76, (''+evaluacion.categoriaAcademico).substring(0,strlenght));/********************************/doc.text(112.5, 76, (''+evaluacion.gradoAcademico).substring(0,strlenght));
  doc.text(25, 85, (''+evaluacion.calificacionAnteriorAcademico).substring(0,strlenght));/*****************************************/doc.text(112.5, 85, (''+evaluacion.tipoPlantaAcademico).substring(0,strlenght));

  /**HEBILLAS**/
  doc.setFontType("normal");
  doc.setFontSize(9);
  //Hebillas izquierda              //Hebillas derecha
  doc.text(55, 53, 'Académico');    doc.text(142.5, 53, 'Departamento');
  doc.text(56, 62, 'Facultad');     doc.text(145.5, 62, 'Periodo');
  doc.text(57, 71, 'Titulo');       doc.text(146.5, 71, 'Horas');
  doc.text(55, 80, 'Categoria');    doc.text(146.5, 80, 'Grado');
  doc.text(50, 89, 'Calificación Anterior'); doc.text(146.5, 89, 'Planta');

  ///////////TABLA DE EVALUACIÓN///////////
  //Algunas de las barras no aparecen porque no son necesarias, ya que las barras que la rodean la terminan creando

  /**BARRAS**/

  //Columna 1               //Columna 2                 //columna 3               //columna 4
  /************************/doc.rect(70, 105, 35, 10);                            doc.rect(120, 108.3, 15, 6.66);
  doc.rect(20, 115, 50, 5);                           doc.rect(105, 115, 15, 5);
  doc.rect(20, 120, 50, 5); doc.rect(70, 120, 35, 5);                             doc.rect(120, 120, 15, 5);
  doc.rect(20, 125, 50, 5);                           doc.rect(105, 125, 15, 5);
  doc.rect(20, 130, 50, 5); doc.rect(70, 130, 35, 5);                             doc.rect(120, 130, 15, 5);
  doc.rect(20, 135, 50, 5); doc.rect(70, 135, 35, 5); doc.rect(105, 135, 15, 5);  doc.rect(120, 135, 15, 5);


  //columna 5                 //columna 6                     //columna 7             //columna 8
  /*************************/doc.rect(150, 108.3, 15, 6.66);                         doc.rect(180, 108.3, 15, 6.66);
  doc.rect(135, 115, 15, 5);                             doc.rect(165, 115, 15, 5);  doc.rect(180, 115, 15, 5);
  /*************************/doc.rect(150, 120, 15, 5);                              doc.rect(180, 120, 15, 5);
  doc.rect(135, 125, 15, 5);                             doc.rect(165, 125, 15, 5);  doc.rect(180, 125, 15, 5);
  /*************************/doc.rect(150, 130, 15, 5);                              doc.rect(180, 130, 15, 5);
  doc.rect(135, 135, 15, 5); doc.rect(150, 135, 15, 5);  doc.rect(165, 135, 15, 5);  doc.rect(180, 135, 15, 5);


  /**CINTURONES**/
  //Cinturón col 3-7 (Calificación)
  doc.rect(105, 105, 75, 3.33);
  //Cinturón col 8 (Pond)
  doc.rect(180, 105, 15, 3.33);

  //Barras resultado
  doc.rect(20, 140, 160, 10);
  doc.rect(180, 140, 15, 10);

  /**RELLENADO DE TABLA**/
  //Primera Columna
  doc.text(25, 119, '1. Actividades de Docencia');
  doc.text(25, 124, '2. Actividades de Investigación');     
  doc.text(25, 129, '3. Extensión y Vinculación');       
  doc.text(25, 134, '4. Administración Académica');     
  doc.text(25, 139, '5. Otras Actividades Realizadas');

  //Segunda Columna
  doc.setFontSize(8);
  doc.text(72, 108.2, '% TIEMPO ASIGNADO');
  doc.text(79, 111.2, 'A TAREAS');
  doc.text(75, 114.2, 'PROGRAMADAS');

  //Banner col 3-7 pond
  doc.text(137, 107.85, 'CALIFICACIÓN');
  doc.text(185, 107.85, 'Pond.')

  // % T x C / 100
  doc.text(183.5, 111, '% T x');
  doc.text(183.5, 114, 'C / 100');

  // E MB B R D
  doc.setFontSize(10);
  doc.text(111, 112.75, 'E');
  doc.text(125, 112.75, 'MB');
  doc.text(141, 112.75, 'B');
  doc.text(156, 112.75, 'R');
  doc.text(170.5, 112.75, 'D');

  //Valor timepo asignado, nota actividad y fracción de nota

  var siguiente = 119;//sonde debe ir el término (inicialmente en 119, luego +5 y asi)
  var espacio = 14.7;//espacio en mm de diferencia entre E, MBA... D

  var siguiente = 119;//sonde debe ir el término (inicialmente en 119, luego +5 y asi)
  var espacio = 14.7;//espacio en mm de diferencia entre E, MBA... D
  var auxEspacio = 0;
  var proporcion = 0;
  doc.text(84, siguiente, ''+evaluacion.tiempo1); // tiempos asgnados
  doc.text(84, siguiente+5, ''+evaluacion.tiempo2); // tiempos asgnados
  doc.text(84, siguiente+10, ''+evaluacion.tiempo3); // tiempos asgnados
  doc.text(84, siguiente+15, ''+evaluacion.tiempo4); // tiempos asgnados
  doc.text(84, siguiente+20, ''+evaluacion.tiempo5); // tiempos asgnados

  doc.text(185, siguiente, ''+evaluacion.ponderado1); // nota ponderada
  doc.text(185, siguiente+5, ''+evaluacion.ponderado2); // nota ponderada
  doc.text(185, siguiente+10, ''+evaluacion.ponderado3); // nota ponderada
  doc.text(185, siguiente+15, ''+evaluacion.ponderado4); // nota ponderada
  doc.text(185, siguiente+20, ''+evaluacion.ponderado5); // nota ponderada

  if(evaluacion.nota1 != ''){
    proporcion = evaFasteners.selectorDeEscalas(parseFloat(evaluacion.nota1)); // nota acumulativa
    auxEspacio = espacio*proporcion;
    doc.text(97+auxEspacio, siguiente, ''+evaluacion.nota1);
  }
  if(evaluacion.nota2 != ''){
    proporcion = evaFasteners.selectorDeEscalas(parseFloat(evaluacion.nota2));
    auxEspacio = espacio*proporcion;
    doc.text(97+auxEspacio, siguiente+5, ''+evaluacion.nota2);
  }
  if(evaluacion.nota3 != ''){
    proporcion = evaFasteners.selectorDeEscalas(parseFloat(evaluacion.nota3));
    auxEspacio = espacio*proporcion;
    doc.text(97+auxEspacio, siguiente+10, ''+evaluacion.nota3);
  }
  if(evaluacion.nota4 != ''){
    proporcion = evaFasteners.selectorDeEscalas(parseFloat(evaluacion.nota4));
    auxEspacio = espacio*proporcion;
    doc.text(97+auxEspacio, siguiente+15, ''+evaluacion.nota4);
  }
  if(evaluacion.nota5 != ''){
    proporcion = evaFasteners.selectorDeEscalas(parseFloat(evaluacion.nota5));
    auxEspacio = espacio*proporcion;
    doc.text(97+auxEspacio, siguiente+20, ''+evaluacion.nota5);
  }

  //Calificación y nota
  doc.setFontType("bold");
  doc.text(26, 145.5, 'Calificación Final: '+evaFasteners.CambiarValorPorEscala(parseFloat(evaluacion.notaFinal)));

  doc.text(183.5, 145.5, ''+evaluacion.notaFinal);

  ///////////ESCALA EVALUATIVA///////////
  //Barra
  doc.rect(20, 165, 175, 20);
  //Info
  doc.setFontSize(12);
  doc.text(25, 172.5, 'ESCALA:            Excelente = 4,5 a 5     Muy Bueno = 4,0 a 4,4     Bueno: 3,5 a 3,9 ');
  doc.text(55.5, 178.5, 'Regular = 3,4 a 2,7     Deficiente = menos de 2,7');

  evaluacion.argumento = evaluacion.argumento.replace(/-nl-/g, ' ')//espacios arruinan json

  var argumento1 = evaluacion.argumento.slice(0, 76);//dividimos la string hasta en 3 partes
  var argumento2 = evaluacion.argumento.slice(76, 152);
  var argumento3 = evaluacion.argumento.slice(152, 200);
  switch(true){//si la expresión terminó en algún carácter al ser cortada, agregamos un guión
    case argumento1.slice(75, 76).match(/[a-zA-Z0-9]/) != null:
    argumento1 += '-';
    case argumento2.slice(75, 76).match(/[a-zA-Z0-9]/) != null:
    argumento2 += '-';
  }
  doc.text(20, 203, ''+argumento1);
  doc.text(20, 208, ''+argumento2);
  doc.text(20, 213, ''+argumento3);
  ///////////FIRMAS///////////

  /**Barras**/

  //Principales
  doc.rect(20, 220, 58.333, 13);
  doc.rect(78.333, 220, 58.333, 13);
  doc.rect(136.666, 220, 58.333, 13);

  doc.rect(136.666, 240, 58.333, 13);

  //Cinturones
  doc.setFillColor(235,235,235);//rgb grey
  doc.rect(20, 233, 58.333, 4, 'FD');
  doc.rect(78.333, 233, 58.333, 4, 'FD');
  doc.rect(136.666, 233, 58.333, 4, 'FD');

  doc.rect(136.666, 253, 58.333, 4, 'FD');

  /**Caracteres**/
  doc.setFontType("normal");
  doc.setFontSize(11);
  //Data Comisión Scope 

  var strlenght2 = 33; // Máxima cantidad de caracteres para que la cadena no se desborde del recuadro
  doc.text(22, 232, (''+evaluacion.miembro1Comision).substring(0,strlenght2));
  doc.text(80.333, 232, (''+evaluacion.decanoComision).substring(0,strlenght2));
  doc.text(138.666, 232, (''+evaluacion.miembro2Comision).substring(0,strlenght2));

  doc.text(138.666, 252, (''+evaluacion.secretario).substring(0,strlenght2));

  //Hebillas
  doc.setFontSize(9);
  doc.text(36, 236, 'Nombre y Firma');
  doc.text(94.333, 236, 'Nombre y Firma');
  doc.text(155.666, 236, 'Nombre y Firma');

  doc.text(144, 256, 'Nombre y Firma Ministro de Fe');

  //fecha
  doc.text(20, 260, 'Fecha:'+evaluacion.fecha);

  doc.addPage();
  });//fin angular foreach

  //OUTPUT
  doc.output("dataurlnewwindow");

  });//document ready

  };//end PDF
}]);//fin controlador
