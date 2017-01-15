
//public variables, if the html is changed in the future
//easier to adapt this code

var cssFalseInputClass = "falseInput";

var formElementsText;
var formEmail;
var formTextArea;

function initOnLoad ()
{
	navigationEventhandler();
	getForms();
}


function getForms()
{
	console.log("beginne die formulare zu laden");
	
	//get the elemts from the html
	formElementsText = document.querySelectorAll("form p input[type='text']");
	formEmail = document.querySelector("form p input[type='email']");
	formTextArea = document.querySelector("form p textarea");
	
	buttonAbschicken = document.getElementById("abschicken");
	
	//log zum überprüfen
	console.log("documente geladen : \n"
	 + formElementsText + " : " + formElementsText.length + "\n" 
	 + formEmail + "\n" 
	 + buttonAbschicken);
	 
	//eventlistener beim kilicken zum überprüfen der formulare
	buttonAbschicken.onclick = function(){ checkKontakt(formEmail, formTextArea, formElementsText); };
}


window.onload = initOnLoad;

