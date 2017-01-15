/*
 *Funktion, zum Einlesen von JSON mittels AJAX
 */
function jsonEinlesen(quellDatei, zaehler, herkunft) {

    var anfrage;

    if (herkunft == 'quiz') {
        anfrage = new XMLHttpRequest();
        anfrage.open('GET', quellDatei, true);
        anfrage.onload = function () {
            quizFragen[zaehler] = JSON.parse(anfrage.responseText);
            console.log(quizFragen[zaehler]);
        };
        anfrage.send();
    }   // if
    else if (herkunft == 'preise') {
        anfrage = new XMLHttpRequest();
        anfrage.open('GET', quellDatei, true);
        anfrage.onload = function () {
            jsonDaten = JSON.parse(anfrage.responseText);
            listeLaden();                                       // lädt die Preistabelle auf der Seite dynamisch, je nach Inhalt der JSON Datei
            anzahlPersonen();                                   // legt erstmalig die Liste der Checkbox 'Bootswahl' dynamisch an
        };
        anfrage.send();
    }   // else if
} // function
