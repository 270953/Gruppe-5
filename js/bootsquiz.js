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
function check(sObj) {

    var zaehlerSchSel = 0;


    var zaehlerKat = 0;
    var zaehlerSch = 0;





    if (document.getElementById("schwierigkeitID").value == "") {
        zaehlerSch = 1;
    }

    for (var i = 0; i < sObj.options.length; i++)  {
        if (sObj.options[i].selected) {
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
            var warumParse = n;
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

