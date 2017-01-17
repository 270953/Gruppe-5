/**
 * Dies ermoeglicht eine Fehlermeldung, sollte noch kein Wert eingegeben worden sein.
 * .onchange prueft erst bei Veraenderung
 */

var csshinweisfarbeFehlerClass= "fehlermeldung";   //Pfad aus css/quiz_stylesheet.css


function pruefeVorname(){
    if (checkVal(vornameInput, vornameInput.validationMessage, fehlermeldungVorname) &&
        checkPattern(vornameInput, regexLetters, "Bitte nur Buchstaben.", fehlermeldungVorname, true)){
        korrekterVorname = true;
    }else{
        korrekterVorname = false;
    }
}

/**
 * Dies ermoeglicht eine Fehlermeldung, sollte noch kein Wert eingegeben worden sein.
 * .onchange prueft erst bei Veraenderung
 */
function pruefeBenutzername(){
    if (checkVal(benutzerNameInput, benutzerNameInput.validationMessage, fehlermeldungBenutzername) &&
        checkPattern(benutzerNameInput, regexLetters, "Bitte nur Buchstaben.", fehlermeldungBenutzername, true)){
        korrekterBenutzername = true;
    }else{
        korrekterBenutzername = false;
    }
}

/**
 * Dies ermoeglicht eine Fehlermeldung, sollte noch kein Wert eingegeben worden sein.
 * .onchange prueft erst bei Veraenderung
 */
function pruefenAnzahlFragen(){
    if (checkVal(fragenWaehler, "W&auml;hle eine Zahl zwischen 1 und 8.", fehlermeldungAnzahlFragen)){
        korrekteAnzahl = true;
    }else{

        korrekteAnzahl = false;
    }
}

/**
 * @param benutzerNameInput
 * @param vornameInput
 * @param schwierigkeitSelect
 * @param auswahlKategorie
 * @param fragenWaehler
 * @param quizErstellenButton
 * Funktion überprüft die formulardaten aus js/bootsquiz.js
 */
