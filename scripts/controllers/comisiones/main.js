'use strict';
// todo lo comentado entre "<<>>" corresponde a trabajo futuro
/**
 * @ngdoc function
 * @name seaApp.controller:ComisionesMainCtrl
 * @description Submódulo que se encarga de presentar las comisiones registradas en el sistema
 * permite su búsqueda y selección para enviar a una comisión a edición
 * además contiene un enlace para enviar al usuario al submódulo para ingresar una nueva comisión
 * <<sería bueno que en vez de enviar al usuario a las distintas interfaces para agregar/editar
 * se cargue en vez un modal>>
 * # ComisionesMainCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('ComisionesMainCtrl', ["$scope", "Comision", "$location", "htp", function ($scope, Comision, $location, htp) {


  $scope.array = {}; // guardará tanto el arreglo de facultades como el de departamento
  
  $scope.array.facultades = []; // arreglo de facultades
  
  $scope.datafactory = Comision // objeto enlazado a la fábrica, para compartir datos entre controladores
  
  $scope.curPage = 0; // página en la que se encuentra el usuario actualmente en la grilla
  
  $scope.pageSize = 5; // cantidad de elementos a mostrar por cada página de la grilla
  
  $scope.comisiones = []; // contendrá la colección de comisiones cargadas desde el back-end

  $scope.showSpinner = true; // inicializamos una varable para mostrar/ocultar el spinner


  /////////////cambiando pk por nombre/////////////
  // Segmento de código que se encarga de cambiar las claves primarias en la grilla por los respectivos nombres
  htp.get('facultades/facultades.php?action=ver')
  .then(function(response){
    var aux = response.data.records;
    angular.forEach(aux, function(value){
      $scope.array.facultades[value.cod_facultad]=value.nombre;//hacemos coincidir la pk con el index del array
    });//angular.foreach
  });//then
  /////////////fin cambiando pk por nombre/////////////


 	/**
   * Método que carga las distintas comisiones desde un recurso, 
   * el usuario puede llamar a este método directamente pero se ejecuta mínimo una vez
   * @method reload
   */
   $scope.reload = function(){
     $scope.showSpinner=true;
     htp.get('comisiones/comisiones.php?action=ver')
     .then(function(response){
      if(response){
        $scope.comisiones = response.data.records;
      }
      $scope.showSpinner=false;
    });//.then
  };//reload
  $scope.reload();

  /**
   * Método que enlaza los datos de una comisión con los de la fábrica para compartir entre controladores
   * y redirige al usuario al submódulo para editar a la comisión 
   * <<en vez de redirigir, podría desplegarse un bootstrap modal en vez>>
   * @method seleccionar
   * @param {object} comision Objeto que representa a la comisión seleccionada
   * @param {string} nombreFacultad variable auxiliar que almacena el nombre de la facultad
   */
   $scope.seleccionar = function(comision, nombreFacultad){

     $scope.datafactory.anio = comision.anio;
     $scope.datafactory.cod_facultad = comision.cod_facultad;
     $scope.datafactory.rut = comision.rut;
     $scope.datafactory.decano = comision.decano;
     $scope.datafactory.miembro1 = comision.miembro1;
     $scope.datafactory.miembro2 = comision.miembro2;
     $scope.datafactory.fechaPie = new Date(comision.fechaPie);
     $scope.datafactory.estado = comision.estado;
     $scope.datafactory.nombreFacultad = nombreFacultad;

     $location.path('/comisiones/edicion');

   };//seleccionar

  /**
    * Método que ordenará los elementos de la grilla de acuerdo al nombre del atributo escogido
    * @method ordenarPor
    * @param {string} orden Nombre del atributo seleccionado del objeto que está iterado en la grilla, para que esta se ordene 
    */
  $scope.ordenarPor = function(orden){
     $scope.ordenSeleccionado = orden;
  };//ordenarPor

  /**
   * Método que calcula el número de paginas que contendrá la grilla principal de acuerdo a la cantidad de elementos almacenados en $scope.comisiones
   * @method numberOfPages
   * @return CallExpression
   */
   $scope.numberOfPages = function() 
   {
     return Math.ceil($scope.comisiones.length / $scope.pageSize);
   };
 }]);