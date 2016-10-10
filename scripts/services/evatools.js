'use strict';

/**
 * @ngdoc service
 * @name seaApp.evaTools
 * @description servicio que contiene todas las herramientas necesarias para 
 * operar los valores de la tabla de evaluación de un académico
 * # evaTools
 * Service in the seaApp.
 */
 angular.module('seaApp')
 .service('evaTools', ["evaFasteners", function (evaFasteners) {//herramientas para la tabla de evaluación 
 	return{
 		/**
		  * Método que calcula la nota final, sumando todas las notas ponderadas
		  * @method calcularNotaFinal
		  * @param {object} scope objeto nativo de AngularJS inicializado en otro controlador
		  */
		 calcularNotaFinal:function(scope){
 			var calculo = 0;
  			angular.forEach(scope.rows, function(row){
  				var aux = parseFloat(scope.cells[scope.columns[6]+row]); // tomamos cada nota ponderada
  				if(!isNaN(aux)){
  					calculo += aux;
     			}
   			});//angular.forEach
        //scope.nota = this.myToFixed(parseFloat(calculo), 1); // le pasamos el calculo a la nota final truncada
        scope.nota = Math.round(calculo * 10) / 10;
   			scope.escala = evaFasteners.CambiarValorPorEscala(scope.nota);
 		},//calcularNotaFinal
 		/**
		  * Método que evalúa si se ha alcanzado el 100%
      * en los porcentajes asignados para cada actividad
      * y borra el último valor ingresado en caso de sobrepasar el 100%
		  * @method tope
      * @param {object} scope objeto nativo de AngularJS inicializado en otro controlador
		  */
		 tope:function(scope){
 			var porcentaje = 0;
  			angular.forEach(scope.rows, function(row){
  				var aux = parseFloat(scope.cells[scope.columns[0]+row]);
  				if(!isNaN(aux)){
  					if((porcentaje + aux) <= 100){
  						porcentaje += aux;
  					}else{
  						scope.cells[scope.columns[0]+row] = '';
  					}
  				}//if(!isNaN(aux))		
  			});//angular.forEach
 		},//tope
 		/**
		  * Método que calcula la nota ponderada para cada fila
		  * @method compute
		  * @param {object} scope objeto nativo de AngularJS inicializado en otro controlador
		  * @param {string} row nombre de la fila a la cual se le está calculando la nota final
		  * @return 
		  */
		 compute:function(scope, row){
 			var nota = this.myToFixed(((scope.cells[scope.columns[0]+row] * scope.rows[row])/100), 2); // porcentaje por la nota
		    if(!isNaN(nota)){ // si existe una nota
		      scope.cells[scope.columns[6]+row] = parseFloat(nota); // se la pondremos en el lugar en el que van las notas ponderadas
		    }else{ // de no existir
		      scope.cells[scope.columns[6]+row] = ''; // no se pondera nada
		    }
 		},//compute
 		/**
		  * Método que se encarga de borrar elementos inválidos ingresados en la tabla de evaluación
		  * @method validar
		  * @param {object} scope objeto nativo de AngularJS inicializado en otro controlador
		  * @param {boolean} invalido booleano que tendrá el valor true si la celda contiene valores erroneos
		  * @param {boolean} pristine booleano que tendrá el valor true si la celda no ha sido manipulada
		  * @param {string} column nombre que sirve para referenciarse a la celda que se está validando
		  * @param {string} row nombre que sirve para referenciarse a la celda que se está validando
		  */
		 validar:function(scope, invalido, pristine, column, row){
 			var tiempoAsignado = scope.cells[scope.columns[0]+row];
		    if(pristine){//si no ha sido tocado
		      if((invalido ||
		        tiempoAsignado==='' ||
		        tiempoAsignado===undefined ||
		        tiempoAsignado===0))
		      { //y es un caracter inválido, o no existe un tiempo asignado
		        this.limpia(scope, null, row, '');
		      }
		    }//if(pristine)
 		},//validar
 		/**
		  * Método que mueve el valor ingresado a la fila donde debe ir
      * además verifica antes de mover una nota si existe un 
      * porcentaje de evaluación, de lo contrario la borra
      * <<este método además remueve los valores iguales a cero
      * que se encuentran en los bordes de la tabla (donde van los porcentajes y
      * donde van las notas ponderadas), sería bueno separar esta caracterísica
      * en otro método para no tener métodos tan multiuso>>
		  * @method move
      * @param {object} scope objeto nativo de AngularJS inicializado en otro controlador
		  * @param {string} column nombre que sirve para referenciarse a la columna de la celda que contiene la nota 
		  * @param {string} row nombre que sirve para referenciarse a la fila de la celda que contiene la nota 
		  */
		 move:function(scope, column, row){
 			this.recortarValores(scope, column, row); // primero, recortamos valores
			var aux = scope.columns.indexOf(column); // tomamos la columna
			if(aux !=0 && aux !=6){ // si no es ninguna del borde
			    var x = parseFloat(scope.cells[column+row]); // entonces tomamos el valor nuevo
			    if(!isNaN(x)){ // si no es un NaN (espacio en blanco y esas cosas)
			    	var escala = evaFasteners.selectorDeEscalas(x);
			    	if(escala != null){ // si la nota ingresada está dentro de la escala
			        	this.limpia(scope, escala, row, x); // la movemos a donde corresponde (independiente de si ya se encuentra donde corresponde)
			     	}else{
			        	this.limpia(scope, null, row, ''); // si computa mal, borramos la nota de la fila
			      }//else
			    }else{//else if(!isNaN(x))
			      var notas = false;
			      for(var i = 0; i < 5; i++){ // recorremos si es que existe una nota en la fila
			        var x = parseFloat(scope.cells[scope.columns[i+1]+row]);
			        if(!isNaN(x)){
			          notas = true; // encontramos una nota computada
			        }//if
			      }//for
			      if(!notas){ // si no existe una nota computada en la fila
			        scope.rows[row]=''; // no hay nota ponderada
			      }//if
			    }//else
			}else{//si es un elemento del borde
				if(parseFloat(scope.cells[column+row])==0){ // aprovechamos de ver si es un 0
					scope.cells[column+row]=''; // si es un 0 lo removemos (no tiene sentido)
				}//if
			}//else
 		},//move
 		/**
		  * Método que limpia una fila, además,
      * si le pasamos una column pondrá el parámetro nota en la correspondiente columna y fila
      * (parámetros column y row)
      * además guardará la nota de la fila en el arreglo rows
      * ojo, column es el número de la columna, no una string con el nombre como
      * se suele utilizar
		  * @method limpia
      * @param {object} scope objeto nativo de AngularJS inicializado en otro controlador
		  * @param {int|null} column número que representa la posición de la columna que se quiere poner la nota
      * si este valor es nulo, este método sólo se encargará de limpiar la correspondiente fila (parámetro row)
      * @param {string} row nombre que sirve para referenciarse a la fila de la celda que contiene la nota 
		  * @param {float} nota número que representa la nota para la fila y que corresponde mover a donde corresponde
		  */
		 limpia:function(scope, column, row, nota){
 			for (var i = 0; i < 5; i++){ // limpiamos la fila completa
  				scope.cells[scope.columns[i+1]+row]='';
  		}//for
			if(column!=null){ // si le hemos pasado una columna
				scope.cells[scope.columns[column]+row]=nota; // será la que contendrá la nota
			}//if
			scope.rows[row]=nota;//guardamos la nota de la fila
 		},//limpia
 		/**
		  * Método que trunca un valor después del punto al tamaño que se requiera
      * EJEMPLO number = 4.386, precision = 2, return = 4.38 (truncar no redondea)
		  * @method myToFixed
		  * @param {float} number valor que se pretende truncar
		  * @param {int} precision cantidad de dígitos que se pretenden dejar después del punto
		  * @return valor recortado (ver ejemplo en la descripción del métdod)
		  */
		 myToFixed:function(number, precision){
 			var multiplier  = Math.pow( 10, precision + 1 ),
 			wholeNumber = Math.round(number*multiplier).toString(),
 			length = wholeNumber.length - 1;
 			wholeNumber = wholeNumber.substr(0, length);
 			return [
 			wholeNumber.substr(0, length - precision),
 			wholeNumber.substr(-precision)
 			].join('.');
 		},//myToFixed
 		/**
		  * Método que recorta la nota correspondiente a la actividad con el método myToFixed
      * pero de "forma segura", preocupandose de que no se esté pasando
      * como parámetro alguno de los valores correspondientes a los bordes
      * de la tabla (ni el porcentaje ni la nota ponderada)
		  * @method recortarValores
		  * @param {object} scope objeto nativo de AngularJS inicializado en otro controlador
		  * @param {string} column nombre que sirve para referenciarse a la columna de la celda que contiene la nota 
      * @param {string} row nombre que sirve para referenciarse a la fila de la celda que contiene la nota 
		  */
		 recortarValores:function(scope, column, row){
 			var borde = scope.columns.indexOf(column); // vemos si es un valor del borde
    		var aux = scope.cells[column+row];
    		if (!isNaN(aux) && 
      			aux!=undefined && 
      			aux!='' && 
       			borde !=0 && borde !=6 // y no es ninguno de los valores del borde
       		){
      			scope.cells[column+row]=this.myToFixed(parseFloat(aux), 1);
  			}//if
 		}//recortarValores
 	}//evaTools.return
 }]);//evaTools