function quizCheck(benutzerNameInput, vornameInput, schwierigkeitSelect, auswahlKategorie, fragenWaehler) //wird quizerstellenButton hier gebraucht?
{
        //Funktionen werden bei Veraenderung aufgerufen
    benutzerNameInput.onchange = pruefeBenutzername;
    vornameInput.onchange = pruefeVorname;
    fragenWaehler.onchange = pruefenAnzahlFragen;
        //CSS-Einstellungen aus css/quiz_stylesheet.css wiederherstellen, da diese moeglicherweise durch quizZusammenStellen() veraendert wurden
    fehlermeldungSchwierigkeit.setAttribute("class", csshinweisfarbeFehlerClass);
    fehlermeldungKategorie.setAttribute("class", csshinweisfarbeFehlerClass);
    fehlermeldungBenutzername.setAttribute("class", csshinweisfarbeFehlerClass);
    fehlermeldungVorname.setAttribute("class", csshinweisfarbeFehlerClass);
    fehlermeldungAnzahlFragen.setAttribute("class", csshinweisfarbeFehlerClass);

    var counterSchwierigkeit = 0;    //es wird gezählt, wie viele optionen selektiert werden
    var selectedIndexArray = [];               //selectedIndexArray speichert die Value von der Checkbox
    var counterKategorie = 0;
    var fallunterscheidung;         //Variabler zur Fallunterscheidung, wann Schwierigkeit und wann Kategorie gewaehlt wurde

    for (var i = 0 ; i < 3 ; i++) {         //Schleife, die prueft, wie häufig gechekt wurde. counterSchwierigkeit wird hochgesetzt
            if (schwierigkeitSelect[i].checked == true) {
                    selectedIndexArray[counterSchwierigkeit] = schwierigkeitSelect[i].value;  //uebergibt Wert, wird checkObjekt{}
                    counterSchwierigkeit++;                                                   //zugewisen zur Weiterverarbeitung
            }
    }


    for (var j = 0; j < auswahlKategorie.length; j++){      //Schleife, die prueft, wie häufig gechekt wurde. counterKategorie wird hochgesetzt
            if (auswahlKategorie[j].checked){
                    auswahlKategorie = document.getElementById("kategorie"+j).value; //uebergibt Wert, wird checkObjekt{}
                    auswahlKategorieSpeicher = document.getElementById("kategorie"+j).value;
                    counterKategorie++;                                              //zugewisen zur Weiterverarbeitung
            }
    }

    fallunterscheidung = counterSchwierigkeit + "," + counterKategorie;     //Counter aus Schwierigkeit und Kategorie
                                                                            //werden zusammengelegt, zur Fallunterscheidung
    console.log("Fallunterscheidung: " + fallunterscheidung);

    switch(fallunterscheidung){
        case("0,0"):{           //Weder Schwierigkeit noch Kategorie wurde gewaehlt
            fehlermeldungSchwierigkeit.innerHTML = "W&auml;hle Kategorie und/oder Schwierigkeit!";
            fehlermeldungKategorie.innerHTML = "W&auml;hle Kategorie und/oder Schwierigkeit!";
            korrekteSchwierigkeit = false;          //boolean wird auf false gesetzt, falls vorher auf true war
            korrekteKategorie = false;              //boolean wird auf false gesetzt, falls vorher auf true war
            break;
        }
        case("0,1"):{           //Keine Schwierigkeit, eine Kategorie wurde gewaehlt
            fehlermeldungSchwierigkeit.innerHTML = "";  //falls zuvor eine Fehlermeldung ausgeloest wurde, soll
            fehlermeldungKategorie.innerHTML = "";      //diese durch leeren String ersetzt werden
            korrekteSchwierigkeit = true;               //boolean wird auf true gesetzt, falls vorher auf false war
            korrekteKategorie = true;                   //boolean wird auf true gesetzt, falls vorher auf false war
            break;
        }
        case("1,0"):{           //Eine Schwierigkeit, keine Kategorie wurde gewaehlt
            fehlermeldungSchwierigkeit.innerHTML = "";  //falls zuvor eine Fehlermeldung ausgeloest wurde, soll
            fehlermeldungKategorie.innerHTML = "";      //diese durch leeren String ersetzt werden
            korrekteSchwierigkeit = true;               //boolean wird auf true gesetzt, falls vorher auf false war
            korrekteKategorie = true;                   //boolean wird auf true gesetzt, falls vorher auf false war
            break;
        }
        case("1,1"):{           //Eine Schwierigkeit, eine Kategorie wurde gewaehlt
            fehlermeldungSchwierigkeit.innerHTML = "";  //falls zuvor eine Fehlermeldung ausgeloest wurde, soll
            fehlermeldungKategorie.innerHTML = "";      //diese durch leeren String ersetzt werden
            korrekteSchwierigkeit = true;               //boolean wird auf true gesetzt, falls vorher auf false war
            korrekteKategorie = true;                   //boolean wird auf true gesetzt, falls vorher auf false war
            break;
        }
        case("2,0"):{           //Zwei Schwierigkeiten, keine Kategorie wurde gewaehlt
            fehlermeldungSchwierigkeit.innerHTML = "";  //falls zuvor eine Fehlermeldung ausgeloest wurde, soll
            fehlermeldungKategorie.innerHTML = "";      //diese durch leeren String ersetzt werden
            korrekteSchwierigkeit = true;               //boolean wird auf true gesetzt, falls vorher auf false war
            korrekteKategorie = true;                   //boolean wird auf true gesetzt, falls vorher auf false war
            break;
        }
        case("2,1"):{           //Zwei Schwierigkeiten, eine Kategorie wurde gewaehlt
            fehlermeldungSchwierigkeit.innerHTML = "";  //falls zuvor eine Fehlermeldung ausgeloest wurde, soll
            fehlermeldungKategorie.innerHTML = "";      //diese durch leeren String ersetzt werden
            korrekteSchwierigkeit = true;               //boolean wird auf true gesetzt, falls vorher auf false war
            korrekteKategorie = true;                   //boolean wird auf true gesetzt, falls vorher auf false war
            break;
        }
        case("3,0"):{           //Drei Schwierigkeiten, keine Kategorie wurde gewaehlt
            fehlermeldungSchwierigkeit.innerHTML = "Nicht mehr als zwei Angaben!";//schwierigkeitSelect.validationMessage;
            korrekteSchwierigkeit = false;              //boolean wird auf false gesetzt, falls vorher auf true war
            break;
        }
        case("3,1"):{           //Drei Schwierigkeiten, eine Kategorie wurde gewaehlt
            fehlermeldungSchwierigkeit.innerHTML = "Nicht mehr als zwei Angaben!";//schwierigkeitSelect.validationMessage;
            korrekteSchwierigkeit = false;               //boolean wird auf false gesetzt, falls vorher auf true war
            break;
        }
    }

    if (korrekterBenutzername && korrekterVorname && korrekteSchwierigkeit && korrekteKategorie && korrekteAnzahl){
            console.log("Formularbedingung erfuellt");
            var checkObjekt;        //Objekt erstellen, welches an Funktion quizZusammenstellen() uebergeben wird
            checkObjekt = {kategorie: auswahlKategorie , schwierigkeit: selectedIndexArray};
            quizZusammenStellen(checkObjekt);               //Funktion aus js/bootsquiz wird aufgerufen, wenn alle Bedingungen
    }                                                       //erfuellt wurden

    //Ermöglicht nach Auslassen des Radobuttons diesen Anzuwaehlen und verarbeiten zu lassen.
    kategorieAuswahl = document.getElementsByName('kategorie');
    fragenWaehler = document.getElementById("numberID");
}