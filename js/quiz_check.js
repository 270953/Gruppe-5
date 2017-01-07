
//hier werden die nodes gelagert, damit mehrere funktionen auf diese zugreifen können
var benutzerNameInput;
var vornameInput;
var schwierigkeitsGradSelect;
var kategorieAuswahl;
var fragenWaehler;
var bootsTypenListe;
var quizErstellenButton;

//der name des css klasse, die den hintergrund gelb färbt
var cssFalseInputClass = "falseInput";

//diese methode wird beim laden ddes fensters aufgrufen
function getForms()
{
	//kleine notiz
	console.log("beginne die formulare zu laden");
	
	//die documents werden geladen
	benutzerNameInput = document.getElementById("benutzernameID");
	vornameInput = document.getElementById("vornameID");
	schwierigkeitsGradSelect = document.getElementById("schwierigkeitID");
	kategorieAuswahl = document.querySelectorAll('.kselections ul li input[type="radio"]');
	fragenWaehler = document.getElementById("numberID");
	bootsTypenListe = document.querySelector('input[list="bootsTypen"]');
	quizErstellen = document.getElementById("neuesQuiz");
	
	//zum überprüfen hier ausgegeben
	console.log("documente geladen : \n" + benutzerNameInput + "\n "
	 + vornameInput + "\n" + schwierigkeitsGradSelect + "\n"
	 + kategorieAuswahl + " : " + kategorieAuswahl.length + "\n" + fragenWaehler + "\n" 
	 + bootsTypenListe + "\n" + quizErstellen);
	 
	//der button zum voranschreiten kriegt einen click listener
	quizErstellen.addEventListener("click", check); 
}

//diese methode überprüft die formulardaten
function check() 
{
    console.log("check beginnt");
	
	var failCounter = 0;
	var ergebnisWahr = true;
	
	//must only contain letters
	regexLetters = new RegExp('^[a-zA-Z\x7f-\xff]+$');
	
	//falls der gelbe Hintergrund noch aktiv ist, wird er zu beginn entfernt
	benutzerNameInput.removeAttribute("class", cssFalseInputClass);
	vornameInput.removeAttribute("class", cssFalseInputClass);
	schwierigkeitsGradSelect.removeAttribute("class", cssFalseInputClass);
	fragenWaehler.removeAttribute("class", cssFalseInputClass);
	bootsTypenListe.removeAttribute("class", cssFalseInputClass);
	
	var entwederRadioOderUndListe = 0;
	
	//länge des inputs überprüfen
	if(benutzerNameInput.value.length < 5 && !benutzerNameInput.tooLong)
	{
		benutzerNameInput.setAttribute("class", cssFalseInputClass);
		benutzerNameInput.setCustomValidity("Der Benutzername muss zwischen 4 und 16 Zeichen haben!!");
		console.log(benutzerNameInput.validationMessage);
		
		--failCounter;
	}
	
	//die eingabe muss goß genug sein und es dürfen nur Buchstaben eingegeben werden, damit der validity string leer bleibt!
	if (vornameInput.value.length < 2 && !vornameInput.tooLong)
	{
		vornameInput.setAttribute("class", cssFalseInputClass);
		vornameInput.setCustomValidity("Der Vorname muss zwischen 1 und 16 Buchstaben haben!");
		console.log(vornameInput.validationMessage);
		
		--failCounter;
	}
	else if (!vornameInput.value.match(regexLetters))
	{
		vornameInput.setAttribute("class", cssFalseInputClass);
		vornameInput.setCustomValidity("Vorname darf nur Buchstaben beinhalten!");
		console.log(vornameInput.validationMessage);
		
		--failCounter;
	}
	
	//es wird gezählt, wie viele optionen selektiert werden
	var counterSchwierigkeitsSelection = 0;
	for (var i = 0; i < schwierigkeitsGradSelect.options.length; i++)
	{
		if (schwierigkeitsGradSelect.options[i].selected)
		{
			++counterSchwierigkeitsSelection;
		}
	}

	
	//falls zu viele oder zu wenige optionen ausgewählt wurden
	if (counterSchwierigkeitsSelection > 2)
	{
		schwierigkeitsGradSelect.setAttribute("class", cssFalseInputClass);
		schwierigkeitsGradSelect.setCustomValidity("Sie duerfen nur maximal 2 Optionen waehlen!");
		console.log(schwierigkeitsGradSelect.validationMessage);

		--failCounter;	
	}
	else if (counterSchwierigkeitsSelection == 0)
	{
		++entwederRadioOderUndListe;
	}
	
	
	var selected;
	//es wird überprüft, ob ein radio gecheckt wurde
	for (var i = 0; i < kategorieAuswahl.length; i++)
	{
		//zaehle hoch falls keine angaben gemacht wurden
		
		if (kategorieAuswahl[i].checked)
		{
			//es wurde eine angabe gemacht, also wird der counter auf den alten stand zurückgesetzt
			selected = true;;
			break;
		}
	}
	
	//falls keine kategorie ausgewaehlt wurde
	if (!selected)
	{
		++entwederRadioOderUndListe;
	}
	
	
	if (entwederRadioOderUndListe >= 2)
	{
		schwierigkeitsGradSelect.setCustomValidity("Sie muessen ein Radio button checken oder und eine Schwierigkeit waehlen!");
		console.log(schwierigkeitsGradSelect.validationMessage);		
		
		--failCounter;
	}
		
	
	//liegt die zahl im geforderten Bereich?
	if (!fragenWaehler.checkValidity())
	{
		fragenWaehler.setAttribute("class", cssFalseInputClass);
		
		fragenWaehler.setCustomValidity("Die Zahl liegt nicht im vorgegebenen Bereich!");
		console.log(fragenWaehler.validationMessage);		
		
		--failCounter;
	}

	
	//falls keine bootsklasse gewählt wurde!
	if (bootsTypenListe.value == "")
	{
		bootsTypenListe.setAttribute("class", cssFalseInputClass);
		
		
		bootsTypenListe.setCustomValidity("Waehlen Sie eine Bootsklasse!");
		console.log(bootsTypenListe.validationMessage);		
		
		--failCounter;		
	}

	if(failCounter != 0)
	{
		ergebnisWahr = false;
		console.log(ergebnisWahr + " : " + failCounter);
	}
	
	return ergebnisWahr;
}

window.onload = getForms;