
//public variables, if the html is changed in the future
//easier to adapt this code

var cssFalseInputClass = "falseInput";

var formElementsText;
var formEmail;
var formTextArea;


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
	buttonAbschicken.addEventListener("click", check); 
}


//überprüfe die formulare
function check()
{
	console.log("check beginnt");
	
	//customvaliditystrings werden zu beginn zurrückgesetzt
	formElementsValidityArrayString = [];
	formEmailValidityString = "";
	formTextAreaValidityString = "";
	
	regexLetters = new RegExp('^[a-zA-Z\x7f-\xff]+$');//must only contain letters
	regexMail = new RegExp('^[^ ]*@[^ ]*$');//must match a mail domain
	
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
	
	formTextArea.setCustomValidity(formTextAreaValidityString);
	
		
	console.log("Email Check " + formEmail.checkValidity());
	console.log("Nachricht Check " + formTextArea.checkValidity());
}



window.onload = getForms;

