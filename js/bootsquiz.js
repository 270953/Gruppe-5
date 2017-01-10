window.onload = eventHandler;

//hier werden die nodes gelagert, damit mehrere funktionen auf diese zugreifen können
var benutzerNameInput;
var vornameInput;
var schwierigkeitsGradSelect;
var auswahlSchwierigkeit;
var kategorieAuswahl;
var kategorie = "";
var fragenWaehler;
var quizErstellenButton;
var jsonObjekt;


//der name des css klasse, die den hintergrund gelb färbt
var cssFalseInputClass = "falseInput";

//Variable für die Zufallszahl. Diese wird im Schleifendurchlauf immer neu vergeben
var random;

/*
 Variable, die die Zufallszahenl als Array speichert, anhand der Fragen-Index identifiziert werden kann.
 Dies ist für den Vergleich von Eingabe und Lösung notwendig
 */
var track;
track = [];

//Variable für die richtige Lösungen. Beim Erstellen des Quiz, werden die Lösungen darin gespeichert.
var loesung;
loesung = [];

//Speichert die Anzahl der nicht richtig beantworteten Fragen
var nichtRichtig;
nichtRichtig = 0;

//Speichert die Anzahl der nicht richtig beantworteten Fragen
var richtig;
richtig= 0;

//Speichert die Eingabe aus dem Bootsquiz
var FrageUserInput;
FrageUserInput= [];

//document.cookie = "ready=yes"; nicht mehr gebraucht

//Anzahl der Fragen, die vom Benutzer eingegeben werden. Zunächst mit 0 initialisiert
var AnzahlFragenUserInput;
AnzahlFragenUserInput = 0;

//Deklariert JSON Objekt
var jsonDaten;
var jsonQuelle = "'json/quizBinnenwasser.json'";


//wartet auf die auf Eingaben des Users und führt function aus
function eventHandler ()
{
        console.log("eventHandler geladen");
        datenbankOeffnen();
        getForms();
        jsonEinlesen(jsonQuelle);


        var auswertenButton = document.getElementById('auswerten');
        auswertenButton.addEventListener('click', korrektur);

        var formularLoeschenButton = document.getElementById('formularLeeren');
        formularLoeschenButton.addEventListener('click', function () {
            document.meinQuiz.reset();
        }, false);

        var letzteErgebnisse = document.getElementById('letzteErgebnisse');
        letzteErgebnisse.addEventListener('click', function () {
            datenLesen('quiz');
        }, false);
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
        schwierigkeitsGradSelect = document.querySelectorAll('.selectSchwierigkeit ul li input[type="checkbox"]');
        kategorieAuswahl = document.querySelectorAll('.kselections ul li input[type="radio"]');
        fragenWaehler = document.getElementById("numberID");
        quizErstellenButton = document.getElementById("neuesQuiz");

        //zum überprüfen hier ausgegeben
        //+ schwierigkeitsGradSelect.length + "\n"
        console.log("documente geladen : \n" + benutzerNameInput + "\n "
            + vornameInput + "\n" + "Anzahl Schwierigkeit: " + schwierigkeitsGradSelect.length + "\n"
            + kategorieAuswahl + " : " + kategorieAuswahl.length + "\n" + fragenWaehler + "\n"
            + richtig + "\n"+ quizErstellenButton);

        //der button zum voranschreiten kriegt einen click listener
        quizErstellenButton.addEventListener("click", check);
}




