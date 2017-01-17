
//diese js datei kümmert sich um die validierung der eingabefelder

//must only contain letters
regexLetters = new RegExp('^[a-zA-Z\x7f-\xff]+$');
regexMail = new RegExp('^[^ ]*@[^ ]*$');//must match a mail domain
regexSpecial = new RegExp("<+|>+|;+|\{+|\}+|\\$+");

var cssFalseInputClass = "falseInput";

//checks the validity and sets the errorText
function checkVal(inputElement, errorText, fehlermeldungOutput)
{
	//setze den boolean wert auf checkvalidity
	var bool = inputElement.checkValidity();
	var ausgabeText = "";
	
	ausgabeText = toggleCssField(inputElement, bool, errorText);
			
	if (fehlermeldungOutput != null)
	{
		fehlermeldungOutput.innerHTML = ausgabeText;
	}
	
	return bool;
}

//checks the pattern
function checkPattern(inputElement, regExPattern, errorText, fehlermeldungOutput, match = true)//default true
{
	//bool wird falsch gesetzt (negation vom parameter)
	var bool = !match;
	//initialisiere den ausgabetext
	var ausgabeText = "";
	
	if (inputElement.value.match(regExPattern))
	{
		//inventiere das bool
		bool = !bool;
		
		//entscheide ob das element gefärbt wird oder auf normal gesetzt wird
		//und übergebe den fehlertext
		ausgabeText = toggleCssField(inputElement, match, errorText);
	}
	else
	{
		//entscheide ob das element gefärbt wird oder auf normal gesetzt wird
		//und übergebe den fehlertext
		ausgabeText = toggleCssField(inputElement, !match, errorText);
	}
	
	//falls es ein output feld gibt
	if (fehlermeldungOutput != null)
	{
		//setze die neue fehlermeldung
		fehlermeldungOutput.innerHTML = ausgabeText;
	}
	
	//gebe den bool wert zurück
	return bool;
}


//entscheide ob das element gefärbt wird oder auf normal gesetzt wird
function toggleCssField (inputElement, bool, errorText)
{
		if (bool)
		{
			inputElement.removeAttribute("class", cssFalseInputClass);
			errorText = "";
		}
		else
		{	
			inputElement.setAttribute("class", cssFalseInputClass);
			console.log(errorText);
		}
		
		return errorText;
}