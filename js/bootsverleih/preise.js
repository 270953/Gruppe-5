window.onload = initOnLoad;

var jsonDaten;      // Objekt, in das später die Daten aus der JSON Datei geschrieben werden
var mietdauer;
var personenZahl;

var ausgabeFeld1;
var ausgabeFeld2;

function initOnLoad() {

    // Fügt Events auf die Navigationsleiste hinzu
	navigationEventhandler();

    // Datenbank wird geöffnet oder angelegt; Funktion befindet sich in indexedDB.js
    datenbankOeffnen();

    jsonEinlesen('json/preise.json', null, 'preise');

	
    ausgabeFeld1 = document.getElementById('f1');
	ausgabeFeld2 = document.getElementById('f2');
	
    var buttonPreis = document.getElementById('berechnePreis');
    buttonPreis.addEventListener('click', berechnePreis, false);

    var bootsWahl = document.getElementById('bootsKlasse');
    bootsWahl.addEventListener('change', changeMietdauerText, false);
	
	var buttonLoeschen = document.getElementById("loesche");
	buttonLoeschen.onclick = function ()
	{datenBankLoeschen('preis');};

    personenZahl = document.getElementById('personen');
	personenZahl.onchange = pruefePers;

    mietdauer = document.getElementById('mietdauer');
	
    mietdauer.onchange = pruefeMietDauer;

    var letzteBerechnungen = document.getElementById('letzteBerechnungen');
    letzteBerechnungen.addEventListener('click', function () {
        datenLesen('preis');
    }, false);

}

function pruefeMietDauer ()
{
	return (checkVal(mietdauer, "Eingabewert darf maximal 30 sein!", ausgabeFeld2));
}

function pruefePers()
{
	var bool = checkVal(personenZahl, "Die Personenzahl darf den Wert 24 nicht &uuml;berschreiten!" , ausgabeFeld1);
	
	//falls die eingabe im gültigen bereich war, soll sich die tabelleneinfärbung aktualisieren
	if (bool)
	{
		//färbe die tabelle ein, entsprechend der ausgewählten personen
		tabelleEinfaerben(personenZahl.value);
	}
	
	//gebe den boolean wert weiter
	return bool;
}

// wird aufgerufen, wenn die Bootsklasse geändert wird
function changeMietdauerText() {                

    var mietdauerText = document.getElementById('mietdauerText').innerHTML;
    var bootsKlasse = ermittleBootsklasse();            // ermittelt das richtige Boot innerhalb der JSON Daten, um darauf direkt zugreifen zu können
    console.log(bootsKlasse);
	
    //noinspection JSUnresolvedVariable                                           // nur für Webstorm, da Webstorm nicht weiß, woher die Eigenschaft 'abrechnungsZeitraum' kommt
    var abrechnungsZeitraum = jsonDaten[bootsKlasse[0]].abrechnungsZeitraum;        // holt sich aus den JSON Daten den Abrechnungszeitraum für das ausgewählte Boot

    if (abrechnungsZeitraum == 'pro Tag') {             // je nach Abrechnungszeitraum der gerade gewählten Bootsklasse werden bei der Mietdauer der Text vor dem Input-Feld und das max-Attribut angepasst
        mietdauerText = 'Mietdauer in Tagen (max. 30 Tage):';
        mietdauer.setAttribute('max', '30');
    }
    else {
        mietdauerText = 'Mietdauer in Stunden (max. 10 Stunden):';
        mietdauer.setAttribute('max', '10');
    }

}


function berechnePreis() {              // wird beim Click auf den Button 'Preis berechnen' aufgerufen

//nur wenn die Personenanzahl und die Mietdauer im gültigen bereich sind 
//das & zeichen zwingt das überprüfen von allen bedingungen in dem if statement, da die methoden aufgerufen werden müssen
    if (pruefePers() & pruefeMietDauer()) {     

        var bootsKlasse = ermittleBootsklasse();
		
        mietdauerValue = mietdauer.value;
		
        var saisonPreis = ermittleSaisonPreis(bootsKlasse);
        var rabatt = ermittleRabatt(bootsKlasse);
        var endPreis = saisonPreis * mietdauerValue * rabatt;    // die Berechnung des Preises ist selbsterklärend

        document.getElementById('Preisberechnungen').innerHTML = 'Der Preis beträgt für diesen Zeitraum <b>' + endPreis.toFixed(2) + ' Euro</b>.';

        var eingabeDaten = {};

        eingabeDaten.Bootsklasse = jsonDaten[bootsKlasse[0]].name;
        eingabeDaten.Saison = document.getElementById('saison').value;
        eingabeDaten.Rabatt = document.getElementById('rabatt').value;

        //noinspection JSUnresolvedVariable
        var abrechnungsZeitraum = jsonDaten[bootsKlasse[0]].abrechnungsZeitraum;        // holt sich aus den JSON Daten den Abrechnungszeitraum für das ausgewählte Boot

        if (abrechnungsZeitraum == 'pro Tag') {             // je nach Abrechnungszeitraum der gerade gewählten Bootsklasse werden bei der Mietdauer der Text vor dem Input-Feld und das max-Attribut angepasst
            if (mietdauerValue > 1) {
                mietdauerValue += ' Tage';
            }
            else {
                mietdauerValue += ' Tag';
            }
        }
        else {
            if (mietdauerValue > 1) {
                mietdauerValue += ' Stunden';
            }
            else {
                mietdauerValue += ' Stunde';
            }
        }

        eingabeDaten.Mietdauer = mietdauerValue;
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