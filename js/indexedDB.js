// ausgelagerte .js Datei für die Browserdatenbank

var datenbank;
var objectStore;
var ausgabeFeld;      // im output-Bereich werden später die letzten Ergebnisse angezeigt


// Funktion, um die Datenbank anzulegen oder zu öffnen
function datenbankOeffnen() {

	ausgabeFeld = document.getElementsByTagName('output');

    //noinspection JSUnresolvedVariable
    var request = window.indexedDB.open("gruppe5Datenbank.db",1);       // Es wird ein request gestartet, der die Datenbank 'gruppe5Datenbank' öffnen möchte

    request.onsuccess = function () {                                   // war der request erfolgreich und die Datenbank konnte geöffnet werden, wird das Datenbank-Objekt an die Variable 'datenbank' übergeben
        datenbank = this.result;
        console.log('Die Datenbank wurde erfolgreich geladen.');
    };
    
    request.onupgradeneeded = function () {                             // konnte die Datenbank nicht gefunden werden, wird eine neue Datenbank angelegt
        datenbank = this.result;                                        // auch in diesem Fall wird das Datenbank-Objekt an die Variable 'datenbank' übergeben
        console.log('Neue Datenbank angelegt.');

            //noinspection JSUnresolvedVariable
            if (!datenbank.objectStoreNames.contains('letztePreisBerechnungen')) {       // gibt es keinen Objectstore 'letzte Berechnungen', wird dieser angelegt

                console.log('Objektstore wird angelegt.');
                //noinspection JSUnresolvedFunction
                datenbank.createObjectStore('letztePreisBerechnungen', {
                    keyPath: 'id',                                                  // als key wird 'id' festgelegt
                    autoIncrement: true                                             // der key zählt bei jedem neuen Eintrag in den Objectstore automatisch einen weiter
                });
            }

            //noinspection JSUnresolvedVariable
            if (!datenbank.objectStoreNames.contains('quizErgebnisse')) {           // gleicher Ablauf wie beim o.g. Objectstore

                console.log('Objektstore wird angelegt.');
                //noinspection JSUnresolvedFunction
                datenbank.createObjectStore('quizErgebnisse', {
                    keyPath: 'id',
                    autoIncrement: true
                });
            }
			
            //noinspection JSUnresolvedVariable
            if (!datenbank.objectStoreNames.contains('letzteKontakte')) {       // gibt es keinen Objectstore 'letzte Berechnungen', wird dieser angelegt

                console.log('Objektstore wird angelegt.');
                //noinspection JSUnresolvedFunction
                datenbank.createObjectStore('letzteKontakte', {
                    keyPath: 'id',                                                  // als key wird 'id' festgelegt
                    autoIncrement: true                                             // der key zählt bei jedem neuen Eintrag in den Objectstore automatisch einen weiter
                });
            }

    };


    request.onerror = function () {         // War der request nicht erfolgreich und es konnte weder eine Datenbank geöffnet noch neu angelegt werden, wird eine Fehlermeldung ausgegeben
        console.log('Beim Laden der Datenbank ist ein Fehler aufgetreten.');
    };
}


// Funktion, um Daten in die Datenbank zu schreiben
function datenSpeichern(eingabeDaten, herkunft) {           // es werden zum einen die Daten, die gespeichert werden sollen, übergeben. zum anderen aber auch eine Prüfvariable

    objectStore = pruefeHerkunft(herkunft);                 // mit der Funktion wird geprüft, welche Datei die Datenbank geöffnet hat

    var requestSpeichern = objectStore.add(eingabeDaten);            // es wird ein request mit dem Ziel gestartet, die übergebenen Daten im Objectstore zu speichern

    requestSpeichern.onsuccess = function (event) {
        console.log('Eintrag ' + event.target.result + ' gespeichert.');    // war der request erfolgreich, erfolgt ein Konsoleneintrag
    };
}


