window.onload = initOnLoad;

/**
 * Daklaration (Initialisation) der globalen Variablen
 * @type {string}
 */

var csshinweisfarbeFehlerClass= "fehlermeldung";   //Pfad aus css/bootsquiz_stylesheet.css

//hier werden die nodes gelagert, damit mehrere funktionen auf diese zugreifen können
var benutzerNameInput;
var vornameInput;
var schwierigkeitsGradSelect;
var auswahlSchwierigkeit;
var kategorieAuswahl;
var fragenWaehler;
var quizErstellenButton;
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

var quizJsonDaten;                  //Deklariert JSON Objekt

var quizFragen = [];            //in diesem Array werden die JavaScript Objekte abgelegt,
                                // die aus den den JSON Dateien mit der funkticn jsonEinlesen abgerufen werden
var quizTrack;                      //Variable, die die Zufallszahenl als Array speichert, anhand der Fragen-Index
quizTrack = [];                     //identifiziert werden kann. Dies ist für den Vergleich von Eingabe und Lösung notwendig

var quizLoesung;                    //Variable für die richtige Lösungen. Beim Erstellen des Quiz, werden die Lösungen darin gespeichert.
quizLoesung = [];                   //werden die Lösungen darin gespeichert.

var quizFrageUserInput;             //Speichert die Eingabe aus dem Bootsquiz
quizFrageUserInput= [];

var quizAnzahlFragenUserInput;      //Anzahl der Fragen, die vom Benutzer eingegeben werden.
quizAnzahlFragenUserInput = 0;      //Zunächst mit 0 initialisiert

var quiznichtAusgefuehrt = false;   //Quiz kann noch nicht ausgewertet werden, wird bei fragenErstellen() auf true gesetzt

var quizVersuche;

 /**
  * Funktionen, die beim Laden von bootsquiz.html ausgeführt werden
  */
function initOnLoad()
{
        console.log("initOnLoad () geladen");    //kleine notizen
        datenbankOeffnen();
        getForms();

        navigationEventhandler();                   //belegt die Menuepunkte mit Eventhandlern

        for (var i = 0; i < quellDateien.length; i++)
        {                                                       //quellDateien-Quellepfade werden Methode übergeben und
            jsonEinlesen(quellDateien[i], i, 'quiz');           //Objekte werden in quizJsonDaten gespeichert

        }

        var auswertenButton = document.getElementById('auswerten');
        auswertenButton.addEventListener('click', korrektur);

        var formularLoeschenButtonOben = document.getElementById('formularLeerenOben');     //loescht alle Eingaben aus dem
        formularLoeschenButtonOben.addEventListener('click', function () {                  //oberen Formularbereich
            benutzerNameInput.removeAttribute("class", cssFalseInputClass);     //Deklaration ud Initialisierung in js/validation.js
            vornameInput.removeAttribute("class", cssFalseInputClass);          //Deklaration ud Initialisierung in js/validation.js
            fragenWaehler.removeAttribute("class", cssFalseInputClass);         //Deklaration ud Initialisierung in js/validation.js
            fehlermeldungBenutzername.innerHTML = "";
            fehlermeldungVorname.innerHTML = "";
            fehlermeldungSchwierigkeit.innerHTML = "";
            fehlermeldungKategorie.innerHTML = "";
            fehlermeldungAnzahlFragen.innerHTML = "";
            document.quizErstellen.reset();
        }, false);

       var formularLoeschenButton = document.getElementById('formularLeeren');      //loescht alle Eingaben
        formularLoeschenButton.addEventListener('click', function () {              //aus dem Quizbereich
            quizVersuche++;
            document.getElementById("ErgebnisID").style.visibility = "invisible";
            quiznichtAusgefuehrt = true;
            document.getElementById('fehlerMeldung6').innerHTML = "";
            document.meinQuiz.reset();
            quizFrageUserInput = document.querySelectorAll('.hierEntstehtQuiz div ul li input[type="radio"]');
            for(var i=0 ; i<quizFrageUserInput.length ; i++) {
                quizFrageUserInput[i].checked = false;
}}, false);

        var letzteErgebnisse = document.getElementById('letzteErgebnisse');
        letzteErgebnisse.addEventListener('click', function () {
            document.getElementById("ErgebnisID").style.visibility = "visible";
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
        console.log("beginne die formulare zu laden"); //kleine notizen

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

		var buttonLoeschen = document.getElementById('loesche');
		buttonLoeschen.onclick = function()
		{
			datenBankLoeschen('quiz');
		};

        console.log("documente geladen : \n" + benutzerNameInput + "\n " + vornameInput + "\n"          //zum Ueberprüfen hier ausgegeben
            + "Anzahl Schwierigkeit: " + schwierigkeitsGradSelect.length + "\n"
            + kategorieAuswahl + " : " + kategorieAuswahl.length + "\n" + fragenWaehler + "\n" + quizErstellenButton);

        quizErstellenButton.addEventListener("click", function () //der button zum Voranschreiten kriegt einen click listener
        {
            pruefeBenutzername();
            pruefeVorname();
            pruefenAnzahlFragen();
            quizCheck(benutzerNameInput, vornameInput, schwierigkeitsGradSelect, kategorieAuswahl, fragenWaehler);
        }, false);
}



