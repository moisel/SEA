<?php
/*
*PHP
*Academicos
*Metodos
*/
class Academico extends SEA {

	function __construct($conn, $token){
		parent::__construct($conn, $token);	
	}
	function ver(){
		if(strcmp($this->token->permiso, 'Administrador')==0){
			$result = $this->conn->query('SELECT A.*, B.cod_facultad FROM academico A, departamento B WHERE A.cod_departamento = B.cod_departamento');//o mostramos todos
		}else{//o mostramos los que corresponden
			$result = $this->conn->query('SELECT A.*, B.cod_facultad FROM academico A, departamento B WHERE A.cod_departamento = B.cod_departamento AND B.cod_facultad = "' . $this->token->cod_facultad . '"');
		}
		$this->imprimir($result);
	}
	function verPorFacultad($cod_facultad){
		$result = $this->conn->query('SELECT A.*, B.cod_facultad FROM academico A, departamento B WHERE A.cod_departamento = B.cod_departamento AND B.cod_facultad = "' . $cod_facultad . '"');
		$this->imprimir($result);
	}
	function agregarAcademico($data){
		$result = $this->conn->query('SELECT * FROM academico WHERE rut = "' . $data['rut'] . '"');
		$check = mysqli_num_rows($result);
		if($check === 0 && (strcmp($data['rut'], '')!=0)){
			$sql = 'INSERT INTO academico (rut, nombres, apellidos, cod_departamento, tituloProfesional, horas, categoria, gradoAcademico, tipoPlanta, estado) 
			VALUES (
				"' . $data['rut'] . '",
				"' . $data['nombres'] . '",
				"' . $data['apellidos'] . '",
				"' . $data['cod_departamento'] . '",
				"' . $data['tituloProfesional'] . '",
				"' . $data['horas'] . '",
				"' . $data['categoria'] . '",
				"' . $data['gradoAcademico'] . '",
				"' . $data['tipoPlanta'] . '",
				"ACTIVO"
				)';
$this->conn->query($sql);
$this->logg('Ingresa nuevo académico con rut '.$data['rut'].'');
				print(true);//academico ingresado correctamente
			}else{//if($check === 0){
				print(false);//el rut del academico ya está ocupado
			}
		}//agregarAcademico

		function existePeriodo(){//revisa si existe un periodo activo para evaluar
			$result = $this->conn->query('SELECT * FROM periodo WHERE estado = "ACTIVO"');	
			return mysqli_num_rows($result);
		}

		function editarAcademico($data){

			if($this->existePeriodo() === 1){
				$sql1 = 'UPDATE evaluacion
				SET
				cod_facultad = "' . $data['cod_facultad'] . '",
				cod_departamento = "' . $data['cod_departamento'] . '",
				tituloProfesionalAcademico = "' . $data['tituloProfesional'] . '",
				horasAcademico = "' . $data['horas'] . '",
				categoriaAcademico = "' . $data['categoria'] . '",
				gradoAcademico  = "' . $data['gradoAcademico'] . '",
				tipoPlantaAcademico = "' . $data['tipoPlanta'] . '"
				WHERE rutAcademico = "' . $data['rut'] . '" AND inicioPeriodo = 0';
				$this->conn->query($sql1);
			}//if(existePeriodo)

			$sql2 = 'UPDATE evaluacion
			SET
			nombresAcademico = "' . $data['nombres'] . '",
			apellidosAcademico = "' . $data['apellidos'] . '"
			WHERE rutAcademico = "' . $data['rut'] . '"';

			$this->conn->query($sql2);

			$sql3 = 'UPDATE academico 
			SET 
			nombres = "' . $data['nombres'] . '",
			apellidos = "' . $data['apellidos'] . '",
			cod_departamento = "' . $data['cod_departamento'] . '",
			tituloProfesional = "' . $data['tituloProfesional'] . '",
			horas = "' . $data['horas'] . '",
			categoria = "' . $data['categoria'] . '",
			gradoAcademico = "' . $data['gradoAcademico'] . '",
			tipoPlanta = "' . $data['tipoPlanta'] . '",
			estado = "' . $data['estado'] . '"
			WHERE rut = "' . $data['rut'] . '"';
			$this->conn->query($sql3);
			$this->logg('Edita académico con rut '.$data['rut'].'');
			print(true);//datos actualizados correctamente
		}//editarAcademico
		function verActivos($cod_facultad){
			$result = $this->conn->query('SELECT A.*, B.cod_facultad FROM academico A, departamento B WHERE A.cod_departamento = B.cod_departamento AND B.cod_facultad = "' . $cod_facultad . '" AND A.estado = "ACTIVO"');
			$this->imprimir($result);

		}

		function imprimir($result){
		$outp = "";//String que convertiremos al formato JSON
		while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
			if ($outp != "") {$outp .= ",";}
			$outp .= '{"rut":"'  . $rs["rut"] . '",';
			$outp .= '"nombres":"'   . $rs["nombres"] . '",';
			$outp .= '"apellidos":"'   . $rs["apellidos"] . '",';
			$outp .= '"cod_facultad":"'   . $rs["cod_facultad"] . '",';
			$outp .= '"cod_departamento":"'   . $rs["cod_departamento"] . '",';
			$outp .= '"tituloProfesional":"'   . $rs["tituloProfesional"] . '",';
			$outp .= '"horas":"'   . $rs["horas"] . '",';
			$outp .= '"categoria":"'   . $rs["categoria"] . '",';
			$outp .= '"gradoAcademico":"'   . $rs["gradoAcademico"] . '",';
			$outp .= '"tipoPlanta":"'   . $rs["tipoPlanta"] . '",';
			$outp .= '"calificacionAnterior":"'   .$rs["calificacionAnterior"].'",';
			$outp .= '"estado":"'   . $rs["estado"] . '"}'; 
		}

		$outp ='{"records":['.$outp.']}';
		echo($outp);
	}
}//Academico
?> 
