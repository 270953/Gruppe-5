/**
 * Created by yokoe on 17/1/2017.
 */


/**
 * Funktion, die die Quizeingabe auf Richtigkeit überprüft
 */
function korrektur()
{
    console.log('korrektur() geladen'); //kleine notiz

    if (nichtAusgefuehrt == false)         //preft, ob Korrektur schon ausgeführt wurde
    {
        document.getElementById('fehlerMeldung6').innerHTML = "Klicke \"neues Quiz erstellen\", um ein neues Quiz zu starten, oder klicke auf \"Quiz wiederholen\", wenn das Quiz bereits erstellt und korrigiert wurde. Viel Erfolg!";
    }
    try                             // Fehlerbehandlung, die mit catch aufgefangen wird
    {
        while (nichtAusgefuehrt) {
            document.getElementById("ErgebnisID").style.visibility = "visible";

            var richtig;                    //Speichert die Anzahl der nicht richtig beantworteten Fragen
            richtig = 0;

            FrageUserInput = document.querySelectorAll('.hierEntstehtQuiz div ul li input[type="radio"]');
            console.log(FrageUserInput);

            for (var j = 0; j < (AnzahlFragenUserInput * 4); j++)      //prueft jede Frage, in Abhaengigkeit von AnzahlFragenUserInput
            {
                if ((FrageUserInput[j].checked == true))           //prueft, ob gecheckt
                {
                    console.log("gechecked");
                    if ((j - (4 * (Math.floor(j / 4)))) != loesung[Math.floor(j / 4)]) {
                        console.log("Antwort falsch");
                        FrageUserInput[j].setAttribute('disabled', 'disabled');     //falsche Antworten werden ausgeblendet und per css rot gefärbt

                    } else {
                        console.log("Antwort richtig");
                        richtig++;
                        FrageUserInput[j].setAttribute('value', 'green');
                    }
                } else {
                    console.log("nicht gechecked");
                    console.log("nicht gechecked");
                }
            }

            document.getElementById('versucheID').value = versuche;
                document.getElementById('antwortRichtigID').value = richtig;
            document.getElementById('anzahlFalschID').value = AnzahlFragenUserInput - richtig;
            document.getElementById('prozentID').value = richtig / AnzahlFragenUserInput * 100 + "%";

            nichtAusgefuehrt = false;
            inObjektUmwandeln(benutzerNameInput.value, vornameInput.value, auswahlSchwierigkeit, fragenWaehler.value, richtig);
        }
    }catch (error)
    {
        window.alert(error.message);
    }

}