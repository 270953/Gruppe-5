var auswahl = [];//new Array();
document.cookie = "ready=yes";

var anzahlFragen = 4;

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
function check(sObj) {


    var zaehler_schwierigkeitSelect = 0;
    var zaehler_kategorie = 0;
    var zaehler_schwierigkeit = 0;

    //Prüft, ob EIngabe mind. 5 lang ist
    if (document.getElementById("benutzernameID").lang < 5) {
        document.getElementById("fehlerMeldung1").innerHTML =("Eingabe muss mind. 5 Zeichen haben.");
    }

    //EA3 Aufgabe 3 checkValidity(), prüft, ob 2. Textfeld gecheckt ist, da verpflichtend
    var inpObj_2 = document.getElementById("emailID");
    if (inpObj_2.checkValidity() == false) {
        document.getElementById("fehlerMeldung2").innerHTML = "Bitte eine Angabe machen.";
    }


    //prüft, ob dropdown nicht gecheckt ist
    if (document.getElementById("schwierigkeitID").value == "") {
        zaehler_schwierigkeit = 1;
    }

    for (var i = 0; i < sObj.options.length; i++)  {
        if (sObj.options[i].selected) {
            zaehler_schwierigkeitSelect++;
        }
    }
    if (zaehler_schwierigkeitSelect > 2) {
        window.alert("Bitte nicht mehr als zwei Schwierigkeiten angeben!");
    }



    //prüft, ob Katgorie gecheckt ist
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

}


function korrektur(){
    nichtRichtig = null;
    //1. Schleife
    for (var q=1 ; q <= anzahlFragen ; q++){
        //Argument übergeben per name
        aktuelleFrage = eval("document.meinQuiz.frage"+q);
        //2. Schleife
        for (var c=0 ; c < aktuelleFrage.length ; c++){
            if (aktuelleFrage[c].checked == true) {
                eingabe[q-1] += aktuelleFrage[c].value;
                //Wert der Frage wird auswahl zugeordnet
                auswahl[q] = aktuelleFrage[c].value;
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

    ergebnisse = document.cookie.split(";");
    for (var n = 0; n <= ergebnisse.length - 1; n++) {
        if (ergebnisse[n].charAt(1) == 'q') {
            parse = n;
        }
    }

    nichtRichtig = ergebnisse[parse].split("=");
    nichtRichtig = nichtRichtig[1].split("/");
    if (nichtRichtig[nichtRichtig.length - 1] == 'b') {
        nichtRichtig = "";
    }

    document.result[0].value = anzahlFragen - nichtRichtig.length + " von " + anzahlFragen;
    document.result[2].value = (anzahlFragen - nichtRichtig.length) / anzahlFragen * 100 + "%";

    for (t = 0; t < nichtRichtig.length; t++) {
        document.result[1].value += nichtRichtig[t] + ", ";
    }

}

//aus bootsquizAuswertung
function zeigeErgebnisse(){

    text = '';

    for (var i=1 ; i <= anzahlFragen ; i++){
        for (temp=0 ; temp < nichtRichtig.length ; temp++){
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

