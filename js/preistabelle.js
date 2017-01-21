/**
 * lädt die Preistabelle auf der Seite dynamisch
 */
function listeLaden () {

    var tabelle = document.getElementById('preise');

    for (var zaehlerArray=0; zaehlerArray<quizJsonDaten.length; zaehlerArray++) {           // durchläuft die JSON Daten je nach Anzahl der darin gespeicherten Boote

        var neueZeile = document.createElement('tr');                                   // erschafft ein neues Zeilenelement

        var neuesAttribut = document.createAttribute('class');                          // neues Attribut, das später der Zeile zugeordnet wird

        if (zaehlerArray%2 == 0) {              // je nachdem, ob es sich um eine gerade oder ungerade Zeile handelt, erhält das o.g. Attribut einen anderen Wert
            neuesAttribut.value = 'gerade';     // das ist später für das Einfärben der Tabelle relevant
        }
        else {
            neuesAttribut.value = 'ungerade';
        }

        neueZeile.setAttributeNode(neuesAttribut);          // der Zeile wird hier der class-Knoten zugewiesen

        for (var zaehlerObjekt in quizJsonDaten[zaehlerArray]) {        // durchläuft das jeweilige 'Bootsobjekt' in Bezug auf die Anzahl der Eigenschaften jedes Bootes

            var neueSpalte = document.createElement('td');          // und erschafft für jede Eigenschaft eine neue Spalte in der Tabelle

            if (quizJsonDaten[zaehlerArray].hasOwnProperty(zaehlerObjekt)) {
                var inhalt = document.createTextNode(quizJsonDaten[zaehlerArray][zaehlerObjekt]);       // Zuweisen des Wertes der Eigenschaft an einen Textknoten
            }

            neueSpalte.appendChild(inhalt);     // Zuweisung des Textknotens an die Spalte

            neueZeile.appendChild(neueSpalte);  // Zuweisung der Spalte an die Zeile

        }
        tabelle.appendChild(neueZeile);        // Zuweisung der Zeile an die Tabelle
    }
}



/**
 * wird aus der Funktion anzahlPersonen() heraus aufgerufen und färbt die Tabelle so ein, dass
 * die Boote grün angezeigt werden, die mit der gewählten Personenzahl nutzbar sind
 * @param personenZahl
 */
function tabelleEinfaerben(personenZahl) {

    var zeile = document.querySelectorAll('tr');    // holt sich alle Zeilen der Preistabelle in einen Array

    for (var zaehlerArray = 0; zaehlerArray < quizJsonDaten.length; zaehlerArray++) {       // durchläuft wieder die Boote aus der JSON Datei

        //noinspection JSUnresolvedVariable
        if (personenZahl <= quizJsonDaten[zaehlerArray].maxPersonen && personenZahl != 0) { // nur wenn Personenzahl des Boots >= der eingegebenen Personenzahl ist,
            // wird der folgende Code ausgeführt
            if (zaehlerArray % 2 == 0) {
                zeile[zaehlerArray+1].className = 'gruenGerade';            // bei geraden Zeilen, wird die Zeile mit einem anderen grün eingefärbt...
            }
            else {
                zeile[zaehlerArray+1].className = 'gruenUngerade';          // ...als bei ungeraden Zeilen.
            }
        }
        else {

            if (zaehlerArray % 2 == 0) {
                zeile[zaehlerArray+1].className = 'gerade';                 // ansonsten erhält die Zeile einen der Standard-Grautöne
            }
            else {
                zeile[zaehlerArray+1].className = 'ungerade';
            }
        }
    }
}

/**
 * wird aufgerufen, wenn die Personenanzahl geändert wird
 */
function anzahlPersonen() {

    var personenZahl = document.getElementById('personen');

    if (pruefFunktion(personenZahl) == true) {     // prüft die Richtigkeit der Eingabe (Erläuterung: siehe Z. 115ff)
        // erst wenn diese korrekt ist, wird der weitere Code ausgeführt
        personenZahl = personenZahl.value;

        var bootsKlasse = document.getElementById('bootsKlasse');
        var bootsKlasseAktuell = bootsKlasse.value;

        if (personenZahl != 0) {               // färbt die Tabelle nur ein, wenn die Personenanzahl ungleich 0 ist
            tabelleEinfaerben(personenZahl);   // übergibt die Variable Personenzahl an die Funktion 'tabelleEinfaerben'
        }
        else {
            personenZahl = 1;                   // ändert die personenzahl auf 1 für die folgende for-Schleife
        }

        while (bootsKlasse.childElementCount > 0) {     // löscht alle Elemente der Check-Box, um im Folgenden die Elemente mit den richtigen Elementen neu anzulegen
            bootsKlasse.removeChild(bootsKlasse.lastChild);
        }

        for (var zaehlerArray = 0; zaehlerArray < quizJsonDaten.length; zaehlerArray++) {   // durchläuft wieder die Boote, die aus JSON eingelesen worden waren

            //noinspection JSUnresolvedVariable
            if (quizJsonDaten[zaehlerArray].maxPersonen >= personenZahl) {      // wenn die max Personenanzahl des Bootes gleich oder über der Eingabe des Nutzers ist, wird das
                // Boot in die Liste der checkbox aufgenommen
                var neuesElement = document.createElement('option');        // entsprechend werden dafür Kindelemente der Checkbox angelegt
                var neuesAttribut = document.createAttribute('value');

                if (quizJsonDaten[zaehlerArray].hasOwnProperty('name')) {
                    var text = quizJsonDaten[zaehlerArray].name;
                    var neuerTextKnoten = document.createTextNode(text);
                    neuesAttribut.value = text;
                }

                neuesElement.setAttributeNode(neuesAttribut);
                neuesElement.appendChild(neuerTextKnoten);
                bootsKlasse.appendChild(neuesElement);

            }

        }

        if (bootsKlasseAktuell == ''){                  // nur für den ersten Durchlauf von Bedeutung, damit eine Bootsklasse vorausgewählt ist
            bootsKlasse.value = 'Windjammer';
        }
        else {
            bootsKlasse.value = bootsKlasseAktuell;     // ansonsten wird die Bootsklasse genommen, die zuvor ausgewählt war (wenn sie denn noch Teil der neuen Liste ist)
        }
    }
}