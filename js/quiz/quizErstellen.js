/**
 * Created by yokoe on 17/1/2017.
 */


/**
 * Funktion, welches anhand der Kategorie und der Schwierigkeit das Quiz zusammenerstellt
 */
function quizZusammenStellen(objValidation)
{
    console.log('quizZusammenStellen(objValidation) geladen'); //kleine notiz

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
                jsonDaten = quizFragen[0].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Mittel")    //Falls Mittel gewählt wurde
            {
                jsonDaten = quizFragen[1].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Schwer")   //Falls Schwer gewählt wurde
            {
                jsonDaten = quizFragen[2].valueOf();
            }
        }else if (objValidation.schwierigkeit.length == 2)                         //Falls zwei Schwierigkeiten gewählt wurde
        {
            hinweisSchwierigkeit.innerHTML = "";
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                && (objValidation.schwierigkeit[1].valueOf() == "Mittel"))     //Falls Leicht und Mittel gewählt wurden
            {
                jsonDaten = quizFragen[6].valueOf();
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))      //Falls Leicht und Schwer gewählt wurden
            {
                jsonDaten = quizFragen[7].valueOf();
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Mittel")
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))
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
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Mittel")     //Falls Mittel gewählt wurde
            {
                jsonDaten = quizFragen[4].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Schwer")   //Falls Schwer gewählt wurde
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
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")      //Falls Leicht und Schwer gewählt wurde
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))
            {
                jsonDaten = quizFragen[10].valueOf();
            }if ((objValidation.schwierigkeit[0].valueOf() == "Mittel")      //Falls Leicht und Schwer gewählt wurde
            && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))                                                                //Falls Mittel und Schwer gewählt wurde
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
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Mittel")       //Falls Mittel gewählt wurde
            {
                jsonDaten = quizFragen[(auswahlZufall * 3) + 1].valueOf();
            }
            if (objValidation.schwierigkeit[0].valueOf() == "Schwer")
            {
                jsonDaten = quizFragen[(auswahlZufall * 3) + 2].valueOf();          //Falls Schwer gewählt wurde
            }
        }else if (objValidation.schwierigkeit.length == 2)  {                     //Falls zwei Schwierigkeiten gewählt wurde
            hinweisSchwierigkeit.innerHTML = "";
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                && (objValidation.schwierigkeit[1].valueOf() == "Mittel"))         //Falls Leicht und Mittel gewählt wurden
            {
                jsonDaten = quizFragen[(auswahlZufall * 3) + 6].valueOf();
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Leicht")
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer"))         //Falls Leicht und Schwer gewählt wurden
            {
                jsonDaten = quizFragen[(auswahlZufall * 3) + 7].valueOf();
            }
            if ((objValidation.schwierigkeit[0].valueOf() == "Mittel")
                && (objValidation.schwierigkeit[1].valueOf() == "Schwer")) //Falls Mittel und Schwer gewählt wurden
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

function fragenErstellen()
{
    console.log("fragenErstellen geladen"); //kleine notiz
    nichtAusgefuehrt = true;

    AnzahlFragenUserInput = document.getElementById("numberID").value;
    var random;  //Variable für die Zufallszahl. Diese wird im Schleifendurchlauf immer neu vergeben

    var str;                                                     //Stringvariable, in das die HTML Elemente gespeichert werden
    str = '<div class="alleFragen"><h2>Beantworte alle Fragen</h2>';

    for (var i = 0; i < AnzahlFragenUserInput; i++)             //for Schleife, die die Anzahl der gewählte Fragen durchläuft
    {
        if (AnzahlFragenUserInput == 1)                         //wenn nur eine Frage gewählt wurde
        {
            random = Math.floor(Math.random() * jsonDaten.length);
        }else
        {                                                  //wenn mehr als eine Frage gewählt wurde
            random = Math.floor(Math.random() * jsonDaten.length); //Zufallszahl, um die Fragen zufällig zu generieren

            var wiederholungsZaehler = 1;                   //Prüfzähler für die whileschreife
            //
            while (wiederholungsZaehler <= i)              //Soll Wiederholungen vermeiden
            {
                console.log("while loop");
                if (random == track[i - wiederholungsZaehler])
                {
                    console.log("Zahl wiederholt sich: " + "random: " + random + " track: " + track[i - wiederholungsZaehler]);
                    random = Math.floor(Math.random() * jsonDaten.length);
                    wiederholungsZaehler = 1;
                    //continue;
                }else
                {
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