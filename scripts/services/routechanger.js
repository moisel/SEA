'use strict';

/**
 * @ngdoc service
 * @name seaApp.RouteChanger
 * @description
 * # RouteChanger
 * Service in the seaApp.
 */
angular.module('seaApp')
  .service('RouteChanger', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return{
    changeRoute: function(url, forceReload, $scope){
      $scope = $scope || angular.element(document).scope();
        if(forceReload || $scope.$$phase) { //están bien los dos signos $$.
          window.location = url;
        } else {
         $location.path(url);
         $scope.$apply();
       }
     }
   }
  });
