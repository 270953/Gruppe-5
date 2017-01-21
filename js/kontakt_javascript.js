
//public variables, if the html is changed in the future
//easier to adapt this code

var formElementsText;
var formEmail;
var formTextArea;

var eingabeDaten = {};

function initOnLoad ()
{
	navigationEventhandler();
	datenbankOeffnen();
	getForms();
}

/**
 *
 * @returns {boolean}
 */
function vornameCheck()
	{ 			
		var fehlerDoc = document.getElementById("fehlerMeldungVorName");
	
		return (checkVal(formElementsText[0], formElementsText[0].validationMessage, fehlerDoc) && checkPattern(formElementsText[0], regexLetters, "Bitte nur Buchstaben", fehlerDoc));
	}

/**
 *
 * @returns {boolean}
 */
function nachNameCheck()
	{ 			
		var fehlerDoc = document.getElementById("fehlerMeldungName");
	
		return (checkVal(formElementsText[1], formElementsText[1].validationMessage, fehlerDoc) && checkPattern(formElementsText[1], regexLetters, "Bitte nur Buchstaben", fehlerDoc));	
	}

/**
 *
 * @returns {boolean}
 */
function emailCheck()
	{ 
		return (checkVal(formEmail, formEmail.validationMessage, document.getElementById("fehlerMeldungEMail")));
	}

/**
 *
 * @returns {boolean}
 */
function textAreaCheck()
	{ 
		var fehlerDoc = document.getElementById("fehlerMeldungText");
	
		return (checkVal(formTextArea, formTextArea.validationMessage, fehlerDoc) && checkPattern(formTextArea, regexSpecial, "Der Text darf folgende Zeichen nicht enthalten : <, >, {, }, $, ;", fehlerDoc, false));
	}

/**
 *
 */
function getForms()
{
	console.log("beginne die formulare zu laden");
	
	//get the elemts from the html
	formElementsText = document.querySelectorAll("form p input[type='text']");
	formEmail = document.querySelector("form p input[type='email']");
	formTextArea = document.querySelector("form p textarea");
	
	var buttonAbschicken = document.getElementById("abschicken");
	var buttonLetzteErgebnisse = document.getElementById("ergebnisseAbrufen");
	
	//log zum überprüfen
	console.log("documente geladen : \n"
	 + formElementsText + " : " + formElementsText.length + "\n" 
	 + formEmail + "\n" 
	 + buttonAbschicken);
	 
	formElementsText[0].onchange = vornameCheck;
	formElementsText[1].onchange = nachNameCheck;
	formEmail.onchange = emailCheck;
	formTextArea.onchange = textAreaCheck;
	 
	//eventlistener beim kilicken zum überprüfen der formulare
	buttonAbschicken.onclick = function()
	{ 
	//überprüfe alle methoden
	if (vornameCheck() & nachNameCheck() & emailCheck() & textAreaCheck())
		{
			console.log("abschicken");
			
			inObjektUmwandeln();
			datenSpeichern(eingabeDaten, 'letzteKontakte'); 			
		}
		
	};
		
	buttonLetzteErgebnisse.onclick = function(){ datenLesen('letzteKontakte'); };
}

/**
 * Funktion, die die Formulareingabe in ein JSON-Objekt umwandelt
 */
function inObjektUmwandeln(){
        //kleine notiz
        console.log('inObjektUmwandeln() geladen');
		var datum = new Date();
		
		eingabeDaten.VornameInput = formElementsText[0].value;
		eingabeDaten.NachnameInput = formElementsText[1].value;
		eingabeDaten.EmailAdresse = formEmail.value;
		eingabeDaten.Eingabefeld = formTextArea.value;

        eingabeDaten.Datum = datum.getDate() + "." + (datum.getMonth() + 1) + "." + datum.getFullYear() + " um " + datum.getHours() + ":" + datum.getMinutes() + " Uhr";
}

window.onload = initOnLoad;