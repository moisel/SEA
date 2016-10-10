<?php
class Periodo extends SEA {

	function __construct($conn, $token){
		parent::__construct($conn, $token);	
	}
function ver(){//sólo trae los activos
	$result = $this->conn->query('SELECT * FROM periodo WHERE estado = "INACTIVO"');

	$outp = "";//String que convertiremos al formato JSON
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"inicio":"'  . $rs["inicio"] . '",';
		$outp .= '"fin":"'   . $rs["fin"] . '",';
		$outp .= '"estado":"'   . $rs["estado"] . '"}'; 
	}

	$outp ='{"records":['.$outp.']}';
	echo($outp);
}
function existePeriodo($imprimir){//imprimir para este método es un bool
	$result = $this->conn->query('SELECT * FROM periodo WHERE estado = "ACTIVO"');
	if($imprimir) {
		print (mysqli_num_rows($result));
	}	
	return mysqli_num_rows($result);
}
function iniciar($inicioPeriodo) {
	if($this->existePeriodo(false) === 0){
		$result = $this->conn->query('SELECT * FROM periodo WHERE inicio = "'.$inicioPeriodo.'"');
		$check = mysqli_num_rows($result);
		if($check === 0){
			$sql = 'INSERT INTO periodo (inicio, fin, estado) 
			VALUES (
				"' . $inicioPeriodo . '",
				"' . date("Y-m-d") . '",
				"ACTIVO"
				)';
			$this->conn->query($sql);
			$this->logg('Inicia Periodo '.$inicioPeriodo.'');
			print('"Periodo Iniciado!"');
		}else{//if($check === 0)
			print('"El año elegido ya ha sido evaluado"');
		}//else	
		/*print('"Periodo Iniciado!' . date("Y-m-d H:i:s") . '"');	*/
	}else{
		print('"Ya existe un Periodo iniciado"');
	}
}
function finalizar(){
	if($this->existePeriodo(false)===0){
		print('"No existe periodo para finalizar"');
	}else{
		$this->actualizarTermino();
	}
}
function actualizarTermino(){
	$sql ='UPDATE periodo SET fin = "' . date("Y-m-d") . '" WHERE estado = "ACTIVO"';
	$this->conn->query($sql);
	$this->actualizarCalificacionAnterior();

}
function actualizarCalificacionAnterior(){
	$sql = 'UPDATE academico INNER JOIN evaluacion ON
	evaluacion.inicioPeriodo = "inicioPeriodo" AND
	evaluacion.rutAcademico = academico.rut
	SET academico.calificacionAnterior = evaluacion.notaFinal';
	$this->conn->query($sql);
	$this->actualizarPeriodoCalificacionesRecientes();

}
function actualizarPeriodoCalificacionesRecientes(){
	$sql = 'UPDATE evaluacion INNER JOIN periodo ON
	evaluacion.inicioPeriodo = "inicioPeriodo" 
	SET evaluacion.inicioPeriodo = periodo.inicio,
	evaluacion.finPeriodo = periodo.fin
	WHERE periodo.estado = "ACTIVO"';
	$this->conn->query($sql);
	$this->cerrarPeriodo();
}

function cerrarPeriodo(){
	$sql = 'UPDATE periodo
	SET estado = "INACTIVO"
	WHERE estado = "ACTIVO"';
	$this->conn->query($sql);
	$this->logg('Logra Finalizar Periodo');
	print('"Periodo Finalizado!"');
}
}//Periodo
?> 
