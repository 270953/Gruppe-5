window.onload = eventHandler;

function eventHandler () {

    var neuesQuizButton = document.getElementById('neuesQuiz');
    neuesQuizButton.addEventListener('click', check, false);

    var auswertenButton = document.getElementById('auswerten');
    auswertenButton.addEventListener('click', korrektur, false);

    var formularLoeschenButton = document.getElementById('formularLeeren');
    formularLoeschenButton.addEventListener('click', function () {document.meinQuiz.reset()}, false)

}



var auswahl = [];//new Array();
document.cookie = "ready=yes";

var anzahlFragen = 4;
var nichtRichtig;

//L�sungen
var loesung=[];//new Array();
loesung[1] = 'a'; //Antwort radio
loesung[2] = 'b'; //Antwort radio
loesung[3] = 'c'; //Antwort radio
loesung[4] = 'cd';  //Antwort checkbox
//loesung[5] = 'a';  //Antwort Bilderr�tsel
var eingabe = ['','','',''];


/*
 Drop-Down-Menü mit mind. 6 Optionen: EA3 Aufgabe 1
 Die Dropdown-Liste erlaubt mehrfach-Auswahl: EA3 Aufgabe 2
 In der Drop-down-Liste dürfen nur max. 2 Einträge markiert werden: EA3 Aufgabe 2
 Es muss mindestens ein Radiobutton ODER eine Dropdown-Option ausgewählt sein: EA3 Aufgabe 2
 */
function check() {

    // inObjektUmwandeln('Robert', 'hans@wurst.de', 'schwer', 'See', 8, 'Katamaran');

    var schwierigkeitsGrad = document.getElementById('schwierigkeit').options;
    var auswahlSchwierigkeit = new Array ('');

    var zaehler_schwierigkeitSelect = 0;
    var zaehler_kategorie = 0;
    var zaehler_schwierigkeit = 0;
    var i; // iterator

    //Prüft, ob EIngabe mind. 5 lang ist
    /*if (document.getElementById("benutzernameID").lang < 5) {                     bei lang dürfte ein Fehler vorliegen
        document.getElementById("fehlerMeldung1").innerHTML =("Eingabe muss mind. 5 Zeichen haben.");
    }*/

    //EA3 Aufgabe 3 checkValidity(), prüft, ob 2. Textfeld gecheckt ist, da verpflichtend
    /*var inpObj_2 = document.getElementById("emailID");
    if (inpObj_2.checkValidity() == false) {
        document.getElementById("fehlerMeldung2").innerHTML = "Bitte eine Angabe machen.";
    }*/


    //prüft, ob dropdown nicht gecheckt ist
    /*if (document.getElementById("schwierigkeitID").value == "") {
        zaehler_schwierigkeit = 1;
    }*/

    for (i=0; i < schwierigkeitsGrad.length; i++)  {
        if (schwierigkeitsGrad[i].selected) {
            zaehler_schwierigkeitSelect++;
        }
    }
    if (zaehler_schwierigkeitSelect > 2) {
        window.alert("Bitte nicht mehr als zwei Schwierigkeiten angeben!");
    }

    for (i=0; i < schwierigkeitsGrad.length; i++) {

        if (schwierigkeitsGrad[i].selected) {
            auswahlSchwierigkeit[i] = schwierigkeitsGrad[i].value;
            console.log(schwierigkeitsGrad[i].value);
        }

    }

    //prüft, ob Kategorie gecheckt ist
    for (var j = 0; j < 4; j++) {

        if (document.quizErstellen.kategorie[j].checked == true) {
            zaehler_kategorie = 1;

        }
    }
    //Vergleicht, ob Kategorie und dropdown NICHT gecheckt sind, da beim logischen oder beider falsch sein müssen
    if ((zaehler_schwierigkeit == 1) && (zaehler_kategorie == 0)) {
        document.getElementById("fehlerMeldung3").innerHTML =("Bitte eine Kategorie oder eine Schwierigkeit angeben!");
        document.getElementById("fehlerMeldung4").innerHTML =("Bitte eine Kategorie oder eine Schwierigkeit angeben!");
    }

    //Eingabe von 1-8

    if (document.getElementById("numberID").validity.rangeUnderflow) {
       document.getElementById("fehlerMeldung5").innerHTML = "Anzahl zu klein";
    }
    if (document.getElementById("numberID").validity.rangeOverflow) {
        document.getElementById("fehlerMeldung5").innerHTML = "Anzahl zu gross";
    }


 /*
    var zaehlerSchSel = 0;


    var zaehlerKat = 0;
    var zaehlerSch = 0;





    if (document.getElementById("schwierigkeitID").value == "") {
        zaehlerSch = 1;
    }

    for (var i = 0; i < schwierigkeitsGrad.length; i++)  {
        if (schwierigkeitsGrad[i].selected) {
            zaehlerSchSel++;
        }
    }
    if (zaehlerSchSel > 2) {
        window.alert("Bitte nicht mehr als zwei Schwierigkeiten angeben!");
    }


//Schleife
    for (var j = 0; j < 4; j++) {

        if (document.quizErstellen.kategorie[j].checked == true) {
            zaehlerKat = 1;

        }
    }

    if ((zaehlerSch == 1) && (zaehlerKat == 0)) {
        window.alert("Bitte eine Kategorie oder eine Schwierigkeit angeben!");


    }
    */

}



/* function myFunction(){                                           // auskommentiert, da scheinbar nicht gebraucht. Habe es weder in quiz.html noch in der auswertung.html gefunden
    var inpObj = document.getElementById("benutzername");
    if(inpObj.checkValidity()== false){
        document.getElementById("invisible_1").innerHTML = inpObj.validationMessage;
    }
}
*/



