window.onload = eventHandler;

var jsonDaten;      // Objekt, in das später die Daten aus der JSON Datei geschrieben werden


function eventHandler() {

    // Datenbank wird geöffnet oder angelegt; Funktion befindet sich in indexedDB.js
    datenbankOeffnen();

    jsonEinlesen();

    var buttonPreis = document.getElementById('berechnePreis');
    buttonPreis.addEventListener('click', berechnePreis, false);

    var bootsWahl = document.getElementById('bootsKlasse');
    bootsWahl.addEventListener('change', changeMietdauerText, false);

    var personenZahl = document.getElementById('personen');
    personenZahl.addEventListener('change', anzahlPersonen, false);

    var mietdauerAendern = document.getElementById('mietdauer');
    mietdauerAendern.addEventListener('change', eingabeMietdauerPruefen, false);

    var letzteBerechnungen = document.getElementById('letzteBerechnungen');
    letzteBerechnungen.addEventListener('click', function () {
        datenLesen('preis');
    }, false);

}


// JSON Datei wird per AJAX eingelesen
function jsonEinlesen () {

    var anfrage = new XMLHttpRequest();
    anfrage.open('GET', 'json/preise.json');
    anfrage.onload = function() {

        jsonDaten = JSON.parse(anfrage.responseText);       // die JSON Daten werden gleich in ein JavaScript Objekt umgewandelt und in jsonDaten gespeichert
        listeLaden();                                       // lädt die Preistabelle auf der Seite dynamisch, je nach Inhalt der JSON Datei
        anzahlPersonen();                                   // legt erstmalig die Liste der Checkbox 'Bootswahl' dynamisch an
    };

    anfrage.send();
}


// lädt die Preistabelle auf der Seite dynamisch
function listeLaden () {

    var tabelle = document.getElementById('preise');

    for (var zaehlerArray=0; zaehlerArray<jsonDaten.length; zaehlerArray++) {           // durchläuft die JSON Daten je nach Anzahl der darin gespeicherten Boote

        var neueZeile = document.createElement('tr');                                   // erschafft ein neues Zeilenelement

        var neuesAttribut = document.createAttribute('class');                          // neues Attribut, das später der Zeile zugeordnet wird

        if (zaehlerArray%2 == 0) {              // je nachdem, ob es sich um eine gerade oder ungerade Zeile handelt, erhält das o.g. Attribut einen anderen Wert
            neuesAttribut.value = 'gerade';     // das ist später für das Einfärben der Tabelle relevant
        }
        else {
            neuesAttribut.value = 'ungerade';
        }

        neueZeile.setAttributeNode(neuesAttribut);          // der Zeile wird hier der class-Knoten zugewiesen

        for (var zaehlerObjekt in jsonDaten[zaehlerArray]) {        // durchläuft das jeweilige 'Bootsobjekt' in Bezug auf die Anzahl der Eigenschaften jedes Bootes

            var neueSpalte = document.createElement('td');          // und erschafft für jede Eigenschaft eine neue Spalte in der Tabelle

            if (jsonDaten[zaehlerArray].hasOwnProperty(zaehlerObjekt)) {
                var inhalt = document.createTextNode(jsonDaten[zaehlerArray][zaehlerObjekt]);       // Zuweisen des Wertes der Eigenschaft an einen Textknoten
            }

            neueSpalte.appendChild(inhalt);     // Zuweisung des Textknotens an die Spalte

            neueZeile.appendChild(neueSpalte);  // Zuweisung der Spalte an die Zeile

        }

        tabelle.appendChild(neueZeile);        // Zuweisung der Zeile an die Tabelle
    }

}


function changeMietdauerText() {                // wird aufgerufen, wenn die Bootsklasse geändert wird

    var mietdauer = document.getElementById('mietdauer');
    var ausgabeText = document.getElementById('mietdauerText');
    var bootsKlasse = ermittleBootsklasse();            // ermittelt das richtige Boot innerhalb der JSON Daten, um darauf direkt zugreifen zu können
    console.log(bootsKlasse);
    //noinspection JSUnresolvedVariable                                           // nur für Webstorm, da Webstorm nicht weiß, woher die Eigenschaft 'abrechnungsZeitraum' kommt
    var abrechnungsZeitraum = jsonDaten[bootsKlasse[0]].abrechnungsZeitraum;        // holt sich aus den JSON Daten den Abrechnungszeitraum für das ausgewählte Boot

    if (abrechnungsZeitraum == 'pro Tag') {             // je nach Abrechnungszeitraum der gerade gewählten Bootsklasse werden bei der Mietdauer der Text vor dem Input-Feld und das max-Attribut angepasst
        ausgabeText.innerHTML = 'Mietdauer in Tagen (max. 30 Tage):';
        mietdauer.setAttribute('max', '30');
    }
    else {
        ausgabeText.innerHTML = 'Mietdauer in Stunden (max. 10 Stunden):';
        mietdauer.setAttribute('max', '10');
    }

}


