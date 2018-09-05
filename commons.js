/* ------------------------------------- COMMONS JQUERY HELPER -----------------------------------------------------*/

function valorDe(unaVariableDelDocumento){
	return $("#"+unaVariableDelDocumento+"").val();
}

function getElemento(unElemento){
	return document.getElementById(unElemento);
}

function valorDeOptionSeleccionado(unInput, unForm){
	return $('input[name='+unInput+']:checked', '#'+unForm+"").val();
}

function checkboxesSeleccionados(unCheckbox){
	var checkboxes = document.getElementsByName(unCheckbox+'[]');
	var vals = [];
	for (var i=0, n=checkboxes.length;i<n;i++) {
    	if (checkboxes[i].checked){
    		vals.push(checkboxes[i].value);
    	}
	}
	return vals;
}

function cambiarValorDe(unaVariableDelDocumento,valor){
	$("#"+unaVariableDelDocumento+"").val(valor);
}

function ocultar(unaVariableDelDocumento){
	getElemento(unaVariableDelDocumento).style.display = 'none';
}

function estaDesactivada(unaVariableDelDocumento){
	return ($("#"+unaVariableDelDocumento+"").prop('disabled')==true);
}

function estaChecked(unaVariableDelDocumento){
	return ($("#"+unaVariableDelDocumento+"").prop('checked')==true);
}

function activar(unaVariableDelDocumento){
	$("#"+unaVariableDelDocumento+"").prop('disabled',false);
}

function desactivar(unaVariableDelDocumento){
	$("#"+unaVariableDelDocumento+"").prop('disabled',true);
}

function vaciar(unaVariableDelDocumento){
	$("#"+unaVariableDelDocumento+"").empty();
}

function agregarA(unaVariableDelDocumento, unValor){
	$("#"+unaVariableDelDocumento+"").append(unValor);
}

function loadEn(unaVariableDelDocumento, otroArchivo){
	$("#"+unaVariableDelDocumento+"").load(otroArchivo);
}

function convertirEnListaDeObjetos(unaRespuesta){
	return jQuery.parseJSON(JSON.stringify(unaRespuesta));
}

function toObject(unaVariable){
	return jQuery.parseJSON(unaVariable);
}

function show(unaVariableDelDocumento){
	$("#"+unaVariableDelDocumento+"").show();
}

function hide(unaVariableDelDocumento){
	$("#"+unaVariableDelDocumento+"").hide();
}

function setValorA(unaVariableDelDocumento, unValor){
	$("#"+unaVariableDelDocumento+"").val(unValor);
}

function modal_show(unModal){
	$("#"+unModal+"").modal('show');
}

function modal_hide(unModal){
	$("#"+unModal+"").modal('hide');
}

function modal_toggle(unModal){
	$("#"+unModal+"").modal('toggle');
}

function irA(unaDireccion){
	window.location.href = unaDireccion;
}

function existe(unaVariable){
	return (document.getElementById(unaVariable) != null);
}

function getBase(){
	return $('base').attr('href');
}

function reload(conAlgo){
	location.reload();
}

function callTrigger(unaVariableDelDocumento, unTrigger){	
	$("#"+unaVariableDelDocumento).trigger(unTrigger);
}

function showInModal(unModal, unContenido){
	vaciar(unModal);
	agregarA(unModal,unContenido);
	modal_show(unModal);
}

function showInSelect(unSelect, opcionesSerializadas){
	vaciar(unSelect);
	$.each(JSON.parse(opcionesSerializadas), function (index,unaOpcion){
		unaOpcion = JSON.parse(unaOpcion);
		var unaOpcionVisible = new Option(unaOpcion.nombre, unaOpcion.id);
		unaOpcionVisible.className = "form-control";
		agregarA(unSelect,unaOpcionVisible);
	});
	activar(unSelect);
}

/* ------------------------------------- COMMONS DEPENDENCIES -----------------------------------------------------*/

function agregarDependenciaPara(unaVariable, otraVariable, valorNoAceptado){
	callTrigger(unaVariable,'change');
	desactivar(unaVariable);
	$('#'+otraVariable).on('change', function(){
		var valorActual = '';
		if(otraVariable.includes('select')){
			valorActual = valorDe(otraVariable+' option:selected');
		}
		else{
			valorActual = valorDe(otraVariable);
		}
		if(valorActual!=valorNoAceptado){
			activar(unaVariable);
		}
		else{
			callTrigger(unaVariable,'change');
			desactivar(unaVariable);
		}
	});
}

/* ------------------------------------- COMMONS AJAX REQUEST -----------------------------------------------------*/
function actionOnResponse(response, unCallBack, aceptaRespuesta, unParametro){
	if(aceptaRespuesta && unParametro!=null) unCallBack(unParametro,response); 
    else if(aceptaRespuesta && unParametro==null)  unCallBack(response);
    else if(unParametro==null) unCallBack();
    else unCallBack(unParametro);
}

function llevaHeader(unTipoDePedido){
	var losQueLlevan = ['POST','PUT','DELETE'];
	return (losQueLlevan.includes(unTipoDePedido));
}

function addHeader(){
	$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    })
}

function dataTypeTo(request){
	switch(request){
		case "POST": return "json"; break;
		case "PUT": return "json"; break;
		default: return ""; break;
	}
}

function sendAjax(type, url, datos, unCallBack, aceptaRespuesta, unParametro){
	if(llevaHeader(type)) addHeader();
	$.ajax({
        type: type,
        dataType: dataTypeTo(type),
        data: datos,
        url: url,
        success: function (response) {
        	actionOnResponse(response, unCallBack, aceptaRespuesta, unParametro);
        }
    });
}

function postPara(unaURL, unosDatos, unCallBack, aceptaRespuesta = false , unParametro = null){
	sendAjax("POST",unaURL,unosDatos, unCallBack, aceptaRespuesta, unParametro);
}

function getPara(unaURL,unCallBack, aceptaRespuesta = false , unParametro = null){
	sendAjax("GET",unaURL,{}, unCallBack, aceptaRespuesta, unParametro);
}

function putPara(unaURL, unosDatos, unCallBack, aceptaRespuesta = false , unParametro = null){
	sendAjax("PUT",unaURL,unosDatos, unCallBack, aceptaRespuesta, unParametro);
}

function deletePara(unaURL, unCallBack, aceptaRespuesta = false , unParametro = null){
	sendAjax("DELETE",unaURL,{}, unCallBack, aceptaRespuesta, unParametro);
}

/* ------------------------------------- COMMONS URLs ---------------------------------------------------------*/
function generate_url(urlBase, parametros = []){
	var urlFinal = getBase() + urlBase;
	parametros.forEach(function (unParametro){
			urlFinal += "/"+unParametro;
	});
	return urlFinal;
}

/* ------------------------------------- COMMONS LOADERS ------------------------------------------------------*/
$(document).ajaxStart(function(){
	show('loader');
	show('loader-modal');
});

$(document).ajaxComplete(function(){
	hide('loader');
	hide('loader-modal');
});