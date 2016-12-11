
//public variables, if the html is changed in the future
//easier to adapt this code

var cssFalseInputClass = "falseInput";
var formNameChildNode = "Nachname";
var formFirstNameChildNode = "Vorname";
var formEMAILChildNode = "E-Mail";
var formMessageChildNode = "Nachricht";


function checkUserData(givenElement)
{
	//if nothing goes wrong, this boolean will be true at the end
	var returnStatement = true;

	//if its the name field
	if (givenElement.innerHTML.includes(formFirstNameChildNode) || givenElement.innerHTML.includes(formNameChildNode))
	{		
		regexNames = new RegExp('^[a-zA-Z]+$');//must only contain letters

		//the 4th element, because the elements are :(Textnode, </br>, textnode(empty), input element, textnode )
		if(!givenElement.childNodes[3].value.match(regexNames) || givenElement.childNodes[3].value.length < 3)
		{
			givenElement.childNodes[3].setAttribute("class", cssFalseInputClass);
			
			returnStatement = false;//wrong input
		}
	}
	else if (givenElement.innerHTML.includes(formEMAILChildNode)) // if its the e-mail field
	{
		regexMail = new RegExp('^[^ ]*@[^ ]*$');//must match a mail domain
		
		if(!givenElement.childNodes[3].value.match(regexMail) || givenElement.childNodes[3].value.length < 5)
		{
			givenElement.childNodes[3].setAttribute("class", cssFalseInputClass);
			
			returnStatement = false;//wrong input
		}
	}
	else if (givenElement.innerHTML.includes(formMessageChildNode))
	{
		regexMessage = new RegExp('[a-zA-Z]');
		
		if (givenElement.childNodes[3].value.length < 15 || !givenElement.childNodes[3].value.match(regexMessage))
		{
			givenElement.childNodes[3].setAttribute("class", cssFalseInputClass);
			
			returnStatement = false;//wrong input
		}
	}
	
	//if the last input was false, but now correct
	if (returnStatement && givenElement.childNodes[3].getAttribute("class") == cssFalseInputClass)
	{
		//remove the css style of the input field 
		givenElement.childNodes[3].removeAttribute("class", cssFalseInputClass);
	}
	
	return returnStatement; // if everything went correctly return true to the form
}


function clickSubmit()
{	
	var returnStatement = true;

	//get the elemts from the html
	formElements = this.document.querySelectorAll("body main form p");
	formTextArea = this.document.querySelector("form p textarea");
	
	for(var i = 0; i < formElements.length; i++)
	{		
		if(!checkUserData(formElements[i])) //if at least one input field fails
			returnStatement = false;// wrong input
	}
	
	return returnStatement;
}

