'use strict';

/**
 * @ngdoc service
 * @name seaApp.evaFasteners
 * @description
 * # evaFasteners
 * Service in the seaApp.
 */
 angular.module('seaApp')
 .service('evaFasteners', function () {
 	return{
 		CambiarInicialesPorEscala:function(escala){
 			switch(escala){
 				case 'E':
 				return 'Exelente';
 				break;
 				case 'MB':
 				return 'Muy Bueno';
 				break;
 				case 'B':
 				return 'Bueno';
 				break;
 				case 'R':
 				return 'Regular';
 				break;
 				case 'D':
 				return 'Deficiente';
 				break;
	  		}//swtch(escala)
 		},//CambiarInicialesPorEscala
 		selectorDeEscalas:function(x){
 			switch(true) {
				case (x >= 4.5 && x <= 5):
					return 1;
				case (x >= 4 && x <= 4.4):
					return 2;
				case (x >= 3.5 && x <= 3.9):
					return 3;
				case (x >= 2.7 && x <= 3.4):
					return 4;
				case (x < 2.7 && x >= 0):
					return 5;
				case (x > 5 || x < 0):
					return null;
			}//switch
 		},//selectorDeEscalas
 		CambiarValorPorEscala:function(x){
 			switch(true){
			    case (x >= 4.5 && x <= 5):
			    return 'Exelente';
			    case (x >= 4 && x <= 4.4):
			    return 'Muy Bueno';
			    case (x >= 3.5 && x <= 3.9):
			    return 'Bueno';
			    case (x >= 2.7 && x <= 3.4):
			    return 'Regular';
			    case (x < 2.7 && x >= 0):
			    return 'Deficiente';
			    case (x > 5 || x < 0):
			    return null;
  			}//switch
 		}//CambiarValorPorEscala
 	}//evaFasteners.reurn
});//evaFasteners
