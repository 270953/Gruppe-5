var auswahl = [];//new Array();
document.cookie = "ready=yes";
var eingabe = ['','','',''];
var loesung=[];//new Array();


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

var jsonDaten;

function jsonEinlesen () {

    var anfrage = new XMLHttpRequest();
    anfrage.open('GET', 'js/quizBinnenwasser.json');
    anfrage.onload = function() {

        jsonDaten = JSON.parse(anfrage.responseText);

    };

    anfrage.send();

}


var track;
track = [];

function quizerstellen(){




    zahlFragen = 0;


    //Wert aus Eingabe von 1-8 (quiz.html)
    zahlFragen = document.getElementById("numberID").value;


    var str = '<h4>Beantworte alle Fragen</h4>';


//Fragen generieren
    for(var i = 0 ; i < zahlFragen ; i++){
        random = Math.floor(Math.random() * zahlFragen);
        str += (i+1) + '.  '+jsonDaten[random].Frage + '<br>';
        str += '<form><table>' +
            '<tr><td id="frage1"><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[0] + '</td></tr>' +
            '<tr><td id="frage2"><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[1] + '</td></tr>' +
            '<tr><td id="frage3"><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[2] + '</td></tr>' +
            '<tr><td id="frage4"><input type="radio" name="radio' + i + '"/>'+'&nbsp;&nbsp;' + jsonDaten[random].Antworten[3] + '</td></tr>' +
            '</table></form><br>';
        track[i] = random;
    }



    document.getElementById('hierEntstehtQuizID').innerHTML = str;


}

function korrektur(){
    var sum=0;
    for(var j = 0 ; j < zahlFragen ; j++){
        for(var k = 0 ; k<4 ; k++){


            window.alert(document.getElementsByName('radio'+[j]).checked);

            if(document.getElementsByName('radio'+[j+1]).checked == true) {window.alert("1) " + jsonDaten[this.track[j]].Antworten[k]);}

            if(jsonDaten[track[j]].Antworten[k].checked == jsonDaten[track[j]].richtig[0]){
                console.log('Works'+j);
                sum++;
            }
        }
    }

    document.getElementById('ErgebnisID').innerHTML = 'Du hast ' + ((sum/zahlFragen) * 100) + '% richtig.';
}




window.onload=jsonEinlesen;