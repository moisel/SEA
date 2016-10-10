'use strict';

/**
 * @ngdoc service
 * @name seaApp.fileUpload
 * @description
 * # fileUpload
 * Service in the seaApp.
 */
angular.module('seaApp')
.service('fileUpload', ['$http','sweet', 'alerts', function ($http, sweet, alerts) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        var promise=$http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function(response){
            sweet.show(alerts.dinamic(response.data));
            return response;
        }, function(response){
            sweet.show(alerts.error());
        });
        return promise;
    }
}]);
