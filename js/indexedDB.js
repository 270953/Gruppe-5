// ausgelagerte .js Datei für die Browserdatenbank

var datenbank;
var objectStore;
var ausgabeFeld = document.getElementsByTagName('output');


// Funktion, um die Datenbank anzulegen oder zu öffnen
function datenbankOeffnen() {

    //noinspection JSUnresolvedVariable
    var request = window.indexedDB.open("gruppe5Datenbank.db",1);
    console.log('Er möchte eine Datenbank öffnen.');

    request.onsuccess = function () {
        datenbank = this.result;
        console.log('Die Datenbank wurde erfolgreich geladen.');
    };

    request.onerror = function () {
        console.log('Beim Laden der Datenbank ist ein Fehler aufgetreten.');
    };

    request.onupgradeneeded = function () {
        datenbank = this.result;
        console.log('Neue Datenbank angelegt.');

            //noinspection JSUnresolvedVariable
            if (!datenbank.objectStoreNames.contains('letzteBerechnungen')) {

                console.log('Objektstore wird angelegt.');
                //noinspection JSUnresolvedFunction
                datenbank.createObjectStore('letzteBerechnungen', {
                    keyPath: 'id',
                    autoIncrement: true
                });
            }

            //noinspection JSUnresolvedVariable
            if (!datenbank.objectStoreNames.contains('quizErgebnisse')) {

                console.log('Objektstore wird angelegt.');
                //noinspection JSUnresolvedFunction
                datenbank.createObjectStore('quizErgebnisse', {
                    keyPath: 'id',
                    autoIncrement: true
                });
            }
        };
}


// Funktion, um Daten in die Datenbank zu schreiben
function datenSpeichern(eingabeDaten, herkunft) {

    if (herkunft == 'preis') {
        objectStore = datenbank.transaction(['letzteBerechnungen'], 'readwrite').objectStore('letzteBerechnungen');
    }
    else if (herkunft == 'quiz') {
        objectStore = datenbank.transaction(['quizErgebnisse'], 'readwrite').objectStore('quizErgebnisse');
    }

    var request = objectStore.add(eingabeDaten);
    request.onsuccess = function (event) {
        console.log('Eintrag ' + event.target.result + ' gespeichert.');
    };
}


// Funktion, um die Datenbank auszulesen
function datenLesen(herkunft) {

    ausgabeFeld[0].innerHTML = 'Hier sehen Sie die letzten Ergebnisse:<br>'; //löscht den Inhalt des Ausgabefeldes bei jedem Aufruf, damit die Liste sich nicht wiederholt

    if (herkunft == 'preis') {
        objectStore = datenbank.transaction(['letzteBerechnungen'], 'readwrite').objectStore('letzteBerechnungen');
    }
    else if (herkunft == 'quiz') {
        objectStore = datenbank.transaction(['quizErgebnisse'], 'readwrite').objectStore('quizErgebnisse');
    }

    //noinspection JSUnresolvedFunction
    objectStore.openCursor().onsuccess = function (event) {
        var jsObjekt = event.target.result;

        if (jsObjekt) {
            inHTMLwiedergeben(jsObjekt);
            //noinspection JSUnresolvedFunction
            jsObjekt.continue();
        }

        else {
            console.log("No more entries!");
        }
    };

}


// Ausgabe der gelesenen Daten in HTML
        function inHTMLwiedergeben(jsObjekt) {

            ausgabeFeld[0].innerHTML += '<br>';

            if (jsObjekt) {

                console.log(jsObjekt);                          // Ausgabe des JavaScript Objektes in der Konsole
                jsObjekt = jsObjekt.value;
                console.log(jsObjekt);

                for (var eigenschaft in jsObjekt) {             // iteriert durch das Objekt
                    if (jsObjekt.hasOwnProperty(eigenschaft)) {

                        if (eigenschaft != 'id') {

                            ausgabeFeld[0].innerHTML += eigenschaft + ': ' + jsObjekt[eigenschaft] + '<br>';
                        }

                    }
                }

    }

}