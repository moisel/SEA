'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:AcademicosEdicionCtrl
 * @description
 * # AcademicosEdicionCtrl
 * Controller of the seaApp
 */
angular.module('seaApp')
.controller('AcademicosEdicionCtrl', ["$scope", "$location", "comboLoader", "Academico", "htp", "sweet", "alerts", function ( $scope, $location, comboLoader, Academico, htp, sweet, alerts) {
    $scope.changer = {};
	$scope.datafactory = Academico;
	$scope.categorias = ['-----', 'Instructor', 'Auxiliar', 'Adjunto', 'Titular'];
 	$scope.estados = ['ACTIVO', 'INACTIVO'];
 	$scope.facultadesSeleccion=[];//llenaremos de nombres de facultades existentes para elegir (admin)
    $scope.departamentosSeleccion=[];//llenaremos con nombres de departamentos existentes(cualquiera);
    $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos
    //función que carga el combobox con el nombre de las facultades existentes
    $scope.cargarComboboxFacultades = function(){
        $scope.sending=true;//bloquea botones y muestra spinners mientras se envían datos
       comboLoader.facultad()
        .then(function(response){
            if(response){
                $scope.facultadesSeleccion=response;
                for (var i = $scope.facultadesSeleccion.length - 1; i >= 0; i--) {//debemos iterar, al encontrar
                    //el elemento que tiene el mismo valor de la pk facultad
                    //tomamos el nombre y se lo asignamos al combobox
                    if($scope.facultadesSeleccion[$scope.facultadesSeleccion[i]]== $scope.datafactory.cod_facultad){
                        $scope.changer.facultad=$scope.facultadesSeleccion[i];
                    }
                };
            }
            $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos
        });//.then
    };// fin cargarComboboxFacultades
    $scope.cargarComboboxFacultades();
    $scope.cargarComboboxDepartamentos = function(){
        $scope.sending=true;//bloquea botones y muestra spinners mientras se envían datos
       comboLoader.departamento($scope.datafactory.cod_facultad)
        .then(function(response){
            if(response){
                $scope.departamentosSeleccion=response;
                for (var i = $scope.departamentosSeleccion.length - 1; i >= 0; i--) {
                    if($scope.departamentosSeleccion[$scope.departamentosSeleccion[i]]== $scope.datafactory.cod_departamento){
                        $scope.changer.departamento=$scope.departamentosSeleccion[i];
                    }
                };
            }//if(response)
            $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos
        });
    };// fin cargarComboboxDepartamentos
    $scope.cargarComboboxDepartamentos();
    $scope.cambiarCodFacultad = function(facultad){
        $scope.datafactory.cod_facultad = $scope.facultadesSeleccion[facultad];
        $scope.datafactory.cod_departamento=0;//cambió la facultad, por lo que ya no hay un departamento seleccionado
        $scope.changer.departamento='Seleccionar Departamento';
        $scope.cargarComboboxDepartamentos();
    };//cambiarCodFacultad

    $scope.cambiarCodDepartamento = function(departamento){
        $scope.datafactory.cod_departamento = $scope.departamentosSeleccion[departamento];
    };//cambiarCodDepartamento

    $scope.editar = function(){
        $scope.sending=true;
        if($scope.datafactory.cod_departamento === 0){
            sweet.show(alerts.warning('Se debe seleccionar un Departamento, seleccionando antes una Facultad', 'Departamento sin Seleccionar'));
        }else{
            var data = {
                    rut: $scope.datafactory.rut,
                    nombres: $scope.datafactory.nombres,
                    apellidos: $scope.datafactory.apellidos,
                    cod_facultad: $scope.datafactory.cod_facultad,
                    cod_departamento: $scope.datafactory.cod_departamento,
                    tituloProfesional: $scope.datafactory.tituloProfesional,
                    horas: $scope.datafactory.horas,
                    categoria: $scope.datafactory.categoria,
                    gradoAcademico: $scope.datafactory.gradoAcademico,
                    tipoPlanta: $scope.datafactory.tipoPlanta,
                    estado: $scope.datafactory.estado
            };//data
            var url = 'academicos/academicos.php?action=editarAcademico';
            htp.put(url, data)
            .then(function(response){
                if(response){
                    $location.path('/academicos/main');
                }           
                $scope.sending=false;
            });//.then
        }//else
    };//editar
 }]);//AcademicosEdicionCtrl