//diese methode überprüft die formulardaten, die für das Erstellen des Quiz notwendig sind
function check()
{
        console.log("check beginnt");

        var failCounter = 0;

        //must only contain letters
        regexLetters = new RegExp('^[a-zA-Z\x7f-\xff]+$');

        //falls der gelbe Hintergrund noch aktiv ist, wird er zu beginn entfernt
        benutzerNameInput.removeAttribute("class", cssFalseInputClass);
        vornameInput.removeAttribute("class", cssFalseInputClass);
        //schwierigkeitsGradSelect.removeAttribute("class", cssFalseInputClass);
        fragenWaehler.removeAttribute("class", cssFalseInputClass);


        var entwederRadioOderUndListe = 0;

        //länge des inputs überprüfen
        if(benutzerNameInput.value.length < 5 && !benutzerNameInput.tooLong)
        {
            benutzerNameInput.setAttribute("class", cssFalseInputClass);
            benutzerNameInput.setCustomValidity("Der Benutzername muss mind. 5 Zeichen lang sein, max. 16! ");
            console.log(benutzerNameInput.validationMessage);
            document.getElementById('fehlerMeldung1').innerHTML = benutzerNameInput.validationMessage;
            --failCounter;
        }else
        {
            document.getElementById('fehlerMeldung1').innerHTML = "";
        }

        if (!vornameInput.value.match(regexLetters))
        {
            vornameInput.setAttribute("class", cssFalseInputClass);
            vornameInput.setCustomValidity("Vorname darf nur Buchstaben beinhalten!");
            console.log(vornameInput.validationMessage);
            document.getElementById('fehlerMeldung2').innerHTML = vornameInput.validationMessage;
            --failCounter;
        }else
        {
            document.getElementById('fehlerMeldung2').innerHTML = "";
        }

        //die eingabe muss groß genug sein und es dürfen nur Buchstaben eingegeben werden, damit der validity string leer bleibt!
        if (vornameInput.value.length < 2 && !vornameInput.tooLong)
        {
            vornameInput.setCustomValidity("Bitte gib einen Vornamen an. Max. 16 Buchstaben!");
            console.log(vornameInput.validationMessage);
            document.getElementById('fehlerMeldung2.1').innerHTML = vornameInput.validationMessage;
            --failCounter;
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
                console.log("text: " +schwierigkeitsGradSelect[c].value);
            }
        }


        //falls zu viele oder zu wenige optionen ausgewählt wurden
        if (counterSchwierigkeitsSelection > 2)
        {
            schwierigkeitsGradSelect.setAttribute("class", cssFalseInputClass);
            //schwierigkeitsGradSelect.setCustomValidity("Sie d&uuml;rfen nur maximal 2 Optionen w&auml;hlen!");
            console.log(schwierigkeitsGradSelect.validationMessage);
            document.getElementById('fehlerMeldung3').innerHTML = "Sie d&uuml;rfen nur maximal 2 Optionen w&auml;hlen!"
            //schwierigkeitsGradSelect.validationMessage;
            --failCounter;
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
                            }
                            if(auswahlSchwierigkeit == 5)
                            {
                                jsonEinlesen("'json/quizBinnenwasser" + 13 + ".json'");
                            }
                            if(auswahlSchwierigkeit == 6)
                            {
                                jsonEinlesen("'json/quizBinnenwasser" + 23+ ".json'");
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
                            }
                            if(auswahlSchwierigkeit == 5){
                                jsonEinlesen("'json/quizSee" + 13 + ".json'");
                            }
                            if(auswahlSchwierigkeit == 6){
                                jsonEinlesen("'json/quizSee" + 23 + ".json'");
                            }
                        }else {
                            jsonQuelle = "'json/quizSee.json'";
                        }
                }

        //falls keine kategorie ausgewaehlt wurde
        if (!selected)
        {
            ++entwederRadioOderUndListe;
        }
        if (entwederRadioOderUndListe >= 2)
        {
            //schwierigkeitsGradSelect.setCustomValidity("W&auml;hle eine Kategorie und/oder eine Schwierigkeit!");
            //console.log(schwierigkeitsGradSelect.validationMessage);
            document.getElementById('fehlerMeldung3.1').innerHTML = "W&auml;hle eine Kategorie und/oder eine Schwierigkeit!";//schwierigkeitsGradSelect.validationMessage;
            document.getElementById('fehlerMeldung4').innerHTML = "W&auml;hle eine Kategorie und/oder eine Schwierigkeit!";//schwierigkeitsGradSelect.validationMessage;
            --failCounter;
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
        }else {document.getElementById('fehlerMeldung5').innerHTML = "";
        }
        if(failCounter != 0)
        {
            console.log(failCounter);
        }else
        {   //Lädt .json wird geladen
            jsonEinlesen(jsonQuelle);
            quizErstellen();
        }
}

/**
 *Funktion, zum Einlesen von JSON, für den Fragenkatalog
*/
function jsonEinlesen(jsonHerkunft) {
        var anfrage = new XMLHttpRequest();
        anfrage.open('GET', jsonHerkunft, true);
        anfrage.onload = function()
        {
            jsonDaten = JSON.parse(anfrage.responseText);
        };
        anfrage.send();
}

/**
 *Funktion, zum Erstellen des Quiz
 */
