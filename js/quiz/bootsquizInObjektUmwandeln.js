/**
 * Created by yokoe on 19.01.2017.
 */

/**
 * Funktion, die die Formulareingabe in ein JSON-Objekt umwandelt
 */
function inObjektUmwandeln(benutzerName, vorname, auswahlSchwierigkeit, fragenAnzahl, richtig)
{
    console.log('inObjektUmwandeln() geladen');//kleine notiz

    var eingabeDaten = {};
    eingabeDaten.Versuche = versuche;
    eingabeDaten.Benutzername = benutzerName;
    eingabeDaten.Vorname = vorname;
    eingabeDaten.Schwierigkeit = auswahlSchwierigkeit;
    eingabeDaten.Kategorie = auswahlKategorieSpeicher;;
    eingabeDaten.Richtig = richtig;
    eingabeDaten.Fragenanzahl = fragenAnzahl;
    eingabeDaten.Richtig = richtig;
    var datum = new Date();
    eingabeDaten.Datum = datum.getDate() + "." + (datum.getMonth() + 1) + "." + datum.getFullYear() + " um " + datum.getHours() + ":" + datum.getMinutes() + " Uhr";
    jsonObjekt = JSON.stringify(eingabeDaten);        // umwandeln des JavaScript Objektes in ein JSON Objekt
    console.log('JSON Objekt: ' + jsonObjekt);              // Ausgabe des JSON Objektes in der Konsole
    datenSpeichern(eingabeDaten, 'quiz');
}