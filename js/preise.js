window.onload = eventHandler;

var jsonDaten;


function eventHandler() {

    jsonEinlesen();

    var buttonPreis = document.getElementById('berechnePreis');
    buttonPreis.addEventListener('click', berechnePreis, false);

    var bootsWahl = document.getElementById('bootsKlasse');
    bootsWahl.addEventListener('change', changeMietdauerText, false);

    var personenZahl = document.getElementById('personen');
    personenZahl.addEventListener('change', anzahlPersonen, false);

    var mietdauerAendern = document.getElementById('mietdauer');
    mietdauerAendern.addEventListener('change', eingabeMietdauerPruefen, false);

}


function jsonEinlesen () {

    var anfrage = new XMLHttpRequest();
    anfrage.open('GET', 'js/preise.json');
    anfrage.onload = function() {

        jsonDaten = JSON.parse(anfrage.responseText);
        listeLaden();
        anzahlPersonen();
    };

    anfrage.send();
}


function listeLaden () {

    var tabelle = document.getElementById('preise');

    for (var zaehlerArray=0; zaehlerArray<jsonDaten.length; zaehlerArray++) {

        var neueZeile = document.createElement('tr');

        var neuesAttribut = document.createAttribute('class');

        if (zaehlerArray%2 == 0) {
            neuesAttribut.value = 'gerade';
        }
        else {
            neuesAttribut.value = 'ungerade';
        }

        neueZeile.setAttributeNode(neuesAttribut);

        for (var zaehlerObjekt in jsonDaten[zaehlerArray]) {

            var neueSpalte = document.createElement('td');

            if (jsonDaten[zaehlerArray].hasOwnProperty(zaehlerObjekt)) {
                var inhalt = document.createTextNode(jsonDaten[zaehlerArray][zaehlerObjekt]);
            }

            neueSpalte.appendChild(inhalt);

            neueZeile.appendChild(neueSpalte);

        }

        tabelle.appendChild(neueZeile);
    }

}


function changeMietdauerText() {

    var mietdauer = document.getElementById('mietdauer');
    var ausgabeText = document.getElementById('mietdauerText');
    var bootsKlasse = ermittleBootsklasse();
    //noinspection JSUnresolvedVariable
    var abrechnungsZeitraum = jsonDaten[bootsKlasse[0]].abrechnungsZeitraum;

    if (abrechnungsZeitraum == 'pro Tag') {
        ausgabeText.innerHTML = 'Mietdauer in Tagen (max. 30 Tage):';
        mietdauer.setAttribute('max', '30');
    }
    else {
        ausgabeText.innerHTML = 'Mietdauer in Stunden (max. 10 Stunden):';
        mietdauer.setAttribute('max', '10');
    }

}


function eingabeMietdauerPruefen() {

    var mietdauer = document.getElementById('mietdauer');

    if (mietdauer.checkValidity() == false) {

        mietdauer.value = 1;
        window.alert('Bitte geben Sie eine ganze Zahl von 1 bis zur maximalen Mietdauer an.');
    }

}


function anzahlPersonen() {

    var personenZahl = document.getElementById('personen');

    if (personenZahl.checkValidity() == true) {

        personenZahl = personenZahl.value;

        var bootsKlasse = document.getElementById('bootsKlasse');
        var bootsKlasseAktuell = bootsKlasse.value;

        if (personenZahl != '') {
            tabelleEinfaerben(personenZahl);
        }
        else {
            personenZahl = 1;
        }

        while (bootsKlasse.childElementCount > 0) {
            bootsKlasse.removeChild(bootsKlasse.lastChild);
        }

        for (var zaehlerArray = 0; zaehlerArray < jsonDaten.length; zaehlerArray++) {

            //noinspection JSUnresolvedVariable
            if (jsonDaten[zaehlerArray].maxPersonen >= personenZahl) {

                var neuesElement = document.createElement('option');
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

        if (bootsKlasseAktuell == ''){
            bootsKlasse.value = 'Windjammer';
        }
        else {
            bootsKlasse.value = bootsKlasseAktuell;
        }
    }

    else {

        personenZahl.value = 1;
        window.alert('Bitte geben Sie eine ganze Zahl von 0 bis 24.');
        console.log(personenZahl.validationMessage);

    }
}


function tabelleEinfaerben(personenZahl) {

    var zeile = document.querySelectorAll('tr');

    for (var zaehlerArray = 0; zaehlerArray < jsonDaten.length; zaehlerArray++) {

        //noinspection JSUnresolvedVariable
        if (personenZahl <= jsonDaten[zaehlerArray].maxPersonen && personenZahl != 0) {

            if (zaehlerArray % 2 == 0) {
                zeile[zaehlerArray+1].className = 'gruenGerade';
            }
            else {
                zeile[zaehlerArray+1].className = 'gruenUngerade';
            }
        }
        else {

            if (zaehlerArray % 2 == 0) {
                zeile[zaehlerArray+1].className = 'gerade';
            }
            else {
                zeile[zaehlerArray+1].className = 'ungerade';
            }
        }
    }
}


function berechnePreis() {

    var mietdauer = document.getElementById('mietdauer');

    if (mietdauer.checkValidity() == false) {

        mietdauer.value = 1;
        window.alert('Bitte geben Sie eine ganze Zahl von 1 bis zur maximalen Mietdauer an.');
    }

    else {

        var selectedBoot = ermittleBootsklasse();
        var saisonPreis = ermittleSaisonPreis(selectedBoot);
        var rabatt = ermittleRabatt(selectedBoot);

        var endPreis = saisonPreis * mietdauer * rabatt;

        var ausgabeFeld = document.getElementById('ergebnis');

        ausgabeFeld.innerHTML = 'Der Preis beträgt für diesen Zeitraum ' + endPreis.toFixed(2) + ' Euro.';
    }

}


function ermittleBootsklasse() {

    var selectedBoot = document.getElementById('bootsKlasse').value;
    var rueckgabe;

    for (var zaehlerArray=0; zaehlerArray<jsonDaten.length; zaehlerArray++) {

        for (var zaehlerObjekt in jsonDaten[zaehlerArray]) {

            if (jsonDaten[zaehlerArray].hasOwnProperty(zaehlerObjekt) && jsonDaten[zaehlerArray][zaehlerObjekt] == selectedBoot) {

                rueckgabe = [zaehlerArray, zaehlerObjekt];
                return (rueckgabe);

            }

        }

    }

}


function ermittleSaisonPreis(selectedBoot) {

    var rueckgabe;
    if (document.getElementById('saison').value == 'Hauptsaison') {
        //noinspection JSUnresolvedVariable
        rueckgabe = jsonDaten[selectedBoot[0]].Hauptsaison;
    }
    else {
        //noinspection JSUnresolvedVariable
        rueckgabe = jsonDaten[selectedBoot[0]].Nebensaison;
    }
    return(rueckgabe);
}


function ermittleRabatt(selectedBoot) {

    var rueckgabe;
    if (document.getElementById('rabatt').value == 'ja') {
        //noinspection JSUnresolvedVariable
        rueckgabe = jsonDaten[selectedBoot[0]].rabatt;
    }
    else {
        rueckgabe = 0;
    }

    rueckgabe = (100-rueckgabe)*0.01;
    return(rueckgabe);
}