function eingabeMietdauerPruefen() {            // wird aufgerufen, wenn die Mietdauer geändert wird

    var mietdauer = document.getElementById('mietdauer');

    if (mietdauer.checkValidity() == false) {       // prüft auf die Richtigkeit der Eingabe

        mietdauer.setAttribute('class', 'falseInput');  // ändert die Farbe des Feldes, wenn die Eingabe nicht den Vorgaben entspricht und...
        console.log(mietdauer.validationMessage);

        var ausgabeFeld = document.getElementById('ergebnis');
        ausgabeFeld.innerHTML = 'Mit der eingegebenen Mietdauer kann kein Preis berechnet werden.<br>' +    // ...dann wird dem Anwender auch eine Information
                                'Bitte geben Sie eine ganze Zahl von 1 bis zur maximalen Mietdauer an.';    // über die falsche Eingabe gegeben.
    }

    else {
        if (mietdauer.hasAttribute('class')) {          // wenn die Eingabe korrekt war, wird die Hintergrundfarbe des Feldes wieder neutralisiert
            mietdauer.removeAttribute('class');
        }
    }

}


function anzahlPersonen() {                 // wird aufgerufen, wenn die Personenanzahl geändert wird

    var personenZahl = document.getElementById('personen');

    if (personenZahl.checkValidity() == true) {     // prüft die Richtigkeit der Eingabe (Erläuterung: siehe Z. 115ff)
                                                    // erst wenn diese korrekt ist, wird der weitere Code ausgeführt
        if (personenZahl.hasAttribute('class')) {

            personenZahl.removeAttribute('class');
        }

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

        for (var zaehlerArray = 0; zaehlerArray < jsonDaten.length; zaehlerArray++) {   // durchläuft wieder die Boote, die aus JSON eingelesen worden waren

            //noinspection JSUnresolvedVariable
            if (jsonDaten[zaehlerArray].maxPersonen >= personenZahl) {      // wenn die max Personenanzahl des Bootes gleich oder über der Eingabe des Nutzers ist, wird das
                                                                            // Boot in die Liste der checkbox aufgenommen
                var neuesElement = document.createElement('option');        // entsprechend werden dafür Kindelemente der Checkbox angelegt
                var neuesAttribut = document.createAttribute('value');

                if (jsonDaten[zaehlerArray].hasOwnProperty('name')) {
                    var text = jsonDaten[zaehlerArray].name;
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

    else {                      // wenn die Eingabe des Nutzers ungültig ist, wird folgender Code ausgeführt (siehe oben)

        personenZahl.setAttribute('class', 'falseInput');
        console.log(personenZahl.validationMessage);

        var ausgabeFeld = document.getElementById('ergebnis');

        ausgabeFeld.innerHTML = 'Die eingegebene Personenanzahl ist ungültig.<br>' +
                                'Bitte geben Sie eine ganze Zahl von 0 bis einschließlich 24 an.';
    }
}


function tabelleEinfaerben(personenZahl) {          // wird aus der Funktion anzahlPersonen() heraus aufgerufen und färbt die Tabelle so ein, dass
                                                    // die Boote grün angezeigt werden, die mit der gewählten Personenzahl nutzbar sind
    var zeile = document.querySelectorAll('tr');    // holt sich alle Zeilen der Preistabelle in einen Array

    for (var zaehlerArray = 0; zaehlerArray < jsonDaten.length; zaehlerArray++) {       // durchläuft wieder die Boote aus der JSON Datei

        //noinspection JSUnresolvedVariable
        if (personenZahl <= jsonDaten[zaehlerArray].maxPersonen && personenZahl != 0) { // nur wenn Personenzahl des Boots >= der eingegebenen Personenzahl ist,
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


function berechnePreis() {              // wird beim Click auf den Button 'Preis berechnen' aufgerufen

    var mietdauer = document.getElementById('mietdauer');
    console.log(mietdauer.value);

    var ausgabeFeld = document.getElementById('ergebnis');

    if (mietdauer.checkValidity() == false) {       // Wenn eine falsche Mietdauer eingegeben wurde, wird eine Fehlermeldung ausgegeben

        mietdauer.setAttribute('class', 'falseInput');
        console.log(mietdauer.validationMessage);

        ausgabeFeld.innerHTML = 'Mit der eingegebenen Mietdauer kann kein Preis berechnet werden.<br>' +
                                'Bitte geben Sie eine ganze Zahl von 1 bis zur maximalen Mietdauer an.';
    }

    else {                                          // nur wenn die Mietdauer einen gültigen Wert enthält, wird in die Berechnung des Preises eingestiegen

        var bootsKlasse = ermittleBootsklasse();
        mietdauer = mietdauer.value;
        var saisonPreis = ermittleSaisonPreis(bootsKlasse);
        var rabatt = ermittleRabatt(bootsKlasse);
        var endPreis = saisonPreis * mietdauer * rabatt;    // die Berechnung des Preises ist selbsterklärend

        ausgabeFeld.innerHTML = 'Der Preis beträgt für diesen Zeitraum ' + endPreis.toFixed(2) + ' Euro.';

        var eingabeDaten = {};

        eingabeDaten.Bootsklasse = jsonDaten[bootsKlasse[0]].name;
        eingabeDaten.Saison = document.getElementById('saison').value;
        eingabeDaten.Rabatt = document.getElementById('rabatt').value;

        //noinspection JSUnresolvedVariable
        var abrechnungsZeitraum = jsonDaten[bootsKlasse[0]].abrechnungsZeitraum;        // holt sich aus den JSON Daten den Abrechnungszeitraum für das ausgewählte Boot

        if (abrechnungsZeitraum == 'pro Tag') {             // je nach Abrechnungszeitraum der gerade gewählten Bootsklasse werden bei der Mietdauer der Text vor dem Input-Feld und das max-Attribut angepasst
            if (mietdauer > 1) {
                mietdauer += ' Tage';
            }
            else {
                mietdauer += ' Tag';
            }
        }
        else {
            if (mietdauer > 1) {
                mietdauer += ' Stunden';
            }
            else {
                mietdauer += ' Stunde';
            }
        }

        eingabeDaten.Mietdauer = mietdauer;
        eingabeDaten.Preis = '<b>' + endPreis.toFixed(2) + ' Euro</b>';

        var datum = new Date();
        eingabeDaten.Berechnungsdatum = datum.getDate() + "." + (datum.getMonth() + 1) + "." + datum.getFullYear() + " um " + datum.getHours() + ":" + datum.getMinutes() + " Uhr";

        datenSpeichern(eingabeDaten, 'preis');
    }

}


function ermittleBootsklasse() {        // wurde ausgelagert, um den Code übersichtlicher zu gestalten

    var selectedBoot = document.getElementById('bootsKlasse').value;
    var rueckgabe;

    for (var zaehlerArray=0; zaehlerArray<jsonDaten.length; zaehlerArray++) {       // durchläuft die Bootsobjekte

        for (var zaehlerObjekt in jsonDaten[zaehlerArray]) {        // durchläuft die Eigenschaften des jeweiligen Bootsobjektes

            if (jsonDaten[zaehlerArray].hasOwnProperty(zaehlerObjekt) && jsonDaten[zaehlerArray][zaehlerObjekt] == selectedBoot) {      // wenn ein Objekt vorhanden ist und die Gerade durchlaufene
                                                                                                                                        // Eigenschaft gleich der vom Nutzer gewählten Bootsklasse ist...
                rueckgabe = [zaehlerArray, zaehlerObjekt];              // ...wird die Nummer dieses Bootsobjektes an die aufrufende Funktion zurückgegeben
                return (rueckgabe);                                     // damit diese im weiteren direkt auf das richtige Boot zugreifen kann

            }

        }

    }

}


function ermittleSaisonPreis(selectedBoot) {            // ermittelt den Saisonpreis des an die Funktion übergebenen Bootes

    var rueckgabe;
    if (document.getElementById('saison').value == 'Hauptsaison') {
        //noinspection JSUnresolvedVariable,
        rueckgabe = jsonDaten[selectedBoot[0]].Hauptsaison;
    }
    else {
        //noinspection JSUnresolvedVariable
        rueckgabe = jsonDaten[selectedBoot[0]].Nebensaison;
    }
    return(rueckgabe);
}


function ermittleRabatt(selectedBoot) {                 // ermittelt den Rabatt des an die Funktion übergebenene Bootes

    var rueckgabe;
    if (document.getElementById('rabatt').value == 'ja') {      // wenn rabattfähig gewählt wurde...
        //noinspection JSUnresolvedVariable
        rueckgabe = jsonDaten[selectedBoot[0]].rabatt;          // holt sich das Programm den Rabattwert aus den JSON Daten
    }
    else {
        rueckgabe = 0;                                          // ansonsten ist der Rabatt gleich 0
    }

    rueckgabe = (100-rueckgabe)*0.01;                   // es wird ein Faktor zurückgegeben, der sich wie folgt ergibt: (100%-Rabatt) geteilt durch 100
    return(rueckgabe);
}