/**
 * Created by yokoe on 17/1/2017.
 */


/**
 * Funktion, welches anhand der Kategorie und der Schwierigkeit das Quiz zusammenerstellt
 */
function quizZusammenStellen(objValidation)
{
    quizVersuche = 1;
    document.getElementById("ErgebnisID").style.visibility = "invisible";

    console.log('quizZusammenStellen(objValidation) geladen'); //kleine notiz
    document.getElementById('fehlerMeldung6').innerHTML = "";   //Falls Hinweis noch vorhanden

    var auswahlZufall;
    var csshinweisfarbeClass = "hinweisfarbe";

    hinweisSchwierigkeit = document.getElementById('fehlerMeldung3');
    hinweisKategorie = document.getElementById('fehlerMeldung4');

    if(objValidation.schwierigkeit.length > 0){             //Zuordnen der Werte, die für inObjektUmwandeln() benötigt werden
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
                quizJsonDaten = quizFragen[0].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Mittel")    //Falls Mittel gewählt wurde
            {
                quizJsonDaten = quizFragen[1].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Schwer")   //Falls Schwer gewählt wurde
            {
                quizJsonDaten = quizFragen[2].valueOf();
            }
        }else if (objValidation.schwierigkeit.length == 2)                         //Falls zwei Schwierigkeiten gewählt wurde
        {
            hinweisSchwierigkeit.innerHTML = "";
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                && (objValidation.schwierigkeit[1].valueOf() == "Mittel"))     //Falls Leicht und Mittel gewählt wurden
            {
                quizJsonDaten = quizFragen[6].valueOf();
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))      //Falls Leicht und Schwer gewählt wurden
            {
                quizJsonDaten = quizFragen[7].valueOf();
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Mittel")
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))
            {
                quizJsonDaten = quizFragen[8].valueOf();
            }
        }else {
            hinweisSchwierigkeit.innerHTML = "Hinweis: Es wurde keine Schwierigkeit ausgew&auml;hlt. Eine Schwierigkeit wurde daher zuf&auml;llig gew&auml;hlt.";
            hinweisSchwierigkeit.setAttribute("class", csshinweisfarbeClass);
            auswahlZufall = Math.floor(Math.random() * 3);
            quizJsonDaten = quizFragen[auswahlZufall].valueOf();
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
                quizJsonDaten = quizFragen[3].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Mittel")     //Falls Mittel gewählt wurde
            {
                quizJsonDaten = quizFragen[4].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Schwer")   //Falls Schwer gewählt wurde
            {
                console.log("in Schwer verzweigt");
                quizJsonDaten = quizFragen[5].valueOf();
            }
        }else if (objValidation.schwierigkeit.length == 2)                 //Falls zwei Schwierigkeiten gewählt wurde
        {
            hinweisSchwierigkeit.innerHTML = "";
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                && (objValidation.schwierigkeit[1].valueOf() == "Mittel"))       //Falls Leicht und Mitte gewählt wurde
            {
                quizJsonDaten = quizFragen[9].valueOf();
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")      //Falls Leicht und Schwer gewählt wurde
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))
            {
                quizJsonDaten = quizFragen[10].valueOf();
            }if ((objValidation.schwierigkeit[0].valueOf() == "Mittel")      //Falls Leicht und Schwer gewählt wurde
            && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))                                                                //Falls Mittel und Schwer gewählt wurde
            {
                quizJsonDaten = quizFragen[11].valueOf();
            }
        }else                                                                 //Fallwierigkeit gewählt wurdes keine Sch
        {
            hinweisSchwierigkeit.innerHTML = "Hinweis: Es wurde keine Schwierigkeit ausgew&auml;hlt. Eine Schwierigkeit wurde daher zuf&auml;llig gew&auml;hlt.";
            hinweisSchwierigkeit.setAttribute("class", csshinweisfarbeClass);
            auswahlZufall = Math.floor(Math.random() * 3);
            quizJsonDaten = quizFragen[auswahlZufall].valueOf();
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
                quizJsonDaten = quizFragen[auswahlZufall * 3].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Mittel")       //Falls Mittel gewählt wurde
            {
                quizJsonDaten = quizFragen[(auswahlZufall * 3) + 1].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Schwer")
            {
                quizJsonDaten = quizFragen[(auswahlZufall * 3) + 2].valueOf();          //Falls Schwer gewählt wurde
            }
        }else if (objValidation.schwierigkeit.length == 2)  {                     //Falls zwei Schwierigkeiten gewählt wurde
            hinweisSchwierigkeit.innerHTML = "";
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                && (objValidation.schwierigkeit[1].valueOf() == "Mittel"))         //Falls Leicht und Mittel gewählt wurden
            {
                quizJsonDaten = quizFragen[(auswahlZufall * 3) + 6].valueOf();
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))         //Falls Leicht und Schwer gewählt wurden
            {
                quizJsonDaten = quizFragen[(auswahlZufall * 3) + 7].valueOf();
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Mittel")
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer")) //Falls Mittel und Schwer gewählt wurden
            {
                quizJsonDaten = quizFragen[(auswahlZufall * 3) + 8].valueOf();
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

function fragenErstellen()
{
    quizVersuche = 1;

    console.log("fragenErstellen geladen"); //kleine notiz
    quiznichtAusgefuehrt = true;

    quizAnzahlFragenUserInput = document.getElementById("numberID").value;
    var random;  //Variable für die Zufallszahl. Diese wird im Schleifendurchlauf immer neu vergeben

    var str;                                                     //Stringvariable, in das die HTML Elemente gespeichert werden
    str = '<div class="alleFragen"><h2>Beantworte alle Fragen</h2>';
    for (var i = 0; i < quizAnzahlFragenUserInput; i++)             //for Schleife, die die Anzahl der gewählte Fragen durchläuft
    {
        if (quizAnzahlFragenUserInput == 1)                         //wenn nur eine Frage gewählt wurde
        {
            random = Math.floor(Math.random() * quizJsonDaten.length);
        }else
        {                                                  //wenn mehr als eine Frage gewählt wurde
            random = Math.floor(Math.random() * quizJsonDaten.length); //Zufallszahl, um die Fragen zufällig zu generieren

            var wiederholungsZaehler = 1;                   //Prüfzähler für die whileschreife
            //
            while (wiederholungsZaehler <= i)              //Soll Wiederholungen vermeiden
            {
                console.log("while loop");
                if (random == quizTrack[i - wiederholungsZaehler])
                {
                    console.log("Zahl wiederholt sich: " + "random: " + random + " quizTrack: " + quizTrack[i - wiederholungsZaehler]);
                    random = Math.floor(Math.random() * quizJsonDaten.length);
                    wiederholungsZaehler = 1;
                    //continue;
                }else
                {
                    wiederholungsZaehler++;
                    console.log("keine Wiederholung ermittelt");
                }
            }
        }

        str += '<h3>'+(i+1) + '.  '+quizJsonDaten[random].Frage + '</h3>';          //Generiert Radiobutton
        str += '<ul class="frageList">' +
            '<li><input type="radio" name ="frage' + i + '" id="frage0' + i + '"/><label for="frage0' + i + '">' + quizJsonDaten[random].Antworten[0] + '</label></li>' +
            '<li><input type="radio" name ="frage' + i + '" id="frage1' + i + '"/><label for="frage1' + i + '">' + quizJsonDaten[random].Antworten[1] + '</label></li>' +
            '<li><input type="radio" name ="frage' + i + '" id="frage2' + i + '"/><label for="frage2' + i + '">' + quizJsonDaten[random].Antworten[2] + '</label></li>' +
            '<li><input type="radio" name ="frage' + i + '" id="frage3' + i + '"/><label for="frage3' + i + '">' + quizJsonDaten[random].Antworten[3] + '</label></li>' +
            '</ul>';
        quizTrack[i] = random;                                             //Speichert Zufallszahl in einem Array,
        // um auf die Fragen in der json zugreifen zu können
        quizLoesung[i] = quizJsonDaten[random].richtig[0];                      //Speichert Lösungen in einem Array
    }
    str += '</div>';

    document.getElementById('hierEntstehtQuizID').innerHTML = str;      //zusammengesetzter String wird in HTML ausgegeben
    document.getElementById('antwortRichtigID').value = "";         //Die Eingabe löschen, erst relevant, wenn dort schon
    document.getElementById('anzahlFalschID').value = "";           //Einträge drin sind und der Benutzer ein neues Quiz
    document.getElementById('prozentID').value = "";                //starten will
}