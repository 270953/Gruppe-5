window.onload = initOnLoad;

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
        navigationEventhandler();

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

        //kleine notiz
        console.log("getForms() geladen");

        //kleine notiz
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


        //zum überprüfen hier ausgegeben
        console.log("documente geladen : \n" + benutzerNameInput + "\n "
            + vornameInput + "\n" + "Anzahl Schwierigkeit: " + schwierigkeitsGradSelect.length + "\n"
            + kategorieAuswahl + " : " + kategorieAuswahl.length + "\n" + fragenWaehler + "\n"
            + quizErstellenButton);

        //der button zum voranschreiten kriegt einen click listener



        quizErstellenButton.addEventListener("click", function (){
            pruefeBenutzername();
            pruefeVorname();
            pruefenAnzahlFragen();
            quizCheck(benutzerNameInput, vornameInput, schwierigkeitsGradSelect, kategorieAuswahl, fragenWaehler)
            }, false);
}


 /**
  * Funktion, welches anhand der Kategorie und der Schwierigkeit das Quiz zusammenerstellt
  */
function quizZusammenStellen(objValidation) {




     //kleine notiz
    console.log('quizZusammenStellen(objValidation) geladen');

    var auswahlZufall;
    var csshinweisfarbeClass = "hinweisfarbe";

     hinweisSchwierigkeit = document.getElementById('fehlerMeldung3');
     hinweisKategorie = document.getElementById('fehlerMeldung4');

    //Zuordnen der Werte, die für inObjektUmwandeln() benötigt werden
    if(objValidation.schwierigkeit.length > 0){
        auswahlSchwierigkeit = objValidation.schwierigkeit.valueOf();
    }else{
        auswahlSchwierigkeit = "keine Auswahl";
    }
     if((objValidation.kategorie.valueOf() == "Binnenwasser") || (objValidation.kategorie.valueOf() == "See")){
         kategorieAuswahl = auswahlKategorieSpeicher;
     }else{
         auswahlKategorieSpeicher = "keine Auswahl";
     }



    if (objValidation.kategorie.valueOf() == "Binnenwasser")                  //Kategorie "Binnenwasser" wurde gewählt
    {
        hinweisKategorie.innerHTML = "";
        console.log("in Binnenwasser verzweigt");
            if (objValidation.schwierigkeit.length == 1)               //Falls eine Schwierigkeit gewählt wurde
            {
                hinweisSchwierigkeit.innerHTML = "";
                    if (objValidation.schwierigkeit[0].valueOf() == "Leicht")          //Falls Leicht gewählt wurde
                    {
                        jsonDaten = quizFragen[0].valueOf();
                    }else if (objValidation.schwierigkeit[0].valueOf() == "Mittel")    //Falls Mittel gewählt wurde
                    {
                        jsonDaten = quizFragen[1].valueOf();
                    }else                                                              //Falls Schwer gewählt wurde
                    {
                        jsonDaten = quizFragen[2].valueOf();
                    }
            }else if (objValidation.schwierigkeit.length == 2)                         //Falls zwei Schwierigkeiten gewählt wurde
            {
                hinweisSchwierigkeit.innerHTML = "";
                    if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                        && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))     //Falls Leicht und Mittel gewählt wurden
                    {
                        jsonDaten = quizFragen[6].valueOf();
                    }else if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                        && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))      //Falls Leicht und Schwer gewählt wurden
                    {
                        jsonDaten = quizFragen[7].valueOf();
                    }else
                    {
                        jsonDaten = quizFragen[8].valueOf();
                    }
            }else {
                hinweisSchwierigkeit.innerHTML = "Hinweis: Es wurde keine Schwierigkeit ausgew&auml;hlt. Eine Schwierigkeit wurde daher zuf&auml;llig gew&auml;hlt.";
                hinweisSchwierigkeit.setAttribute("class", csshinweisfarbeClass);
                    auswahlZufall = Math.floor(Math.random() * 3);
                    jsonDaten = quizFragen[auswahlZufall].valueOf();
            }
    }else if (objValidation.kategorie.valueOf() == "See")             //Kategorie "See" wurde gewählt
    {
        console.log("in See verzweigt");
            hinweisKategorie.innerHTML ="";
                if (objValidation.schwierigkeit.length == 1)         //Falls eine Schwierigkeit gewählt wurde
                {
                    hinweisSchwierigkeit.innerHTML = "";
                    if (objValidation.schwierigkeit[0].valueOf() == "Leicht")           //Falls Leicht gewählt wurde
                    {
                        jsonDaten = quizFragen[3].valueOf();
                    }else if (objValidation.schwierigkeit[0].valueOf() == "Mittel")     //Falls Mittel gewählt wurde
                    {
                        jsonDaten = quizFragen[4].valueOf();
                    }else                                                               //Falls Schwer gewählt wurde
                    {
                        console.log("in Schwer verzweigt");
                        jsonDaten = quizFragen[5].valueOf();
                    }
            }else if (objValidation.schwierigkeit.length == 2)                 //Falls zwei Schwierigkeiten gewählt wurde
            {
                hinweisSchwierigkeit.innerHTML = "";
                    if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                        && (objValidation.schwierigkeit[1].valueOf() == "Mittel"))       //Falls Leicht und Mitte gewählt wurde
                    {
                        jsonDaten = quizFragen[9].valueOf();
                    }else if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")      //Falls Leicht und Schwer gewählt wurde
                        && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))
                    {
                        jsonDaten = quizFragen[10].valueOf();
                    }else                                                                //Falls Mittel und Schwer gewählt wurde
                    {
                        jsonDaten = quizFragen[11].valueOf();
                    }
            }else                                                                 //Fallwierigkeit gewählt wurdes keine Sch
            {
                    hinweisSchwierigkeit.innerHTML = "Hinweis: Es wurde keine Schwierigkeit ausgew&auml;hlt. Eine Schwierigkeit wurde daher zuf&auml;llig gew&auml;hlt.";
                    hinweisSchwierigkeit.setAttribute("class", csshinweisfarbeClass);
                        auswahlZufall = Math.floor(Math.random() * 3);
                        jsonDaten = quizFragen[auswahlZufall].valueOf();
            }
        }
    else{                                                                          //keine Kategorie wurde gewählt
        console.log("Keine Kategorie");
            hinweisKategorie.innerHTML = "Hinweis: Es wurde keine Kategorie ausgew&auml;hlt. Eine Kategorie wurde daher zuf&auml;llig gew&auml;hlt.";
            hinweisKategorie.setAttribute("class", csshinweisfarbeClass);
        auswahlZufall = Math.floor(Math.random() * 2);
            if (objValidation.schwierigkeit.length == 1)
            {
                hinweisSchwierigkeit.innerHTML = "";//Falls eine Schwierigkeit gewählt wurde
                    if (objValidation.schwierigkeit[0].valueOf() == "Leicht")              //Falls Leicht gewählt wurde
                    {
                        jsonDaten = quizFragen[auswahlZufall * 3].valueOf();
                    } else if (objValidation.schwierigkeit[0].valueOf() == "Mittel")       //Falls Mittel gewählt wurde
                    {
                        jsonDaten = quizFragen[(auswahlZufall * 3) + 1].valueOf();
                    } else {
                        jsonDaten = quizFragen[(auswahlZufall * 3) + 2].valueOf();          //Falls Schwer gewählt wurde
                    }
            }else if (objValidation.schwierigkeit.length == 2)  {                     //Falls zwei Schwierigkeiten gewählt wurde
                    hinweisSchwierigkeit.innerHTML = "";
                    if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                        && (objValidation.schwierigkeit[1].valueOf() == "Mittel"))         //Falls Leicht und Mittel gewählt wurden
                    {
                        jsonDaten = quizFragen[(auswahlZufall * 3) + 6].valueOf();
                    }else if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                        && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))         //Falls Leicht und Schwer gewählt wurden
                    {
                        jsonDaten = quizFragen[(auswahlZufall * 3) + 7].valueOf();
                    }else                                                                  //Falls Mittel und Schwer gewählt wurden
                    {
                        jsonDaten = quizFragen[(auswahlZufall * 3) + 8].valueOf();
                    }
            }else{
                    hinweisSchwierigkeit.innerHTML = "";
            }
    }

    fragenErstellen();

}

