/**
 * Created by yokoe on 19.01.2017.
 */

/**
 * Funktion, die die Formulareingabe in ein JSON-Objekt umwandelt
 */
function inObjektUmwandeln(benutzerName, vorname, auswahlSchwierigkeit, fragenAnzahl, richtig)
{
    console.log('inObjektUmwandeln() geladen');//kleine notiz

    var quizDaten = {};
    quizDaten.Versuche = quizVersuche;
    quizDaten.Benutzername = benutzerName;
    quizDaten.Vorname = vorname;
    quizDaten.Schwierigkeit = auswahlSchwierigkeit;
    quizDaten.Kategorie = auswahlKategorieSpeicher;
    quizDaten.Richtig = richtig;
    quizDaten.Fragenanzahl = fragenAnzahl;
    quizDaten.Richtig = richtig;
    var datum = new Date();
    quizDaten.Datum = datum.getDate() + "." + (datum.getMonth() + 1) + "." + datum.getFullYear() + " um " + datum.getHours() + ":" + datum.getMinutes() + " Uhr";
    console.log("Zu speichernde Daten: " + quizDaten);
    datenSpeichern(quizDaten, 'quiz');
}