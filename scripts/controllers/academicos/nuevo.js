'use strict';

/**
 * @ngdoc function
 * @name seaApp.controller:AcademicosNuevoCtrl
 * @description
 * # AcademicosNuevoCtrl
 * Controller of the seaApp
 */
 angular.module('seaApp')
 .controller('AcademicosNuevoCtrl', ["$scope", "htp", "configService", "sessionService", "comboLoader", "sweet", "alerts", function ($scope, htp, configService, sessionService, comboLoader, sweet, alerts) {
    $scope.categorias = ['-----', 'Instructor', 'Auxiliar', 'Adjunto', 'Titular'];
    $scope.academico = {};
    $scope.changer = {};//variable que toma el valor de texto del combobox
    $scope.facultadesSeleccion=[];//llenaremos de nombres de facultades existentes para elegir (admin)
    $scope.departamentosSeleccion=[];//llenaremos con nombres de departamentos existentes(cualquiera);
    $scope.sending=false;//bloquea botones y muestra spinners mientras se envían datos
    //función que carga el combobox con el nombre de las facultades existentes
    $scope.cargarComboboxFacultades = function(){
        $scope.sending=true;
       comboLoader.facultad()
        .then(function(response){
            if(response){
                $scope.facultadesSeleccion=response;
            }
            $scope.sending=false;
        });
    };// fin cargarComboboxFacultades
    $scope.cargarComboboxFacultades();

    $scope.cargarComboboxDepartamentos = function(){
        $scope.sending=true;
       comboLoader.departamento($scope.academico.cod_facultad)
       .then(function(response){
            if(response){
                $scope.departamentosSeleccion=response;
            }
            $scope.sending=false;
       });
    };// fin cargarComboboxDepartamentos
    $scope.cargarComboboxDepartamentos();//si entramos como secretario, cargará automáticamente los departamentos que le correspode (api)

    $scope.cambiarCodFacultad = function(facultad){
        $scope.academico.cod_facultad = $scope.facultadesSeleccion[facultad];
        $scope.academico.cod_departamento=0;//cambió la facultad, por lo que ya no hay un departamento seleccionado
        $scope.changer.departamento='Seleccionar Departamento';
        $scope.cargarComboboxDepartamentos();
    };//cambiarCodFacultad
    $scope.cambiarCodDepartamento = function(departamento){
        $scope.academico.cod_departamento = $scope.departamentosSeleccion[departamento];
    };
    $scope.agregar = function(){
        $scope.sending=true;
        if($scope.academico.cod_departamento === 0){
               sweet.show(alerts.warning('Se debe seleccionar un Departamento, seleccionando antes una Facultad', 'Departamento sin Seleccionar'));
                $scope.sending=false;
        }else{
            var url = 'academicos/academicos.php?action=agregarAcademico';
            htp.post(url, $scope.academico)
            .then(function(response){
                if(response){//si hay una respuesta
                    if(parseInt(response.data)){
                        sweet.show(alerts.new('Academico Ingresado Correctamente'));
                        $scope.limpia();
                        $scope.forma.$setPristine();
                    }else{
                        sweet.show(alerts.duplicated('El rut '+$scope.academico.rut+' ya está siendo ocupado por otro académico'));
                    }
                }//if(response)
                $scope.sending=false;
            });//.then
        }//else
    };//agregar

    $scope.limpia = function(){
        $scope.changer.facultad='Seleccionar Facultad';
        $scope.changer.departamento='Seleccionar Departamento';
        $scope.academico.rut = '';
        $scope.academico.nombres = '';
        $scope.academico.apellidos = '';
        $scope.academico.cod_facultad = 0;
        $scope.academico.cod_departamento = 0;
        $scope.academico.tituloProfesional = '';
        $scope.academico.gradoAcademico = '';
        $scope.academico.categoria = '-----';
        $scope.academico.horas = '';
        $scope.academico.tipoPlanta = '';
        $scope.academico.calificacionAnterior = '';
        $scope.academico.estado = 'ACTIVO';

    };
    $scope.limpia();  //limpiamos el datafactory
}]);



