/**
 *Funktion, zum Erstellen der Frageelemente
 */

function fragenErstellen(){
    //kleine notiz
    console.log("fragenErstellen geladen");
    nichtAusgefuehrt = true;

    AnzahlFragenUserInput = document.getElementById("numberID").value;
    var random;  //Variable für die Zufallszahl. Diese wird im Schleifendurchlauf immer neu vergeben

        var str;                                                     //Stringvariable, in das die HTML Elemente gespeichert werden
        str = '<div class="alleFragen"><h2>Beantworte alle Fragen</h2>';

        for (var i = 0; i < AnzahlFragenUserInput; i++){            //for Schleife, die die Anzahl der gewählte Fragen durchläuft

            if (AnzahlFragenUserInput == 1){                        //wenn nur eine Frage gewählt wurde
                    random = Math.floor(Math.random() * jsonDaten.length);

            }else{                                                  //wenn mehr als eine Frage gewählt wurde
                    random = Math.floor(Math.random() * jsonDaten.length); //Zufallszahl, um die Fragen zufällig zu generieren

                    var wiederholungsZaehler = 1;                   //Prüfzähler für die whileschreife
                    //
                    while (wiederholungsZaehler <= i){              //Soll Wiederholungen vermeiden
                            console.log("while loop");
                            if (random == track[i - wiederholungsZaehler]){
                                console.log("Zahl wiederholt sich: " + "random: " + random + " track: " + track[i - wiederholungsZaehler]);
                                random = Math.floor(Math.random() * jsonDaten.length);
                                wiederholungsZaehler = 1;
                                //continue;
                            }else{
                                wiederholungsZaehler++;
                                console.log("keine Wiederholung ermittelt");
                            }
                    }
            }

            str += '<h3>'+(i+1) + '.  '+jsonDaten[random].Frage + '</h3>';          //Generiert Radiobutton
            str += '<table class="frageTable">' +
                        '<tr><td><input type="radio" class ="frage" name="frage' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[0] + '</td></tr>' +
                        '<tr><td><input type="radio" class ="frage" name="frage' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[1] + '</td></tr>' +
                        '<tr><td><input type="radio" class ="frage" name="frage' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[2] + '</td></tr>' +
                        '<tr><td><input type="radio" class ="frage" name="frage' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[3] + '</td></tr>' +
                    '</table>';
            track[i] = random;                                             //Speichert Zufallszahl in einem Array,
                                                                            // um auf die Fragen in der json zugreifen zu können
            loesung[i] = jsonDaten[random].richtig[0];                      //Speichert Lösungen in einem Array
        }
        str += '</div>';

        document.getElementById('hierEntstehtQuizID').innerHTML = str;      //zusammengesetzter String wird in HTML ausgegeben

        document.getElementById('antwortRichtigID').value = "";         //Die Eingabe löschen, erst relevant, wenn dort schon
        document.getElementById('anzahlFalschID').value = "";           //Einträge drin sind und der Benutzer ein neues Quiz
        document.getElementById('prozentID').value = "";                //starten will
}


