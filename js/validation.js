
//diese js datei kümmert sich um die validierung der eingabefelder

//must only contain letters
regexLetters = new RegExp('^[a-zA-Z\x7f-\xff]+$');
//mail domain
regexMail = new RegExp('^[^ ]*@[^ ]*$');
//special characters
regexSpecial = new RegExp("<+|>+|;+|\{+|\}+|\\$+");

//der name der css regel, die das eingabefeld einfärbt
var cssFalseInputClass = "falseInput";


//checks the validity and sets the errorText
function checkVal(inputElement, errorText, fehlermeldungOutput)
{
	console.log(inputElement.value);
	//setze den boolean wert von dem checkvalidity resultat
	var bool = inputElement.checkValidity();
	
	//setzte den fehlertext und färbe das eingabefeld ein, falls die ingaben falsch waren
	var ausgabeText = toggleCssField(inputElement, bool, errorText);
			
	//gibt es ein ausgabefeld?
	if (fehlermeldungOutput != null)
	{
		//der ausgabetext soll in dem ausgabefeld erscheinen
		fehlermeldungOutput.innerHTML = ausgabeText;
	}
	
	//gebe den boolean wert weiter
	return bool;
}

//checks the pattern of the inputelement
function checkPattern(inputElement, regExPattern, errorText, fehlermeldungOutput, match = true)//match default value = true
{
	//bool wird falsch gesetzt (negation vom parameter match)
	var bool = !match;
	
	//der string des inputelemnts stimmt mit dem regex überein
	if (inputElement.value.match(regExPattern))
	{
		//negiere den boolean
		bool = !bool;
	}
	
	//markiere das Feld gelb, falls der boolean falsch ist und hole den Fehlertext
	var ausgabeText = toggleCssField(inputElement, bool, errorText);
	
	//falls es ein output feld gibt
	if (fehlermeldungOutput != null)
	{
		//setze die neue fehlermeldung
		fehlermeldungOutput.innerHTML = ausgabeText;
	}
	
	//gebe den boolean wert zurück
	return bool;
}


//entscheide ob das element gefärbt wird oder auf normal gesetzt wird
function toggleCssField (inputElement, bool, errorText)
{
		//falls der parameter wahr ist, soll das feld wieder die normale farbe bekommen (die css regel gilt nicht mehr)
		if (bool)
		{
			inputElement.removeAttribute("class", cssFalseInputClass);
			//die fehlermeldung ist ungültig, wird also mit "" überschrieben
			errorText = "";
		}
		else
		{	
			//färbe das feld entsprechend der css regel (gelb)
			inputElement.setAttribute("class", cssFalseInputClass);
			console.log(errorText);
		}
		
		//reiche die fehlermeldung weiter
		return errorText;
}