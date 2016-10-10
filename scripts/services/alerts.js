'use strict';

/**
 * @ngdoc service
 * @name seaApp.alerts
 * @description
 * # alerts
 * Service in the seaApp.
 */
 angular.module('seaApp')
 .service('alerts', function () {//servicio creado para administrar las alertas de sweet alerts
 	return {
    edit: function(){
     return {
      title: 'Datos Actualizados',
      text: 'Los datos han sido actualizados correctamente',
      type: 'success',
      confirmButtonText: "Continuar",
      }//edit.return
    },//edit 
    new: function(msg){
      return {
       title: 'Datos Ingresados',
       text: msg,
       type: 'success',
       confirmButtonText: "Continuar",
      }//new.return
    },//new 
    warning: function(msg, title){
      return {
       title: title,
       text: msg,
       type: 'warning',
       confirmButtonText: "Continuar",
      }//warning.return
    },//warning 
    choose: function(msg, title, close){
      return {
       title: title,
       text: msg,
       type: 'warning',
       showCancelButton: true,
       closeOnConfirm: close,//true: cerrará inmediatamente los diálogos al confirmar, false: permitirá a otros dialogos aparecer a continuación
       confirmButtonText: "Confirmar",
       cancelButtonText: "Cancelar"
      }//choose.return
    },//choose 
    duplicated: function(msg){
      return {
       title: 'Datos Duplicados',
       text: msg,
       type: 'error',
       confirmButtonText: "Continuar",
      }//duplicated.return
    },//duplicated 
    error: function(){
     return {
       title: 'Error',
       text: 'Ocurrió un error inesperado',
       type: 'error',
       confirmButtonText: "Continuar",
      }//error.return
    },//error
    dinamic: function(msg){//respuestas del servidor generalmente
     return {
      title: 'Respuesta',
      text: msg,
      confirmButtonText: "Continuar",
      }//dinamic.return
    },//custom
    dinamicError: function(msg){
      return {
        title: 'Error',
        text: msg,
        type: 'error',
        confirmButtonText: "Continuar",
      }//dinamicError.return
    }//dinamicError
  }//alerts.return
});//alerts
