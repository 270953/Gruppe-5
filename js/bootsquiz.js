
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

var track;
var track = [];
var loesung = [];
var random;


var userInput;
var userInput = [];
var nichtRichtig = 0;
var richtig = 0;
var aktuelleFrage = [];

var test = [];

document.cookie = "ready=yes";
var zahlFragen = 0;
var auswahl = [];//new Array();
var eingabe = ['','','',''];

var jsonDaten;


function initOnLoad ()
{
    getForms();
    eventHandler();
    jsonEinlesen();
}

//diese methode wird beim laden ddes fensters aufgrufen
function getForms()
{
	
	that = this;
    //kleine notiz
    console.log("beginne die formulare zu laden");

    //die documents werden geladen
    benutzerNameInput = document.getElementById("benutzernameID");
    vornameInput = document.getElementById("vornameID");
    schwierigkeitsGradSelect = document.getElementById("schwierigkeitID");
    kategorieAuswahl = document.querySelectorAll('.kselections ul li input[type="radio"]');
    fragenWaehler = document.getElementById("numberID");
    bootsTypenListe = document.querySelector('input[list="bootsTypen"]');
    quizErstellenButton = document.getElementById("neuesQuiz");

    //zum überprüfen hier ausgegeben
    console.log("documente geladen : \n" + benutzerNameInput + "\n "
        + vornameInput + "\n" + schwierigkeitsGradSelect + "\n"
        + kategorieAuswahl + " : " + kategorieAuswahl.length + "\n" + fragenWaehler + "\n"
        + bootsTypenListe + "\n" + quizErstellenButton);

    //der button zum voranschreiten kriegt einen click listener
    quizErstellenButton.addEventListener("click", check);
}




//diese methode überprüft die formulardaten
function check()
{
    console.log("check beginnt");

    var failCounter = 0;

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
		alert(benutzerNameInput.validationMessage);

        --failCounter;
    }

    //die eingabe muss goß genug sein und es dürfen nur Buchstaben eingegeben werden, damit der validity string leer bleibt!
    if (vornameInput.value.length < 2 && !vornameInput.tooLong)
    {
        vornameInput.setAttribute("class", cssFalseInputClass);
        vornameInput.setCustomValidity("Der Vorname muss zwischen 1 und 16 Buchstaben haben!");
        console.log(vornameInput.validationMessage);
		alert(vornameInput.validationMessage);

        --failCounter;
    }
    else if (!vornameInput.value.match(regexLetters))
    {
        vornameInput.setAttribute("class", cssFalseInputClass);
        vornameInput.setCustomValidity("Vorname darf nur Buchstaben beinhalten!");
        console.log(vornameInput.validationMessage);
		alert(vornameInput.validationMessage);

        --failCounter;
    }

    //es wird gezählt, wie viele optionen selektiert werden
    var counterSchwierigkeitsSelection = 0;
    var selectedIndexArray = [];

    for (var i = 0; i < schwierigkeitsGradSelect.options.length; i++)
    {
        if (schwierigkeitsGradSelect.options[i].selected)
        {
            selectedIndexArray[counterSchwierigkeitsSelection++] = i;
        }
    }


    //falls zu viele oder zu wenige optionen ausgewählt wurden
    if (counterSchwierigkeitsSelection > 2)
    {
        schwierigkeitsGradSelect.setAttribute("class", cssFalseInputClass);
        schwierigkeitsGradSelect.setCustomValidity("Sie duerfen nur maximal 2 Optionen waehlen!");
        console.log(schwierigkeitsGradSelect.validationMessage);
		alert(schwierigkeitsGradSelect.validationMessage);

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
		alert(schwierigkeitsGradSelect.validationMessage);

        --failCounter;
    }


    //liegt die zahl im geforderten Bereich?
    if (!fragenWaehler.checkValidity())
    {
        fragenWaehler.setAttribute("class", cssFalseInputClass);

        fragenWaehler.setCustomValidity("Die Zahl liegt nicht im vorgegebenen Bereich!");
        console.log(fragenWaehler.validationMessage);
		alert(fragenWaehler.validationMessage);

        --failCounter;
    }


    //falls keine bootsklasse gewählt wurde!
    if (bootsTypenListe.value == "")
    {
        bootsTypenListe.setAttribute("class", cssFalseInputClass);


        bootsTypenListe.setCustomValidity("Waehlen Sie eine Bootsklasse!");
        console.log(bootsTypenListe.validationMessage);
		alert(bootsTypenListe.validationMessage);

        --failCounter;
    }

    if(failCounter != 0)
    {
        console.log(failCounter);
    }else 
	{
       quizErstellen();
       inObjektUmwandeln(benutzerNameInput.value, vornameInput.value, selectedIndexArray, kategorieAuswahl.value, fragenWaehler.value, bootsTypenListe.value);
    }
}


function eventHandler () {
    console.log("eventHandler geladen");


    var auswertenButton = document.getElementById('auswerten');
    auswertenButton.addEventListener('click', korrektur);

    var formularLoeschenButton = document.getElementById('formularLeeren');
    formularLoeschenButton.addEventListener('click', function () {document.meinQuiz.reset()}, false)

}


