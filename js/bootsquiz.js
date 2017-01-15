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

var halbKlein = 0;
var halbGross = 0;
var zahlHerkunft = 0;


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
var jsonQuelle = "'json/quizSee.json'";

var booleanKorrektur = true;


//wartet auf die auf Eingaben des Users und führt function aus
function eventHandler ()
{
        console.log("eventHandler geladen");
        datenbankOeffnen();
        getForms();
        jsonEinlesen(jsonQuelle);
		navigationEventhandler();

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
	    quizErstellenButton.onclick = function(){ quizCheck(benutzerNameInput, vornameInput, schwierigkeitsGradSelect, kategorieAuswahl, fragenWaehler, quizErstellenButton);}
}



/**
 *Funktion, zum Einlesen von JSON, für den Fragenkatalog
*/
function jsonEinlesen(jsonHerkunft) {
    var anfrage = new XMLHttpRequest();
    anfrage.open('GET', jsonHerkunft, true);
    anfrage.onload = function () {
        jsonDaten = JSON.parse(anfrage.responseText);
    };
    anfrage.send();
}


/**
 *Funktion, zum Erstellen des Quiz
 */
function quizErstellen(zahlHerkunft)
{

        booleanKorrektur = true;
        console.log("quizErstellen geladen");
        //Wert aus Eingabe von 1-8 (quiz.html)
        AnzahlFragenUserInput = document.getElementById("numberID").value;
        var str = '<h4>Beantworte alle Fragen</h4>';
        //Fragen generieren
        for (var i = 0; i < AnzahlFragenUserInput; i++) {
            //prüft, ob eine Frage gewählt wurde
            if (AnzahlFragenUserInput == 1)
            {
                random = Math.floor(Math.random() * zahlHerkunft);
            //prüft, ob mehr als eine Frage gewählt wurde
            }
            else
            {
                random = Math.floor(Math.random() * zahlHerkunft);
                //Soll Wiederholungen vermeiden, funktioniert jedoch noch nicht richtig
                var wiederholungsZaehler = 1;
                //
                while (wiederholungsZaehler <= i)
                {
                    console.log("while loop");
                    if (random == track[i - wiederholungsZaehler])
                    {
                        console.log("Zahl wiederholt sich: " + "random: " + random + " track: " + track[i - wiederholungsZaehler]);
                        wiederholungsZaehler = 1;
                        //continue;
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

        return str;
       //
}


/**
 * Funktion, die die Quizeingabe auf Richtigkeit überprüft
 */
function korrektur() {

    while (true){
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

        //boolean wird auf false gesetzt, damit korrektur nicht erneut ausgeführt wird.
        //Erst bei function quizErstellen(),wird der boolean wieder auf true gesetzt.
        booleanKorrektur = false;
    }


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
