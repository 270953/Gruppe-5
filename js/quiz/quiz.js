window.onload = initOnLoad;

var csshinweisfarbeFehlerClass= "fehlermeldung";   //Pfad aus css/quiz_stylesheet.css

//hier werden die nodes gelagert, damit mehrere funktionen auf diese zugreifen können
var benutzerNameInput;
var vornameInput;
var schwierigkeitsGradSelect;
var auswahlSchwierigkeit;
var kategorieAuswahl;
var fragenWaehler;
var quizErstellenButton;
var jsonObjekt;
var auswahlKategorieSpeicher;

var fehlermeldungBenutzername;
var fehlermeldungVorname;
var fehlermeldungSchwierigkeit;
var fehlermeldungKategorie;
var fehlermeldungAnzahlFragen;
var hinweisSchwierigkeit;
var hinweisKategorie;

var quellDateien = [                //Pfade der Fragen, die in jsonEinlesen verarbeitet werden
    "'json/quizBinnenwasserLeicht.json'",
    "'json/quizBinnenwasserMittel.json'",
    "'json/quizBinnenwasserSchwer.json'",
    "'json/quizSeeLeicht.json'",
    "'json/quizSeeMittel.json'",
    "'json/quizSeeSchwer.json'",
    "'json/quizBinnenwasserLeichtMittel.json'",
    "'json/quizBinnenwasserLeichtSchwer.json'",
    "'json/quizBinnenwasserMittelSchwer.json'",
    "'json/quizSeeLeichtMittel.json'",
    "'json/quizSeeLeichtSchwer.json'",
    "'json/quizSeeMittelSchwer.json'"
];

var jsonDaten;                  //Deklariert JSON Objekt

var quizFragen = [];            //in diesem Array werden die JavaScript Objekte abgelegt,
                                // die aus den den JSON Dateien mit der funkticn jsonEinlesen abgerufen werden
var track;                      //Variable, die die Zufallszahenl als Array speichert, anhand der Fragen-Index
track = [];                     //identifiziert werden kann. Dies ist für den Vergleich von Eingabe und Lösung notwendig

var loesung;                    //Variable für die richtige Lösungen. Beim Erstellen des Quiz, werden die Lösungen darin gespeichert.
loesung = [];                   //werden die Lösungen darin gespeichert.

var FrageUserInput;             //Speichert die Eingabe aus dem Bootsquiz
FrageUserInput= [];

var AnzahlFragenUserInput;      //Anzahl der Fragen, die vom Benutzer eingegeben werden.
AnzahlFragenUserInput = 0;      //Zunächst mit 0 initialisiert

var nichtAusgefuehrt = false;   //Quiz kann noch nicht ausgewertet werden, wird bei fragenErstellen() auf true gesetzt

 /**
  * Funktionen, die beim Laden von quiz.html ausgeführt werden
  */
function initOnLoad ()
{
        console.log("eventHandler geladen");
        datenbankOeffnen();
        getForms();

        navigationEventhandler();                   //belegt die Menuepunkte mit Eventhandlern

        for (var i = 0; i < quellDateien.length; i++)
        {                                                       //quellDateien-Quellepfade werden Methode übergeben und
            jsonEinlesen(quellDateien[i], i, 'quiz');           //Objekte werden in jsonDaten gespeichert

        }

        var auswertenButton = document.getElementById('auswerten');
        auswertenButton.addEventListener('click', korrektur);

        var formularLoeschenButtonOben = document.getElementById('formularLeerenOben');     //loescht alle Eingaben aus dem
        formularLoeschenButtonOben.addEventListener('click', function () {                  //oberen Formularbereich
            benutzerNameInput.removeAttribute("class", cssFalseInputClass);
            vornameInput.removeAttribute("class", cssFalseInputClass);
            fragenWaehler.removeAttribute("class", cssFalseInputClass);
            fehlermeldungBenutzername.innerHTML = "";
            fehlermeldungVorname.innerHTML = "";
            fehlermeldungSchwierigkeit.innerHTML = "";
            fehlermeldungKategorie.innerHTML = "";
            fehlermeldungAnzahlFragen.innerHTML = "";
            document.quizErstellen.reset();
        }, false);

       var formularLoeschenButton = document.getElementById('formularLeeren');      //loescht alle Eingaben
        formularLoeschenButton.addEventListener('click', function () {              //aus dem Quizbereich
            nichtAusgefuehrt = true;
            document.getElementById('fehlerMeldung6').innerHTML = "";
            document.meinQuiz.reset();
            FrageUserInput = document.querySelectorAll('div table input[type="radio"]');
            for(var i=0 ; i<FrageUserInput.length ; i++) {
                FrageUserInput[i].checked = false;
            }}, false);

        var letzteErgebnisse = document.getElementById('letzteErgebnisse');
        letzteErgebnisse.addEventListener('click', function () {
            datenLesen('quiz');
        }, false);

        document.getElementById("ErgebnisID").style.visibility = "hidden";
}

 /**
  * Funktion, die die HTML Elemente holt und anschließend die Eingaben mit quizCheck() aus validation.js überprüft
  */