function korrektur(){
    nichtRichtig = null;
    //1. Schleife
    for (var q=1 ; q <= anzahlFragen ; q++){
        //Argument übergeben per name
        var aktuelleFrage = eval("document.meinQuiz.frage"+q);    // mit var initialisiert, da nur in dieser Funktion vorhanden
        //2. Schleife
        for (var c=0 ; c < aktuelleFrage.length ; c++){
            if (aktuelleFrage[c].checked == true) {
                eingabe[q-1] += aktuelleFrage[c].value;
                console.log(eingabe[q-1]);                      // gleiche Ausgabe, wie drei Zeilen weiter
                //Wert der Frage wird auswahl zugeordnet
                auswahl[q] = aktuelleFrage[c].value;
                console.log(auswahl[q]);                        // gleiche Ausgabe, wie drei Zeilen zuvor; erforderlich?
            }

        }

        if (loesung[q] != eingabe[q-1]){
            if (nichtRichtig == null)
                nichtRichtig = q;
            else
                nichtRichtig += "/"+q;
        }
    }

    if (nichtRichtig == null){
        nichtRichtig = "a/b";
    }
    document.cookie = 'q=' + nichtRichtig;
    if (document.cookie == ''){
        alert("Cookies werden nicht vom Browser unterst&uuml;tzt.");
    }
    else{
        window.location = "bootsquizAuswertung.html";
    }
}


//auswertung
function auswerten() {


    for (var e = 0; e <= 2; e++)
        document.result[e].value = "";

    var ergebnisse = document.cookie.split(";");            // mit var initialisiert, da nur in dieser Funktion vorhanden
    for (var n = 0; n <= ergebnisse.length - 1; n++) {
        if (ergebnisse[n].charAt(1) == 'q') {
            var warumParse = n;                             // Warum hattest du hier parse als Variablennamen? Könnte missverständlich sein
            console.log(warumParse);
        }
    }

    nichtRichtig = ergebnisse[warumParse].split("=");
    nichtRichtig = nichtRichtig[1].split("/");
    if (nichtRichtig[nichtRichtig.length - 1] == 'b') {
        nichtRichtig = "";
    }

    document.result[0].value = anzahlFragen - nichtRichtig.length + " von " + anzahlFragen;
    document.result[2].value = (anzahlFragen - nichtRichtig.length) / anzahlFragen * 100 + "%";

    for (var t = 0; t < nichtRichtig.length; t++) {                 // t mit var initialisiert
        document.result[1].value += nichtRichtig[t] + ", ";
    }

}

//aus bootsquizAuswertung
function zeigeErgebnisse(){

    var text = '';                              // mit var initialisiert, da nur lokal von Bedeutung
    var falsch;                                 // falsch mit var initialisiert, da nur lokal von Bedeutung

    for (var i=1 ; i <= anzahlFragen ; i++){
        for (var temp=0 ; temp < nichtRichtig.length ; temp++){     // temp mit var initialisiert
            if (i == nichtRichtig[temp]){
                falsch = 1;
            }
        }
        if (falsch == 1){
            text += ("Richtig w&auml;re: " + i + "=" + loesung[i] + "\n");
            falsch = 0;
        }
        else{
            text += ("Fragen " + i + "=" + loesung[i] + "\n");
        }
    }


    window.alert(text);
}



/*function inObjektUmwandeln (benutzerName, eMailAdresse, schwierigkeitsStufe, kategorie, fragenAnzahl, bootsTyp) {

    var formularObjekt = {};
    formularObjekt.benutzerName = benutzerName;
    formularObjekt.eMailAdresse = eMailAdresse;
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
            neuerDivKnoten.innerHTML += eigenschaft + ': ' + formularEingaben[eigenschaft] + '<br>';
        }

    }

}

*/







/*
 function jsonZuHtml(){

 spielerZahl=0;
 var text = '{"Benutzername" : "Max Mustermann","E-Mail" : "max@mustermann.net","Schwierigkeit" : "Sehr Leicht", "Kategorie" : "Binnengew&auml;sser", "Anzahl-Fragen" : "1", "Boots-Typ" : "Segelboot" }';

 var obj = JSON.parse(text);

 document.cookie = obj;
 if (document.cookie == ''){
 alert("Cookies werden nicht vom Browser unterst&uuml;tzt.");
 }
 else{
 document.daten[0].value = =
 obj.Benutzername + "<br>" +
 obj.E-Mail + "<br>" +
 obj.Schwierigkeit + "<br>" +
 obj.Kategorie + "<br>" +
 obj.Anzahl-Fragen + "<br>" +
 obj.Boots-Typ;
 spielZahl++;
 }


 }
 */

//indexDB
/*
 function datenSpeichern(){
 //mit default-Tupel
 const dbSpieler = [
 {name: "Max", idName: 0, bearbeitet : 6, richtig : 5, anzahlSpiele : 2, }
 ];

 const dbName = "spiel_Ergebnisse";
 var request = indexedDB.open(dbName, null);

 request.onerror = function(event){
 alert("Why!?");
 };

 request.onupgradeneeded = function(event){
 var db. event.target.result;
 };

 var objectStore = db.createObjectStore("Spieler", {keyPath: "idName"});

 objectStore.createIndex("name", "name", {unique: false});


 for (var i in dbSpieler){
 objectStore.add(dbSpieler[i]);
 }

 var transaction = db.transaction(["Spieler"], "readwrite");

 transaction.oncomplete = function(event){
 alert("Fertig!");
 };

 transaction.onerror = function(event){

 };

 var objectStore = transaction.objectStore.add(dbSpieler[i]);
 request.onsuccess = function(event){

 };




 }
 */

