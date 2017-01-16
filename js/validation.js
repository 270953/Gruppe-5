
//diese js datei kümmert sich um die validierung der eingabefelder

//must only contain letters
regexLetters = new RegExp('^[a-zA-Z\x7f-\xff]+$');
regexMail = new RegExp('^[^ ]*@[^ ]*$');//must match a mail domain
regexSpecial = new RegExp("<+|>+|;+|\{+|\}+|\\$+");

var cssFalseInputClass = "falseInput";

function checkVal(inputElement)
{
	
}


function setFalse(inputElement, errorText, counter)
{
	inputElement.setAttribute("class", cssFalseInputClass);
    inputElement.setCustomValidity(errorText);
    console.log(inputElement.validationMessage);
    console.log("failCounter: " + (--counter));
	
	return counter;
}

function eingabeMietdauerPruefen() {            // wird aufgerufen, wenn die Mietdauer geändert wird

    var mietdauer = document.getElementById('mietdauer');

    if (mietdauer.checkValidity() == false) {       // prüft auf die Richtigkeit der Eingabe
	
        var ausgabeFeld = document.getElementById('ergebnis');
        ausgabeFeld.innerHTML = '<br>Mit der eingegebenen Mietdauer kann kein Preis berechnet werden.<br>' +    // ...dann wird dem Anwender auch eine Information
                                'Bitte geben Sie eine ganze Zahl von 1 bis zur maximalen Mietdauer an.';    // über die falsche Eingabe gegeben.
								
		setFalse(mietdauer, ausgabeFeld.innerHTML, 0)
    }

    else if (mietdauer.hasAttribute('class')) 
	{          // wenn die Eingabe korrekt war, wird die Hintergrundfarbe des Feldes wieder neutralisiert
            mietdauer.removeAttribute('class');
    }
}



//diese methode überprüft die formulardaten
function quizCheck(benutzerNameInput, vornameInput, schwierigkeitsGradSelect, auswahlKategorie, fragenWaehler, quizErstellenButton) //wird quizerstellenButton hier gebraucht?
{
        console.log("check beginnt");

        var failCounter = 0;

        //falls der gelbe Hintergrund noch aktiv ist, wird er zu beginn entfernt
        benutzerNameInput.removeAttribute("class", cssFalseInputClass);
        vornameInput.removeAttribute("class", cssFalseInputClass);
        fragenWaehler.removeAttribute("class", cssFalseInputClass);

        var entwederRadioOderUndListe = 0;

        //länge des inputs überprüfen
        if(benutzerNameInput.value.length < 5 && !benutzerNameInput.tooLong)
        {
            failCounter = setFalse(benutzerNameInput, "Der Benutzername muss mind. 5 Zeichen lang sein, max. 16! ", failCounter);			
            document.getElementById('fehlerMeldung1').innerHTML = benutzerNameInput.validationMessage;
        }
		else if (benutzerNameInput.value.match(regexSpecial))
		{
            failCounter = setFalse(benutzerNameInput, "Der Text darf folgende Zeichen nicht enthalten : <, >, {, }, $, ;", failCounter);			
            document.getElementById('fehlerMeldung1').innerHTML = benutzerNameInput.validationMessage;
		}
		else
        {
            document.getElementById('fehlerMeldung1').innerHTML = "";
        }

        if (!vornameInput.value.match(regexLetters))
        {
			
			failCounter = setFalse(vornameInput, "Vorname darf nur Buchstaben beinhalten!", failCounter);			
            document.getElementById('fehlerMeldung2').innerHTML = vornameInput.validationMessage;
        }else
        {
            document.getElementById('fehlerMeldung2').innerHTML = "";
        }

        //die eingabe muss groß genug sein und es dürfen nur Buchstaben eingegeben werden, damit der validity string leer bleibt!
        if (vornameInput.value.length < 1 && !vornameInput.tooLong)
        {
			failCounter = setFalse(vornameInput, "Bitte gib einen Vornamen an. Max. 16 Buchstaben!", failCounter);			
            document.getElementById('fehlerMeldung2.1').innerHTML = vornameInput.validationMessage;
        }else
        {
            document.getElementById('fehlerMeldung2.1').innerHTML = "";
        }



    var counterSchwierigkeitsSelection = 0;    //es wird gezählt, wie viele optionen selektiert werden
    var selectedIndexArray = [];     //selectedIndexArray speichert die Value von der Checkbox

    for (var c = 0 ; c < 3 ; c++)
    {
        if (schwierigkeitsGradSelect[c].checked == true)
        {
            selectedIndexArray[counterSchwierigkeitsSelection] = schwierigkeitsGradSelect[c].value;
            counterSchwierigkeitsSelection++;
            console.log("Schwierigkeitswert: " + schwierigkeitsGradSelect[c].value);
        }
    }


    //falls zu viele oder zu wenige optionen ausgewählt wurden
    if (counterSchwierigkeitsSelection > 2)
    {
        schwierigkeitsGradSelect.setAttribute("class", cssFalseInputClass);
        //schwierigkeitsGradSelect.setCustomValidity("Sie d&uuml;rfen nur maximal 2 Optionen w&auml;hlen!");
        console.log(schwierigkeitsGradSelect.validationMessage);
        document.getElementById('fehlerMeldung3').innerHTML = "Sie d&uuml;rfen nur maximal 2 Optionen w&auml;hlen!";
        --failCounter;
    }else if(counterSchwierigkeitsSelection == 0){
    ++entwederRadioOderUndListe;
    }else{
    document.getElementById('fehlerMeldung3').innerHTML = "";
    }


    var selected;
    //es wird überprüft, ob ein radio gecheckt wurde
    for (var i = 0; i < auswahlKategorie.length; i++)
    {
        //zaehle hoch falls keine angaben gemacht wurden

        if (auswahlKategorie[i].checked)
        {
            //es wurde eine angabe gemacht, also wird der counter auf den alten stand zurückgesetzt
            selected = true;
            auswahlKategorie = document.getElementById("kategorie"+i).value;
        }
    }

    //falls keine kategorie ausgewaehlt wurde
    if (!selected)
    {
        ++entwederRadioOderUndListe;
    }


    if (entwederRadioOderUndListe >= 2)
    {
        document.getElementById('fehlerMeldung3.1').innerHTML = "W&auml;hle eine Kategorie und/oder eine Schwierigkeit!";//schwierigkeitsGradSelect.validationMessage;
        document.getElementById('fehlerMeldung4').innerHTML = "W&auml;hle eine Kategorie und/oder eine Schwierigkeit!";//schwierigkeitsGradSelect.validationMessage;
        --failCounter;
    }else {
        document.getElementById('fehlerMeldung3.1').innerHTML = "";
        document.getElementById('fehlerMeldung4').innerHTML = "";
    }


    //liegt die zahl im geforderten Bereich?
    if (!fragenWaehler.checkValidity())
    {
        fragenWaehler.setAttribute("class", cssFalseInputClass);
        fragenWaehler.setCustomValidity("Die erlaubte Anzahl der Fragen liegt zwischen 1 und 8!");
        console.log(fragenWaehler.validationMessage);
        document.getElementById('fehlerMeldung5').innerHTML = fragenWaehler.validationMessage;
        --failCounter;
        console.log("failCounter: " + --failCounter);
    }else {document.getElementById('fehlerMeldung5').innerHTML = "";
        //Anzahl der Fragen, die vom Benutzer eingegeben werden. Zunächst mit 0 initialisiert
        var AnzahlFragenUserInput;
        AnzahlFragenUserInput = fragenWaehler.valueOf();
    }

    if(failCounter != 0)
    {
        console.log("failCounter: " + failCounter);


    }else{
        var checkObjekt;
        checkObjekt = {kategorie: auswahlKategorie  , schwierigkeit: selectedIndexArray};
        quizZusammenStellen(checkObjekt);
    }

}