/**
 * Funktion, die die Quizeingabe auf Richtigkeit überprüft
 */
function korrektur() {

    //kleine notiz
    console.log('korrektur() geladen');

    if (nichtAusgefuehrt == false){         //preft, ob Korrektur schon ausgeführt wurde
        document.getElementById('fehlerMeldung6').innerHTML = "Erstelle ein neues Quiz, um ein neues Quiz zu starten, oder leere die Eingabe zur Wiederholung. Viel Erfolg!";
    }

    try { // Fehlerbehandlung, die mit catch aufgefangen wird
        while (nichtAusgefuehrt){

                document.getElementById("ErgebnisID").style.visibility = "visible";
                var cssFalseInputQuizClass = "falseInputQuiz";
                var richtig;                    //Speichert die Anzahl der nicht richtig beantworteten Fragen
                richtig= 0;
                console.log('korrektur wird geladen');
                FrageUserInput = document.querySelectorAll('div table input[type="radio"]');
                console.log(FrageUserInput);

                for (var j = 0; j < (AnzahlFragenUserInput * 4); j++) {     //prueft jede Frage, in Abhaengigkeit von AnzahlFragenUserInput

                        if ((FrageUserInput[j].checked == true)) {          //prueft, ob gecheckt
                                console.log("gechecked");
                                if ((j - (4 * (Math.floor(j / 4)))) != loesung[Math.floor(j / 4)]) {
                                    console.log("Antwort falsch");

                                    FrageUserInput[j].setAttribute('disabled', 'disabled');     //falsche Antworten werden ausgeblendet

                                } else {
                                    console.log("Antwort richtig");
                                    richtig++;
                                }
                        }else {
                                console.log("nicht gechecked");
                        }
                }
                document.getElementById('antwortRichtigID').value = richtig;
                document.getElementById('anzahlFalschID').value = AnzahlFragenUserInput - richtig;
                document.getElementById('prozentID').value = richtig / AnzahlFragenUserInput * 100 + "%";

                nichtAusgefuehrt = false;
                inObjektUmwandeln(benutzerNameInput.value, vornameInput.value, auswahlSchwierigkeit, fragenWaehler.value, richtig);
        }
    }catch (error){
                window.alert(error.message);
    }
}

/**
 * Funktion, die die Formulareingabe in ein JSON-Objekt umwandelt
 */
function inObjektUmwandeln(benutzerName, vorname, auswahlSchwierigkeit, fragenAnzahl, richtig){
        //kleine notiz
        console.log('inObjektUmwandeln() geladen');

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