// Funktion, um die Datenbank auszulesen
function datenLesen(herkunft) {

    ausgabeFeld[0].innerHTML = 'Hier sehen Sie die letzten Ergebnisse (neueste zuerst):<br>';    // löscht gleichzeitig den Inhalt des Ausgabefeldes bei jedem Aufruf, damit die Liste sich nicht wiederholt

    objectStore = pruefeHerkunft(herkunft);                 // mit der Funktion wird geprüft, welche Datei die Datenbank geöffnet hat
    console.log(objectStore);

    var countRequest = objectStore.count();
    countRequest.onsuccess = function() {
        console.log(countRequest.result);

        var abfrageBegrenzung = setzeAbfragebegrenzung(countRequest.result);
        console.log(abfrageBegrenzung);

        //noinspection JSUnresolvedFunction
        objectStore.openCursor(abfrageBegrenzung, 'prev').onsuccess = function (event) {        // auf dem Objectstore wird ein Zeiger geöffnet, der den Store rückwärts durchläuft. Wenn ein Eintrag gefunden wird, wird das onsuccess-Event ausgelöst
            var jsObjekt = event.target.result;                                         // findet er einen Eintrag, übergibt er das Ergebnis an 'jsObjekt'

            if (jsObjekt) {                                                             // da auch undefined übergeben werden kann, erfolgt sicherheitshalber eine Abfrage
                inHTMLwiedergeben(jsObjekt);                                            // wenn positiv, dann wird die Funktion 'inHTMLwiedergeben' aufgerufen
                //noinspection JSUnresolvedFunction
                jsObjekt.continue();                                                    // hiermit wird der Zeiger aufgefordert, zum nächsten Eintrag zu springen
            }

            else {
                console.log("Keine weiteren Einträge vorhanden!");                      // findet der Zeiger keinen Eintrag, erfolgt ein Konsoleneintrag
            }
        };      // schließt openCursor
    };      // schließt countRequest
}       // schließt datenLesen



function pruefeHerkunft(herkunft) {

    if (herkunft == 'preis') {                              // ist die Prüfvariable = 'preis', wird eine Transaction für den Objectstore 'letztePreisBerechnungen' geöffnet
        //noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
        objectStore = datenbank.transaction(['letztePreisBerechnungen'], 'readwrite').objectStore('letztePreisBerechnungen');
    }
    else if (herkunft == 'quiz') {                          // ist die Prüfvariable = 'quiz', wird eine Transaction für den Objectstore 'quizErgebnisse' geöffnet
        //noinspection JSUnresolvedFunction
        objectStore = datenbank.transaction(['quizErgebnisse'], 'readwrite').objectStore('quizErgebnisse');
    }
	else if(herkunft == 'letzteKontakte')
	{
		//noinspection JSUnresolvedFunction
        objectStore = datenbank.transaction(['letzteKontakte'], 'readwrite').objectStore('letzteKontakte');
	}
	else
	{
		console.log("Herkunft nicht vorhanden1!!");
	}

    return(objectStore);

}



function setzeAbfragebegrenzung(zaehler) {

    var abfrageBegrenzung;

    if (zaehler && zaehler > 5) {
        //noinspection JSUnresolvedFunction
        console.log('Der ObjectStore hat mehr als fünf Einträge');
        //noinspection JSUnresolvedFunction,JSUnresolvedVariable
        abfrageBegrenzung = IDBKeyRange.lowerBound(zaehler-4);     // damit wird eine Obergrenze festgelegt, die bezweckt, dass nur die ersten zehn Einträge des Objectstores ausgelesen werden
    }
    else {
        console.log('Der ObjectStore hat weniger als fünf Einträge');
        abfrageBegrenzung = null;               // keine Obergrenze, falls im ObjectStore weniger als fünf Einträge vorhanden sind
    }

    return(abfrageBegrenzung);

}



// Ausgabe der gelesenen Daten in HTML
function inHTMLwiedergeben(jsObjekt) {

    ausgabeFeld[0].innerHTML += '<br>';             // erzeugt eine Freizeile zwischen den Einträgen

    console.log(jsObjekt);                          // Ausgabe des Zeiger-Objektes in der Konsole
    jsObjekt = jsObjekt.value;                      // da das Zeiger-Ergebnis nur auf den Eintrag in der Datenbank zeigt, dessen Daten aber noch nicht enthält, muss darauf über die Eigenschaft 'value' zugegriffen werden
    console.log(jsObjekt);                          // Ausgabe des in der Datenbank gespeicherten Javascript-Objektes in der Konsole

    for (var eigenschaft in jsObjekt) {             // iteriert durch das Objekt
        if (jsObjekt.hasOwnProperty(eigenschaft) && eigenschaft != 'id') { /* Fehler abfangen + da die Datenbank jedem gespeicherten Objekt den keyPath
                                                                              als Eigenschaft anhängt, muss sichergestellt werden, dass dieser nicht mit ausgegeben wird */

                ausgabeFeld[0].innerHTML += eigenschaft + ': ' + jsObjekt[eigenschaft] + '<br>';        // dem Ausgabefeld wird die aktuelle Eigenschaft des Objektes hinzugefügt
            }   // if
    }       // for-Schleife

}       // Funktion 'inHTMLwiedergeben'