function jsonEinlesen () {
    console.log("json geladen");


    var anfrage = new XMLHttpRequest();
    anfrage.open('GET', 'js/quizBinnenwasser.json');
    anfrage.onload = function() {

        jsonDaten = JSON.parse(anfrage.responseText);

    };

    anfrage.send();

}


function quizErstellen() {
    console.log("quizErstellen geladen");

    //Wert aus Eingabe von 1-8 (quiz.html)
    zahlFragen = document.getElementById("numberID").value;

    var str = '<h4>Beantworte alle Fragen</h4>';

//Fragen generieren
    for (var i = 0; i < zahlFragen; i++) {

        if (zahlFragen == 1) {
            random = Math.floor(Math.random() * jsonDaten.length);


        }




            random = Math.floor(Math.random() * jsonDaten.length);
//Soll Wiederholungen vermeiden, funktioniert jedoch noch nicht richtig

    for (var j = 1; j <= i; j++) {

        console.log("for test");
        vonVorne:
        while (random == track[i - j]) {
            console.log("Zahl wiederholt sich: " + "random: " + random + " track: " + track[i - j]);
            random = Math.floor(Math.random() * jsonDaten.length);
            j = 1;
            break vonVorne;
        }
            console.log("keine Wiederholung ermittelt");
    }

        //noinspection JSUnresolvedVariable
        str += (i+1) + '.  '+jsonDaten[random].Frage + '<br>';
        //noinspection JSUnresolvedVariable
        str += '<form><table>' +
            '<tr><td><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[0] + '</td></tr>' +
            '<tr><td><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[1] + '</td></tr>' +
            '<tr><td><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[2] + '</td></tr>' +
            '<tr><td><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[3] + '</td></tr>' +
            '</table></form><br>';
        track[i] = random;
        loesung[i] = jsonDaten[random].richtig[0];

    }

    document.getElementById('hierEntstehtQuizID').innerHTML = str;

}


function korrektur() {

    console.log('korrektur wird geladen');

    aktuelleFrage = document.querySelectorAll('div table input[type="radio"]');

    console.log(aktuelleFrage);

    //prueft jede Frage, in Abhaengigkeit von zahlFragen
    for (var j = 0; j < (zahlFragen*4); j++) {

        //prueft, ob gecheckt
        if ((aktuelleFrage[j].checked == true)) {
            console.log("gechecked");


            if((j-(4*(Math.floor(j/4)))) != loesung[Math.floor(j/4)]){

                console.log("Antwort falsch");
                nichtRichtig++;
            }else {
                console.log("Antwort richtig");
                richtig++;


            }

        } else {
            console.log("nicht gechecked");
        }
    }

    document.getElementById('antwortRichtigID').value = richtig;
    document.getElementById('anzahlFalschID').value = nichtRichtig;
    document.getElementById('prozentID').value = richtig / zahlFragen * 100 + "%";

}



function inObjektUmwandeln (benutzerName, vorname, schwierigkeitsStufe, kategorie, fragenAnzahl, bootsTyp) {

    for (var i = 0; i<schwierigkeitsStufe.length; i++) {

        schwierigkeitsStufe[i] = schwierigkeitsGradSelect[schwierigkeitsStufe[i]].value;

    }

     var formularObjekt = {};

     formularObjekt.benutzerName = benutzerName;
     formularObjekt.vorname = vorname;
     formularObjekt.schwierigkeitsStufe = schwierigkeitsStufe;
     formularObjekt.kategorie = kategorie;
     formularObjekt.fragenAnzahl = fragenAnzahl;
     formularObjekt.bootsTyp = bootsTyp;

     var jsonObjekt = JSON.stringify(formularObjekt);        // umwandeln des JavaScript Objektes in ein JSON Objekt
     console.log('JSON Objekt: ' + jsonObjekt);              // Ausgabe des JSON Objektes in der Konsole

     inHTMLwiedergeben(jsonObjekt);
 }



 function inHTMLwiedergeben(jsonObjekt) {

     var formularEingaben = JSON.parse(jsonObjekt);          // umwandeln des JSON Objektes zurück in ein JavaScript Objekt
     console.log(formularEingaben);                          // Ausgabe des JavaScript Objektes in der Konsole
     console.log('Aufzählung der Objekteigenschaften: ' + Object.getOwnPropertyNames(formularEingaben));     // Ausgabe der Objekt-Eigenschaften in der Konsole

     var eingabeFormular = document.getElementById('eingabeFormular');
     var neuerDivKnoten = document.createElement('div');

     eingabeFormular.appendChild(neuerDivKnoten);                        // fügt dem Eingabeformular einen div-Knoten für die Ausgabe der Objektdaten hinzu


     for (var eigenschaft in formularEingaben) {             // iteriert durch das Objekt
         if (formularEingaben.hasOwnProperty(eigenschaft)) {

             if (eigenschaft == 'schwierigkeitsStufe') {
                 for (var i = 0; i<formularEingaben[eigenschaft].length; i++) {

                     neuerDivKnoten.innerHTML += eigenschaft + ' ' + (i+1) + ': ' + formularEingaben[eigenschaft][i] + '<br>';
                 }
             }
             else {
                 neuerDivKnoten.innerHTML += eigenschaft + ': ' + formularEingaben[eigenschaft] + '<br>';
             }
        }
     }
 }



window.onload = initOnLoad;