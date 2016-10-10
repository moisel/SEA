<?php
/*
*PHP
*CheckPermission
*/

	include ("jwt.php");
	//header("Access-Control-Allow-Origin: http://localhost:9000");

	$userToken = trim($_REQUEST['userToken']);
	if($userToken!=null){
		$token = JWT::decode($userToken, 'gr874AD84984reg_rfe687687rgAJHLI65484KHJ56465_4365RGsdg3r4g6er48g3zz');
		if( $token->email && $token->permiso && $token->cod_facultad ){
			echo '"'.$token->cod_facultad.'"';
		}
	}


	?>