function getForms()
{
        console.log("getForms() geladen"); //kleine notizen
        console.log("beginne die formulare zu laden");

        //die documents werden geladen
        benutzerNameInput = document.getElementById("benutzernameID");
        vornameInput = document.getElementById("vornameID");
        schwierigkeitsGradSelect = document.querySelectorAll('.selectSchwierigkeit ul li input[type="checkbox"]');
        kategorieAuswahl = document.getElementsByName('kategorie');
        fragenWaehler = document.getElementById("numberID");
        quizErstellenButton = document.getElementById("neuesQuiz");

        fehlermeldungBenutzername = document.getElementById('fehlerMeldung1');
        fehlermeldungVorname = document.getElementById('fehlerMeldung2');
        fehlermeldungSchwierigkeit = document.getElementById('fehlerMeldung3');
        fehlermeldungKategorie = document.getElementById('fehlerMeldung4');
        fehlermeldungAnzahlFragen = document.getElementById('fehlerMeldung5');


        console.log("documente geladen : \n" + benutzerNameInput + "\n " + vornameInput + "\n"          //zum überprüfen hier ausgegeben
            + "Anzahl Schwierigkeit: " + schwierigkeitsGradSelect.length + "\n"
            + kategorieAuswahl + " : " + kategorieAuswahl.length + "\n" + fragenWaehler + "\n" + quizErstellenButton);

        quizErstellenButton.addEventListener("click", function () //der button zum voranschreiten kriegt einen click listener
        {
            pruefeBenutzername();
            pruefeVorname();
            pruefenAnzahlFragen();
            quizCheck(benutzerNameInput, vornameInput, schwierigkeitsGradSelect, kategorieAuswahl, fragenWaehler)
        }, false);
}




/**
 * Funktion, die die Formulareingabe in ein JSON-Objekt umwandelt
 */
function inObjektUmwandeln(benutzerName, vorname, auswahlSchwierigkeit, fragenAnzahl, richtig)
{
        console.log('inObjektUmwandeln() geladen');//kleine notiz

    console.log("test: " + kategorieAuswahl);
    console.log("test: " + auswahlSchwierigkeit);

        var eingabeDaten = {};
                eingabeDaten.Benutzername = benutzerName;
                eingabeDaten.Vorname = vorname;
                eingabeDaten.Schwierigkeit = auswahlSchwierigkeit;
                eingabeDaten.Kategorie = auswahlKategorieSpeicher;
                eingabeDaten.Fragenanzahl = fragenAnzahl;
                eingabeDaten.Richtig = richtig;
                var datum = new Date();
                eingabeDaten.Datum = datum.getDate() + "." + (datum.getMonth() + 1) + "." + datum.getFullYear() + " um " + datum.getHours() + ":" + datum.getMinutes() + " Uhr";
        jsonObjekt = JSON.stringify(eingabeDaten);        // umwandeln des JavaScript Objektes in ein JSON Objekt
        console.log('JSON Objekt: ' + jsonObjekt);              // Ausgabe des JSON Objektes in der Konsole
        datenSpeichern(eingabeDaten, 'quiz');
}