
//diese js datei kümmert sich um die validierung der eingabefelder

//must only contain letters
regexLetters = new RegExp('^[a-zA-Z\x7f-\xff]+$');
regexMail = new RegExp('^[^ ]*@[^ ]*$');//must match a mail domain
regexSpecial = new RegExp("<+|>+|;+|\{+|\}+|\\$+");


var cssFalseInputClass = "falseInput";

var korrekterBenutzername = false;
var korrekteSchwierigkeit = false;
var korrekteKategorie = false;
var korrekteAnzahl = false;
var korrekterVorname = false;
var korrekterNachname = false;
var korrekteEmail = false;
var korrekterText = false;


//checks the validity and sets the errorText
function checkVal(inputElement, errorText, fehlermeldungOutput)
{
	//setze den boolean wert auf checkvalidity
	var bool = inputElement.checkValidity();
	var ausgabeText = "";
	
	setTrue(inputElement);
	
	if (!bool)
	{
		setFalse(inputElement);
		ausgabeText = errorText;
		inputElement.setAttribute("class", cssFalseInputClass);
		console.log(errorText);
	}
	
	if (fehlermeldungOutput != null)
	{
		fehlermeldungOutput.innerHTML = ausgabeText;
	}
	
	return bool;
}

//checks the pattern
function checkPattern(inputElement, regExPattern, errorText, fehlermeldungOutput, match)
{
	//bool wird falsch gesetzt
	var bool = !match;
	//initialisiere den ausgabetext
	var ausgabeText = "";
	
	if (inputElement.value.match(regExPattern))
	{
		bool = !bool;
		
		if (match)
		{
			setTrue(inputElement);
		}
		else
		{
			//falls es standartmäßig falsch ist
			ausgabeText = errorText;
			setFalse(inputElement);
		}
	}
	else
	{
		if (match)
		{
			//falls es standartmäßig falsch ist
			ausgabeText = errorText;
			setFalse(inputElement);
		}
		else
		{	
			setTrue(inputElement);
		}
	}
	
	if (fehlermeldungOutput != null)
	{
		fehlermeldungOutput.innerHTML = ausgabeText;
	}
	
	return bool;
}


function setTrue(inputElement)
{
	inputElement.removeAttribute("class", cssFalseInputClass);
}


function setFalse(inputElement)
{
	inputElement.setAttribute("class", cssFalseInputClass);
}
