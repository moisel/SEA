
'use strict';

/**
 * @ngdoc service
 * @name seaApp.Usuario
 * @description
 * # Usuario
 * Factory in the seaApp.
 */
 angular.module('seaApp')
 .factory('Usuario', function () {
    // Service logic
    // ...

    return [
    {
      email: '',
      permiso: '',
      cod_facultad: '',
      rut: '', 
      pass: '', 
      nombre: '', 
      apellidos: '',  
      estado: ''
    },
    ];
  });
