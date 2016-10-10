
'use strict';

/**
 * @ngdoc service
 * @name seaApp.Facultad
 * @description
 * # Facultad
 * Factory in the seaApp.
 */
angular.module('seaApp')
  .factory('Facultad', function () {
    // Service logic
    // ...

    return [
  {
    cod_facultad: '',
    nombre: '', 
    decano: '', 
    estado: '',
  },
  ];
  });
