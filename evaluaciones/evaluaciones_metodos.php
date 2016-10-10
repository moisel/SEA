<?php
/*
*PHP
*Evaluaciones
*Metodos
*/
class Evaluacion extends SEA {

	function __construct($conn, $token){
		parent::__construct($conn, $token);	
	}
function ver(){//ve todas las evaluaciones existentes
	$result = $this->conn->query('SELECT * FROM evaluacion');
	$this->imprimir($result);
}
function verPorPeriodo($inicioPeriodo){//las evaluaciones de la universidad de acuerdo aun periodo
	$result = $this->conn->query('SELECT * FROM evaluacion WHERE inicioPeriodo = "'.$inicioPeriodo.'"');
	$this->imprimir($result);
}
function verEvaluacion($rutAcademico, $inicioPeriodo){//ve una evaluación en particular 
	$result = $this->conn->query('SELECT * FROM evaluacion WHERE rutAcademico = "'.$rutAcademico.'" AND inicioPeriodo = "'.$inicioPeriodo.'"');	
	$this->imprimir($result);

}
function evaluacionesAcademico($rutAcademico){//revisa TODAS las evaluaciones de un academico
	$result = $this->conn->query('SELECT * FROM evaluacion WHERE rutAcademico = "'.$rutAcademico.'"');
	$this->imprimir($result);	
}
function verPorFacultad($cod_facultad){//ve las evaluaciones existentes en una facultad
	$result = $this->conn->query('SELECT * FROM evaluacion WHERE cod_facultad = "'.$cod_facultad.'"');
	$this->imprimir($result);
}
function verPorDepartamento($cod_departamento){//ve las evaluaciones existentes en un Departamento
	$result = $this->conn->query('SELECT * FROM evaluacion WHERE cod_departamento = "'.$cod_departamento.'"');
	$this->imprimir($result);
}
function verPeriodoFacultad($cod_facultad, $inicioPeriodo){//ve las evaluaciones para un periodo en una facultad
	$result = $this->conn->query('SELECT * FROM evaluacion WHERE
	 cod_facultad = "'.$cod_facultad.'"
	 AND inicioPeriodo = "'.$inicioPeriodo.'"');
	$this->imprimir($result);
}
function verPeriodoDepartamento($cod_departamento, $inicioPeriodo){
	$result = $this->conn->query('SELECT * FROM evaluacion WHERE
	 cod_departamento = "'.$cod_departamento.'"
	 AND inicioPeriodo = "'.$inicioPeriodo.'"');
	$this->imprimir($result);
}
function evaluarAcademico($request){//evalua a un academico
	$result = $this->conn->query('SELECT * FROM evaluacion WHERE rutAcademico = "' . $request['rutAcademico'] . '"
		AND inicioPeriodo = "inicioPeriodo" ');
	$check = mysqli_num_rows($result);

	if($check === 0){
		if($this->existePeriodo() === 1){
			$sql = 'INSERT INTO evaluacion (rutAcademico, 
				nombresAcademico, apellidosAcademico, cod_facultad, 
				cod_departamento, tituloProfesionalAcademico, horasAcademico,
				categoriaAcademico, gradoAcademico, tipoPlantaAcademico,
				calificacionAnteriorAcademico, 
				tiempo1, tiempo2, tiempo3, tiempo4, tiempo5,
				nota1, nota2, nota3, nota4, nota5, 
				ponderado1, ponderado2, ponderado3, ponderado4, ponderado5, 
				rutComision, miembro1Comision, miembro2Comision, decanoComision, 
				secretario, inicioPeriodo, finPeriodo, fecha, argumento, notaFinal) 
VALUES (
	"'.$request['rutAcademico'].'",
	"'.$request['nombresAcademico'].'",
	"'.$request['apellidosAcademico'].'",
	"'.$request['cod_facultad'].'",
	"'.$request['cod_departamento'].'",
	"'.$request['tituloProfesionalAcademico'].'",
	"'.$request['horasAcademico'].'",
	"'.$request['categoriaAcademico'].'",
	"'.$request['gradoAcademico'].'",
	"'.$request['tipoPlantaAcademico'].'",
	"'.$request['calificacionAnteriorAcademico'].'",
	"'.$request['tiempo1'].'",
	"'.$request['tiempo2'].'",
	"'.$request['tiempo3'].'",
	"'.$request['tiempo4'].'",
	"'.$request['tiempo5'].'",
	"'.$request['nota1'].'",
	"'.$request['nota2'].'",
	"'.$request['nota3'].'",
	"'.$request['nota4'].'",
	"'.$request['nota5'].'",
	"'.$request['ponderado1'].'",
	"'.$request['ponderado2'].'",
	"'.$request['ponderado3'].'",
	"'.$request['ponderado4'].'",
	"'.$request['ponderado5'].'",
	"'.$request['rutComision'].'",
	"'.$request['miembro1Comision'].'",
	"'.$request['miembro2Comision'].'",
	"'.$request['decanoComision'].'",
	"' .$this->token->nombre.' '.$this->token->apellidos.'",
	"'.$request['inicioPeriodo'].'",
	"'.$request['finPeriodo'].'",
	"'.date("Y-m-d").'",
	"'.$request['argumento'].'",
	"'.$request['notaFinal'].'"
	)';
$this->conn->query($sql);
$this->logg('Evalúa a Académico con rut '.$request['rutAcademico'].'');
print('"Evaluación reaizada con éxito"');
		}else{//if(existePeriodo($conn) === 1)
			print('"Se ha cerrado el Periodo de Evaluación"');
		}
	}else{
		print('"El academico ya ha sido evaluado en este periodo"');
	}
}//fin evaluar academico
function editarEvaluacion($request){

	if($this->existePeriodo() === 1){
			$sql = 'UPDATE evaluacion
			SET 
			tiempo1 = "' .$request['tiempo1'].'",
			tiempo2 = "' .$request['tiempo2'].'",
			tiempo3 = "' .$request['tiempo3'].'",
			tiempo4 = "' .$request['tiempo4'].'",
			tiempo5 = "' .$request['tiempo5'].'",
			nota1 = "' .$request['nota1'].'",
			nota2 = "' .$request['nota2'].'",
			nota3 = "' .$request['nota3'].'",
			nota4 = "' .$request['nota4'].'",
			nota5 = "' .$request['nota5'].'",
			ponderado1 = "' .$request['ponderado1'].'",
			ponderado2 = "' .$request['ponderado2'].'",
			ponderado3 = "' .$request['ponderado3'].'",
			ponderado4 = "' .$request['ponderado4'].'",
			ponderado5 = "' .$request['ponderado5'].'",
			secretario = "' .$this->token->nombre.' '.$this->token->apellidos.'",
			fecha = "' .date("Y-m-d").'",
			argumento = "' .$request['argumento'].'",
			notaFinal = "' .$request['notaFinal'].'"
			WHERE rutAcademico = "'.$request['rutAcademico'].'" AND inicioPeriodo = "0"';
			$this->conn->query($sql);
			$this->logg('Edita Evaluación a Académico con rut '.$request['rutAcademico'].'');
			print('"Evaluación Actualizada"');
		}else{//if(existePeriodo($conn) === 1)
			print('"Se ha cerrado el Periodo de Evaluación"');
		}

}//fin edita evaluacion
function existePeriodo(){//revisa si existe un periodo activo para evaluar
	$result = $this->conn->query('SELECT * FROM periodo WHERE estado = "ACTIVO"');	
	return mysqli_num_rows($result);
}
function imprimir($result){//usado sólamente por los gráficos
	$outp = "";//String que convertiremos al formato JSON
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if ($outp != "") {$outp .= ",";}
		$outp .= '{"rutAcademico":"'  . $rs["rutAcademico"] . '",';
		$outp .= '"nombresAcademico":"'   . $rs["nombresAcademico"] . '",';
		$outp .= '"apellidosAcademico":"'   . $rs["apellidosAcademico"] . '",';
		$outp .= '"cod_facultad":"'   . $rs["cod_facultad"] . '",';
		$outp .= '"cod_departamento":"'   . $rs["cod_departamento"] . '",';
		$outp .= '"tituloProfesionalAcademico":"'   . $rs["tituloProfesionalAcademico"] . '",';
		$outp .= '"horasAcademico":"'   . $rs["horasAcademico"] . '",';
		$outp .= '"categoriaAcademico":"'   . $rs["categoriaAcademico"] . '",';
		$outp .= '"gradoAcademico":"'   . $rs["gradoAcademico"] . '",';
		$outp .= '"tipoPlantaAcademico":"'   . $rs["tipoPlantaAcademico"] . '",';
		$outp .= '"calificacionAnteriorAcademico":"'   . $rs["calificacionAnteriorAcademico"] . '",';
		$outp .= '"tiempo1":"'   . $rs["tiempo1"] . '",';
		$outp .= '"tiempo2":"'   . $rs["tiempo2"] . '",';
		$outp .= '"tiempo3":"'   . $rs["tiempo3"] . '",';
		$outp .= '"tiempo4":"'   . $rs["tiempo4"] . '",';
		$outp .= '"tiempo5":"'   . $rs["tiempo5"] . '",';
		$outp .= '"nota1":"'   . $rs["nota1"] . '",';
		$outp .= '"nota2":"'   . $rs["nota2"] . '",';
		$outp .= '"nota3":"'   . $rs["nota3"] . '",';
		$outp .= '"nota4":"'   . $rs["nota4"] . '",';
		$outp .= '"nota5":"'   . $rs["nota5"] . '",';
		$outp .= '"ponderado1":"'   . $rs["ponderado1"] . '",';
		$outp .= '"ponderado2":"'   . $rs["ponderado2"] . '",';
		$outp .= '"ponderado3":"'   . $rs["ponderado3"] . '",';
		$outp .= '"ponderado4":"'   . $rs["ponderado4"] . '",';
		$outp .= '"ponderado5":"'   . $rs["ponderado5"] . '",';
		$outp .= '"rutComision":"'   . $rs["rutComision"] . '",';
		$outp .= '"miembro1Comision":"'   . $rs["miembro1Comision"] . '",';
		$outp .= '"miembro2Comision":"'   . $rs["miembro2Comision"] . '",';
		$outp .= '"decanoComision":"'   . $rs["decanoComision"] . '",';
		$outp .= '"secretario":"'   . $rs["secretario"] . '",';
		$outp .= '"inicioPeriodo":"'   . $rs["inicioPeriodo"] . '",';
		$outp .= '"finPeriodo":"'   . $rs["finPeriodo"] . '",';
		$outp .= '"fecha":"'   . $rs["fecha"] . '",';
		$outp .= '"argumento":"'   . $rs["argumento"] . '",';
		$outp .= '"notaFinal":"'   . $rs["notaFinal"] . '"}'; 
		}//while($rs = $result->fetch_array(MYSQLI_ASSOC))

		$outp ='{"records":['.$outp.']}';
		echo($outp);
}//function imprimir($result)
}//Evaluaciones
?> 
