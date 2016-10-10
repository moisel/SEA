'use strict';

/**
 * @ngdoc service
 * @name seaApp.Departamento
 * @description
 * # Departamento
 * Factory in the seaApp.
 */
 angular.module('seaApp')
 .factory('Departamento', function () {
    // Service logic
    // ...

    return [
    {
      cod_departamento: '',
      nombre: '', 
      cod_facultad: '', 
      estado: ''
    },
    ];
  });
