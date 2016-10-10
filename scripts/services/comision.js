'use strict';

/**
 * @ngdoc service
 * @name seaApp.Comision
 * @description
 * # Comision
 * Factory in the seaApp.
 */
 angular.module('seaApp')
 .factory('Comision', function () {
    // Service logic
    // ...
    return [
    {
      anio: '',
      cod_facultad: '',
      rut: '',
      decano: '', 
      miembro1: '', 
      miembro2: '', 
      fechaPie: '',
      estado: '',
      nombreFacultad: ''//auxiliar para acarrear nombre
    },
    ];
  });
