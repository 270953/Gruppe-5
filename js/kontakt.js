
//Die Inputfelder werden hier gelagert
var formElementsText;
var formEmail;
var formTextArea;

//diese Variable enthält alle Einträge des Formulars
var eingabeDaten = {};

//wird beim seitenaufruf aufgerufen
function initOnLoad ()
{
	//die listenelemnte der Navigation sollen anklickbar sein
	navigationEventhandler();
	//öffne die datenbank
	datenbankOeffnen();
	//lade die felder und buttons der kontakt seite in die variablen
	getForms();
}

//überprüfung für das Vornamenfeld
function vornameCheck()
{ 			
	//das ausgabefeld für die fehlermeldung
	var fehlerDoc = document.getElementById("fehlerMeldungVorName");
	
	//überprüfe den inhalt des eingabefeldes und liefere einen boolean wert zurück
	return (checkVal(formElementsText[0], formElementsText[0].validationMessage, fehlerDoc) && checkPattern(formElementsText[0], regexLetters, "Bitte nur Buchstaben eingeben", fehlerDoc));
}

//überprüfung für das nachnamenfeld
function nachNameCheck()
{ 		
	//das ausgabefeld für die fehlermeldung
	var fehlerDoc = document.getElementById("fehlerMeldungName");
	
	//überprüfe den inhalt des eingabefeldes und liefere einen boolean wert zurück
	return (checkVal(formElementsText[1], formElementsText[1].validationMessage, fehlerDoc) && checkPattern(formElementsText[1], regexLetters, "Bitte nur Buchstaben eingeben", fehlerDoc));	
}

//überprüfung für das email feld
function emailCheck()
{ 
	//glücklicherweise überprüft die checkValidity() funktion den regex der email automatisch, sodass der eigene Pattern in validation.js nicht genutzt werden muss
	//überprüfe den inhalt des eingabefeldes und liefere einen boolean wert zurück
	return (checkVal(formEmail, formEmail.validationMessage, document.getElementById("fehlerMeldungEMail")));
} 

//überprüfung des textfeldes
function textAreaCheck()
{ 
	//das ausgabefeld für die fehlermeldung
	var fehlerDoc = document.getElementById("fehlerMeldungText");
	
	//überprüfe den inhalt des eingabefeldes und liefere einen boolean wert zurück
	return (checkVal(formTextArea, formTextArea.validationMessage, fehlerDoc) && checkPattern(formTextArea, regexSpecial, "Der Text darf folgende Zeichen nicht enthalten : <, >, {, }, $, ;", fehlerDoc, false));
}

//übernehme die letzten vom benutzer getätigten eingaben in die kontaktfelder
function eingabenUebernehmen()
{
	console.log("eingabenUebernehmen start!");
	
	// mit der Funktion wird geprüft, welche Datei die Datenbank geöffnet hat
	objectStore = pruefeHerkunft('letzteKontakte');        

	if (objectStore != null)
	{
		var countRequest = objectStore.count();
		countRequest.onsuccess = function() {
			console.log(countRequest.result);
			
			objectStore.openCursor(countRequest.result, 'next').onsuccess = function (event) 
			{
				
				var jsObjekt = event.target.result;
				
				if (jsObjekt != null)
				{
					
					console.log(jsObjekt.value);
					
					//vorname 
					formElementsText[0].value = jsObjekt.value.Vorname;
					//nachname 
					formElementsText[1].value = jsObjekt.value.Nachname;
					//email
					formEmail.value = jsObjekt.value.Email;
					//textfeld
					formTextArea.value = jsObjekt.value.Text;
				}
			}
		}
	}

}	

//lade die DOM-Objekte in variablen und übergebe listener für buttons und felder
function getForms()
{
	console.log("beginne die formulare zu laden");
	
	//get the elemts from the html
	formElementsText = document.querySelectorAll("form input[type='text']");
	formEmail = document.querySelector("form input[type='email']");
	formTextArea = document.querySelector("form textarea");
	
	//hole alle buttons
	var buttonAbschicken = document.getElementById("abschicken");
	var buttonLetzteErgebnisse = document.getElementById("ergebnisseAbrufen");
	
	var buttonUebernehmen = document.getElementById("uebernehmen");
	var buttonLoeschen = document.getElementById("loesche");
	
	//log zum überprüfen
	console.log("documente geladen : \n"
	+ formElementsText + " : " + formElementsText.length + "\n" 
	+ formEmail + "\n" 
	+ buttonAbschicken);
	
	//wenn ein inputfeld verändert wird, soll die eingabe überprüft werden
	formElementsText[0].onchange = vornameCheck;
	formElementsText[1].onchange = nachNameCheck;
	formEmail.onchange = emailCheck;
	formTextArea.onchange = textAreaCheck;
	
	//hier werden click listener auf die buttons gelegt
	buttonLoeschen.onclick = function ()
	{
		datenBankLoeschen('letzteKontakte');
	};	
	
	buttonUebernehmen.onclick = eingabenUebernehmen;
	
	//eventlistener beim kilicken zum überprüfen der formulare
	buttonAbschicken.onclick = function()
	{ 
		//überprüfe alle methoden
		if (vornameCheck() & nachNameCheck() & emailCheck() & textAreaCheck())
		{
			console.log("abschicken");
			
			//speichere die werte in die eingaben variable
			inObjektUmwandeln();
			//lege die einträge in die datenbank
			datenSpeichern(eingabeDaten, 'letzteKontakte'); 			
		}
		
	};
	
	//lade die letzten einträge aus der datenbank
	buttonLetzteErgebnisse.onclick = function(){ datenLesen('letzteKontakte'); };
}


/**
* Funktion, die die Formulareingabe in ein JSON-Objekt umwandelt
*/
function inObjektUmwandeln(){
	//kleine notiz
	console.log('inObjektUmwandeln() geladen');
	var datum = new Date();
	
	eingabeDaten.Vorname = formElementsText[0].value;
	eingabeDaten.Nachname = formElementsText[1].value;
	eingabeDaten.Email = formEmail.value;
	eingabeDaten.Text = formTextArea.value;

	eingabeDaten.Datum = datum.getDate() + "." + (datum.getMonth() + 1) + "." + datum.getFullYear() + " um " + datum.getHours() + ":" + datum.getMinutes() + " Uhr";
}

//wenn die seite vollständig geladen wurde, rufe diese funktion auf
window.onload = initOnLoad;