function quizErstellen()
{
        console.log("quizErstellen geladen");
        //Wert aus Eingabe von 1-8 (quiz.html)
        AnzahlFragenUserInput = document.getElementById("numberID").value;
        var str = '<h4>Beantworte alle Fragen</h4>';
        //Fragen generieren
        for (var i = 0; i < AnzahlFragenUserInput; i++) {
            //wenn nur eine Frage gewählt wurde
            if (AnzahlFragenUserInput == 1)
            {
                random = Math.floor(Math.random() * jsonDaten.length);
            //wenn mehr als eine Frage gewählt wurde
            }else
            {
                random = Math.floor(Math.random() * jsonDaten.length);
                //Soll Wiederholungen vermeiden, funktioniert jedoch noch nicht richtig
                var wiederholungsZaehler = 1;
                //
                while (wiederholungsZaehler <= i)
                {
                    console.log("while loop");
                    if (random == track[i - wiederholungsZaehler])
                    {
                        console.log("Zahl wiederholt sich: " + "random: " + random + " track: " + track[i - wiederholungsZaehler]);
                        random = Math.floor(Math.random() * jsonDaten.length);
                        wiederholungsZaehler = 1;
                        continue;
                    }else {
                        wiederholungsZaehler++;
                        console.log("keine Wiederholung ermittelt");
                    }
                }
            }
            //Generiert Radiobutton
            str += (i+1) + '.  '+jsonDaten[random].Frage + '<br>';
            str += '<form><table>' +
                '<tr><td><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[0] + '</td></tr>' +
                '<tr><td><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[1] + '</td></tr>' +
                '<tr><td><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[2] + '</td></tr>' +
                '<tr><td><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[3] + '</td></tr>' +
                '</table></form><br>';
            //Speichert Zufallszahl in einem Array, um auf die Fragen in der json zugreifen zu können
            track[i] = random;
            //Speichert Lösungen in einem Array,
            loesung[i] = jsonDaten[random].richtig[0];
        }
        document.getElementById('hierEntstehtQuizID').innerHTML = str;
}


/**
 * Funktion, die die Quizeingabe auf Richtigkeit überprüft
 */
function korrektur() {
        console.log('korrektur wird geladen');
        FrageUserInput = document.querySelectorAll('div table input[type="radio"]');
        console.log(FrageUserInput);
        //prueft jede Frage, in Abhaengigkeit von AnzahlFragenUserInput
        for (var j = 0; j < (AnzahlFragenUserInput*4); j++)
        {
            //prueft, ob gecheckt
            if ((FrageUserInput[j].checked == true))
            {
                console.log("gechecked");
                if((j-(4*(Math.floor(j/4)))) != loesung[Math.floor(j/4)])
                {
                    console.log("Antwort falsch");
                    nichtRichtig++;
                }else
                {
                    console.log("Antwort richtig");
                    richtig++;
                }
            }else
            {
                console.log("nicht gechecked");
            }
        }
        document.getElementById('antwortRichtigID').value = richtig;
        document.getElementById('anzahlFalschID').value = nichtRichtig;
        document.getElementById('prozentID').value = richtig / AnzahlFragenUserInput * 100 + "%";
        //inObjektUmwandeln(benutzerNameInput.value, vornameInput.value, selectedIndexArray, kategorieAuswahl.value, fragenWaehler.value, bootsTypenListe.value);
        inObjektUmwandeln(benutzerNameInput.value, vornameInput.value, auswahlSchwierigkeit, kategorie, fragenWaehler.value, richtig);
    //schwierigkeitsGradSelect.value,
}

/**
 * Funktion, die die Formulareingabe in ein JSON-Objekt umwandelt
 */
function inObjektUmwandeln(benutzerName, vorname, auswahlSchwierigkeit, kategorie, fragenAnzahl, richtig)
{
        console.log('test inObjektUmwandeln ()');
        console.log('test inObjektUmwandeln ()' +auswahlSchwierigkeit);
        console.log('test inObjektUmwandeln ()'+ kategorieAuswahl);
        switch (auswahlSchwierigkeit){
            case(1): {
                auswahlSchwierigkeit = "Leicht";
                break;
            }
            case(2): {
                auswahlSchwierigkeit = "Mittel";
                break;
            }
            case(3): {
                auswahlSchwierigkeit = "Schwer";
                break;
            }
            case(4): {
                auswahlSchwierigkeit = "Leicht und Mittel";
                break;
            }
            case(5): {
                auswahlSchwierigkeit = "Leicht und Schwer";
                break;
            }
            case(6): {
                auswahlSchwierigkeit = "Mittel und Schwer";
                break;
            }
        }
        var eingabeDaten = {};
            eingabeDaten.benutzerName = benutzerName;
            eingabeDaten.vorname = vorname;
            eingabeDaten.auswahlschwierigkeit = auswahlSchwierigkeit;
            eingabeDaten.kategorie = kategorie;
            eingabeDaten.fragenAnzahl = fragenAnzahl;
            eingabeDaten.richtig = richtig;
            var datum = new Date();
            eingabeDaten.Datum = datum.getDate() + "." + (datum.getMonth() + 1) + "." + datum.getFullYear() + " um " + datum.getHours() + ":" + datum.getMinutes() + " Uhr";
        jsonObjekt = JSON.stringify(eingabeDaten);        // umwandeln des JavaScript Objektes in ein JSON Objekt
        console.log('JSON Objekt: ' + jsonObjekt);              // Ausgabe des JSON Objektes in der Konsole
        datenSpeichern(eingabeDaten, 'quiz');
}
