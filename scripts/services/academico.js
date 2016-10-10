'use strict';

/**
 * @ngdoc service
 * @name seaApp.Academico
 * @description
 * # Academico
 * Factory in the seaApp.
 */
 angular.module('seaApp')
 .factory('Academico', function () {
    // Service logic
    // ...

    return [
    {
      rut:'',
      nombres: '', 
      apellidos: '',
      cod_facultad: '',
      cod_departamento: '',//auxiliar para acarrear cod departamento
      tituloProfesional: '',
      horas: '', 
      categoria: '',
      gradoAcademico: '', 
      tipoPlanta: '', 
      calificacionAnterior: '',
      departamento: '', 
      estado: ''
    },
    ];
  });//.factory Academico
