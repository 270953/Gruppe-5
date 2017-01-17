
//public variables, if the html is changed in the future
//easier to adapt this code

var cssFalseInputClass = "falseInput";

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


function getForms()
{
	console.log("beginne die formulare zu laden");
	
	//get the elemts from the html
	formElementsText = document.querySelectorAll("form p input[type='text']");
	formEmail = document.querySelector("form p input[type='email']");
	formTextArea = document.querySelector("form p textarea");
	
	buttonAbschicken = document.getElementById("abschicken");
	buttonLetzteErgebnisse = document.getElementById("ergebnisseAbrufen");
	
	//log zum überprüfen
	console.log("documente geladen : \n"
	 + formElementsText + " : " + formElementsText.length + "\n" 
	 + formEmail + "\n" 
	 + buttonAbschicken);
	 
	formElementsText[0].onchange = function()
	{ 			
		if (checkVal(formElementsText[0], "fehler vorname") &&
		checkPattern(formElementsText[0], regexSpecial, "<>", null, false) &&
		checkPattern(formElementsText[0], regexLetters, "abc", null, true))
		{
			korrekterBenutzername = true;
			setTrue(formElementsText[0]);
		}
		else
		{
			korrekterBenutzername = false;
			setFalse(formElementsText[0]);
		}
	}
	
	formElementsText[1].onchange = function()
	{ 			
		if (checkVal(formElementsText[1], "fehler name") &&
		checkPattern(formElementsText[1], regexSpecial, "<>", null, false) &&
		checkPattern(formElementsText[1], regexLetters, "abc", null, true))
		{
			korrekterNachname = true;
			setTrue(formElementsText[1]);
		}
		else
		{
			korrekterNachname = false;
			setFalse(formElementsText[1]);
		}		
	}
	
	formEmail.onchange = function()
	{ 
		if (checkVal(formEmail, "fehler email"))
		{
			korrekteEmail = true;
			setTrue(formEmail);
		}
		else
		{
			korrekteEmail = false;
			setFalse(formEmail);
		}		
	} 
	
	
	formTextArea.onchange = function()
	{ 
		if (checkVal(formTextArea, "fehler text") &&
		checkPattern(formTextArea, regexSpecial, "<>", null, false))
		{
			korrekterText = true;
			setTrue(formTextArea);
		}
		else
		{
			korrekterText = false;
			setFalse(formTextArea);
		}		
	} 
	 
	//eventlistener beim kilicken zum überprüfen der formulare
	buttonAbschicken.onclick = function(){ 
		
	if (korrekterNachname && korrekterBenutzername && korrekteEmail && korrekterText)
		{
			console.log("abschicken");
			
			inObjektUmwandeln();
			datenSpeichern(eingabeDaten, 'letzteKontakte'); 			
		}
		
	}
		
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

