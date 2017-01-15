
//diese js datei kümmert sich um die validierung der eingabefelder

//must only contain letters
regexLetters = new RegExp('^[a-zA-Z\x7f-\xff]+$');
regexMail = new RegExp('^[^ ]*@[^ ]*$');//must match a mail domain
regexSpecial = new RegExp("<+|>+|;+|\{+|\}+|\\$+");

var cssFalseInputClass = "falseInput";

function setFalse(inputElement, errorText, counter)
{
	inputElement.setAttribute("class", cssFalseInputClass);
    inputElement.setCustomValidity(errorText);
    console.log(inputElement.validationMessage);
    console.log("failCounter: " + (--counter));
	
	return counter;
}

function eingabeMietdauerPruefen(mietdauer) {            // wird aufgerufen, wenn die Mietdauer geändert wird

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
function quizCheck(benutzerNameInput, vornameInput, schwierigkeitsGradSelect, kategorieAuswahl, fragenWaehler, quizErstellenButton)
{
        console.log("check beginnt");

        var failCounter = 0;

        //falls der gelbe Hintergrund noch aktiv ist, wird er zu beginn entfernt
        benutzerNameInput.removeAttribute("class", cssFalseInputClass);
        vornameInput.removeAttribute("class", cssFalseInputClass);
        //schwierigkeitsGradSelect.removeAttribute("class", cssFalseInputClass);
        fragenWaehler.removeAttribute("class", cssFalseInputClass);


        var entwederRadioOderUndListe = 0;
		var errorText = "";

        //länge des inputs überprüfen
        if(benutzerNameInput.value.length < 5 && !benutzerNameInput.tooLong)
        {
			errorText = "Der Benutzername muss mind. 5 Zeichen lang sein, max. 16! ";
			
            failCounter = setFalse(benutzerNameInput, errorText, failCounter);			
            document.getElementById('fehlerMeldung1').innerHTML = errorText;
        }
		else if (benutzerNameInput.value.match(regexSpecial))
		{
			errorText = "Der Text darf folgende Zeichen nicht enthalten : <, >, {, }, $, ;";
			
            failCounter = setFalse(benutzerNameInput, errorText, failCounter);			
            document.getElementById('fehlerMeldung1').innerHTML = errorText;
		}
		else
        {
            document.getElementById('fehlerMeldung1').innerHTML = "";
        }

        if (!vornameInput.value.match(regexLetters))
        {
			errorText = "Vorname darf nur Buchstaben beinhalten!";
			
			failCounter = setFalse(vornameInput, errorText, failCounter);			
            document.getElementById('fehlerMeldung2').innerHTML = errorText;
        }
		else
        {
            document.getElementById('fehlerMeldung2').innerHTML = "";
        }

        //die eingabe muss groß genug sein und es dürfen nur Buchstaben eingegeben werden, damit der validity string leer bleibt!
        if (vornameInput.value.length < 1 && !vornameInput.tooLong)
        {
			errorText = "Bitte gib einen Vornamen an. Max. 16 Buchstaben!";
			
			failCounter = setFalse(vornameInput, errorText, failCounter);			
            document.getElementById('fehlerMeldung2.1').innerHTML = errorText;
        }else
        {
            document.getElementById('fehlerMeldung2.1').innerHTML = "";
        }


        //es wird gezählt, wie viele optionen selektiert werden
        var counterSchwierigkeitsSelection = 0;
        var selectedIndexArray = [];


        //selectedIndexArray speichert die Value von der Checkbox
       for (var c = 0 ; c < 3 ; c++)
       {
            if (schwierigkeitsGradSelect[c].checked == true)
            {
                selectedIndexArray += schwierigkeitsGradSelect[c].value;
                counterSchwierigkeitsSelection++;
                console.log("Schwierigkeitswert:(1=leicht, 2=mittel, 3=schwer): " + schwierigkeitsGradSelect[c].value);
            }
            if((counterSchwierigkeitsSelection == 2) && (AnzahlFragenUserInput > 1))
            {
                    //prueft, ob zwei Schwierigkeiten gewählt wurde
                    if(counterSchwierigkeitsSelection == 2){
                        halbKlein = Math.floor(AnzahlFragenUserInput/2);
                        halbGross = Math.round(AnzahlFragenUserInput/2);

                    }

            }
        }


        //falls zu viele oder zu wenige optionen ausgewählt wurden
        if (counterSchwierigkeitsSelection > 2)
        {
			errorText = "Sie d&uuml;rfen nur maximal 2 Optionen w&auml;hlen!";
			
			failCounter = setFalse(schwierigkeitsGradSelect, errorText, failCounter);
            document.getElementById('fehlerMeldung3').innerHTML = errorText;

        }else if (counterSchwierigkeitsSelection == 0)
        {
            ++entwederRadioOderUndListe;
        }else
        {
           document.getElementById('fehlerMeldung3').innerHTML = "";
            //prüft welche Checkbox gewählt wurde und vergibt variable einen Wert, der ausgewertet werden kann
            //value 1 steht für Leicht, value 2 steht für mittel und value 3 für schwer
            //2 ausgewählt
            if(selectedIndexArray[0] == 1 && selectedIndexArray[1] == 2)
            {
                console.log("inhalt checken ckeckbox:  leicht und mittel");
                //parameter für switch-Abfrage in inObjektUmwandeln()
                auswahlSchwierigkeit = 4;
            }else if(selectedIndexArray[0] == 1 && selectedIndexArray[1] == 3)
            {
                console.log("inhalt checken ckeckbox:  leicht und schwer");
                //parameter für switch-Abfrage in inObjektUmwandeln()
                auswahlSchwierigkeit = 5;
            }else if(selectedIndexArray[0] == 2 && selectedIndexArray[1] == 3)
            {
                console.log("inhalt checken ckeckbox:  mittel und schwer");
                //parameter für switch-Abfrage in inObjektUmwandeln()
                auswahlSchwierigkeit = 6;
            //eine Schwierigkeit ausgewählt
            }else
            {
                for (var e = 1; e <= 3; e++)
                {
                    if(selectedIndexArray[0] == e)
                    {
                        console.log("inhalt checken ckeckbox:  einzelnd");
                        //parameter für switch-Abfrage in inObjektUmwandeln()
                        auswahlSchwierigkeit = e;
                    }
                }
            }
        }
        var selected;
        //es wird überprüft, ob ein radio gecheckt wurde


    for (var j = 0; j < kategorieAuswahl.length; j++)
    {
        //zaehle hoch falls keine angaben gemacht wurden


    if(kategorieAuswahl[j].checked == false)
        {
                //prüft, ob Binnenwasser gewählt wurde
                if(kategorieAuswahl[0].checked)
                {
                    console.log("Kategorie Binnenwasser gewählt");
                    kategorie = "Binnenwasser";
                    //prüft, ob eine Schwierigkeit gewählt wurde
                        if(counterSchwierigkeitsSelection == 1)
                        {
                            jsonQuelle = "'json/quizBinnenwasser" + auswahlSchwierigkeit + ".json'";
                        }else if(counterSchwierigkeitsSelection == 2)
                        {
                            if(auswahlSchwierigkeit == 4)
                            {
                                jsonEinlesen("'json/quizBinnenwasser" + 12 + ".json'");
                                selected = true;
                                break;
                            }
                            if(auswahlSchwierigkeit == 5)
                            {
                                jsonEinlesen("'json/quizBinnenwasser" + 13 + ".json'");
                                selected = true;
                                break;
                            }
                            if(auswahlSchwierigkeit == 6)
                            {
                                jsonEinlesen("'json/quizBinnenwasser" + 23+ ".json'");
                                selected = true;
                                break;
                            }
                        }else
                        {
                            jsonQuelle = "'json/quizBinnenwasser.json'";
                        }
                }
                //prüft, ob See gewählt wurde
                else if(kategorieAuswahl[1].checked)
                {
                    console.log("Kategorie See gewählt");
                    kategorie = "See";
                    //prüft, ob eine Schwierigkeit gewählt wurde
                        if(counterSchwierigkeitsSelection == 1)
                        {
                            jsonQuelle = "'json/quizSee" + auswahlSchwierigkeit + ".json'";
                        }else if(counterSchwierigkeitsSelection == 2)
                        {
                            if(auswahlSchwierigkeit == 4){
                                jsonEinlesen("'json/quizSee" + 12 + ".json'");
                                selected = true;
                                break;
                            }
                            if(auswahlSchwierigkeit == 5){
                                jsonEinlesen("'json/quizSee" + 13 + ".json'");
                                selected = true;
                                break;
                            }
                            if(auswahlSchwierigkeit == 6){
                                jsonEinlesen("'json/quizSee" + 23 + ".json'");
                                selected = true;
                                break;
                            }
                        }else {
                            jsonQuelle = "'json/quizSee.json'";
                        }
                }//es wurde eine angabe gemacht, also wird der counter auf den alten stand zurückgesetzt

        }

    }


        //falls keine kategorie ausgewaehlt wurde
        if (selected == false)
        {
                //waehlt zufällig eine Kategorie aus
                random = Math.floor(Math.random() * 2);
                if(random == 1){
                    var jsonQuelle = "'json/quizBinnenwasser.json'";
                }else {
                    var jsonQuelle = "'json/quizSee.json'";
                }


            ++entwederRadioOderUndListe;
        }
        else if (entwederRadioOderUndListe >= 2)
        {
            //schwierigkeitsGradSelect.setCustomValidity("W&auml;hle eine Kategorie und/oder eine Schwierigkeit!");
            //console.log(schwierigkeitsGradSelect.validationMessage);
            document.getElementById('fehlerMeldung3.1').innerHTML = "W&auml;hle eine Kategorie und/oder eine Schwierigkeit!";//schwierigkeitsGradSelect.validationMessage;
            document.getElementById('fehlerMeldung4').innerHTML = "W&auml;hle eine Kategorie und/oder eine Schwierigkeit!";//schwierigkeitsGradSelect.validationMessage;
            --failCounter;
            console.log("failCounter: " + failCounter);
        }else{
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
            console.log("failCounter: " + failCounter);
        }else {document.getElementById('fehlerMeldung5').innerHTML = "";
        }
        if(failCounter != 0)
        {
            console.log(failCounter);
        }else
        {   //Lädt .json wird geladen
            jsonEinlesen(jsonQuelle);
            if (counterSchwierigkeitsSelection == 2){

                zahlHerkunft = halbKlein;
                    //quelle fehlt noch (json)
                   var quizTeil1 = quizErstellen(zahlHerkunft);

                    zahlHerkunft = halbGross;
                //quelle fehlt noch (json)
                    var quizTeil2 = quizErstellen(zahlHerkunft);

                document.getElementById('hierEntstehtQuizID').innerHTML = quizTeil1 + quizTeil2;

            }else {
                zahlHerkunft = AnzahlFragenUserInput;
                var quizGanz = quizErstellen(zahlHerkunft);
                document.getElementById('hierEntstehtQuizID').innerHTML = quizGanz;
                }

        }
}

//überprüfe die formulare
function checkKontakt(formEmail, formTextArea, formElementsText)
{
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
				formElementsValidityArrayString[i] = "Sie muessen mindestens 3 Buchstaben eingeben!";
				//gelber hintergrund
				formElementsText[i].setAttribute("class", cssFalseInputClass);
			}
		}
		else
		{
			formElementsValidityArrayString[i] = "Es duerfen nur Buchstaben eingegeben werden!";
			formElementsText[i].setAttribute("class", cssFalseInputClass);
		}
		
		//setzte eigene fehlermeldung
		formElementsText[i].setCustomValidity(formElementsValidityArrayString[i]);
		
		console.log("Text " + i + " Check " + formElementsText[i].checkValidity());
	}
	
	if (formEmail.value.length < 3)
	{
		formEmailValidityString = "Ihre E-Mail ist zu kurz!";
		formEmail.setAttribute("class", cssFalseInputClass);
	}
	

	formEmail.setCustomValidity(formEmailValidityString);
	
	if (formTextArea.value.length < 15)
	{
		formTextAreaValidityString = "Der Text ist zu kurz!";
		formTextArea.setAttribute("class", cssFalseInputClass);
	}
	
	if (formTextArea.value.match(regexSpecial))
	{
		formTextAreaValidityString = "Der Text darf folgende Zeichen nicht enthalten : <, >, {, }, $, ;";
		formTextArea.setAttribute("class", cssFalseInputClass);
	}
	
	formTextArea.setCustomValidity(formTextAreaValidityString);
	
		
	console.log("Email Check " + formEmail.checkValidity());
	console.log("Nachricht Check " + formTextArea.checkValidity());
}