//überprüfe die formulare
function checkKontakt(formEmail, formTextArea, formElementsText)
{
	var allesRichtig = true;
	
	console.log("check beginnt");
	
	//customvaliditystrings werden zu beginn zurrückgesetzt
	formElementsValidityArrayString = [];
	formEmailValidityString = "";
	formTextAreaValidityString = "";
	
	//entferne gelben hintergrund falls vorher vorhanden
	formEmail.removeAttribute("class", cssFalseInputClass);
	formTextArea.removeAttribute("class", cssFalseInputClass);
	
	
	//für alle text elemente
	for (var i = 0; i < formElementsText.length; i++)
	{
		formElementsText[i].removeAttribute("class", cssFalseInputClass);
				
		formElementsValidityArrayString[i] = "";
		
		if(formElementsText[i].value.match(regexLetters))
		{
			if(formElementsText[i].value.length < 3)
			{
				allesRichtig = false;
				formElementsValidityArrayString[i] = "Sie muessen mindestens 3 Buchstaben eingeben!";
				//gelber hintergrund
				formElementsText[i].setAttribute("class", cssFalseInputClass);
			}
		}
		else
		{
			allesRichtig = false;
			
			formElementsValidityArrayString[i] = "Es duerfen nur Buchstaben eingegeben werden!";
			formElementsText[i].setAttribute("class", cssFalseInputClass);
		}
		
		//setzte eigene fehlermeldung
		formElementsText[i].setCustomValidity(formElementsValidityArrayString[i]);
		
		console.log("Text " + i + " Check " + formElementsText[i].checkValidity());
	}
	
	if (formEmail.value.length < 3)
	{
		allesRichtig = false;
		
		formEmailValidityString = "Ihre E-Mail ist zu kurz!";
		formEmail.setAttribute("class", cssFalseInputClass);
	}
	

	formEmail.setCustomValidity(formEmailValidityString);
	
	if (formTextArea.value.length < 15)
	{
		allesRichtig = false;
		
		formTextAreaValidityString = "Der Text ist zu kurz!";
		formTextArea.setAttribute("class", cssFalseInputClass);
	}
	
	if (formTextArea.value.match(regexSpecial))
	{
		allesRichtig = false;
		
		formTextAreaValidityString = "Der Text darf folgende Zeichen nicht enthalten : <, >, {, }, $, ;";
		formTextArea.setAttribute("class", cssFalseInputClass);
	}
	
	formTextArea.setCustomValidity(formTextAreaValidityString);
	
		
	console.log("Email Check " + formEmail.checkValidity());
	console.log("Nachricht Check " + formTextArea.checkValidity());
	
	return allesRichtig;
}
