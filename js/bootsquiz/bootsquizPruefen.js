/**
 * Created by yokoe on 17/1/2017.
 */


/**
 * Funktion, die die Quizeingabe auf Richtigkeit überprüft
 */
function korrektur()
{
    console.log('korrektur() geladen'); //kleine notiz

    if (quiznichtAusgefuehrt == false)         //preft, ob Korrektur schon ausgeführt wurde
    {
        document.getElementById('fehlerMeldung6').innerHTML = "Klicke \"neues Quiz erstellen\", um ein neues Quiz zu starten, oder klicke auf \"Quiz wiederholen\", wenn das Quiz bereits erstellt und korrigiert wurde. Viel Erfolg!";
    }
    try                             // Fehlerbehandlung, die mit catch aufgefangen wird
    {
        while (quiznichtAusgefuehrt) {
            document.getElementById("ErgebnisID").style.visibility = "visible";

            var richtig;                    //Speichert die Anzahl der nicht richtig beantworteten Fragen
            richtig = 0;

            quizFrageUserInput = document.querySelectorAll('.hierEntstehtQuiz div ul li input[type="radio"]');
            console.log(quizFrageUserInput);

            for (var j = 0; j < (quizAnzahlFragenUserInput * 4); j++)      //prueft jede Frage, in Abhaengigkeit von quizAnzahlFragenUserInput
            {
                if ((quizFrageUserInput[j].checked == true))           //prueft, ob gecheckt
                {
                    console.log("gechecked");
                    if ((j - (4 * (Math.floor(j / 4)))) != quizLoesung[Math.floor(j / 4)]) {
                        console.log("Antwort falsch");
                        quizFrageUserInput[j].setAttribute('disabled', 'disabled');     //falsche Antworten werden ausgeblendet und per css rot gefärbt

                    } else {
                        console.log("Antwort richtig");
                        richtig++;
                    }
                } else {
                    console.log("Antwort falsch");
                }
            }

            document.getElementById('versucheID').value = quizVersuche;
                document.getElementById('antwortRichtigID').value = richtig;
            document.getElementById('anzahlFalschID').value = quizAnzahlFragenUserInput - richtig;
            document.getElementById('prozentID').value = richtig / quizAnzahlFragenUserInput * 100 + "%";

            quiznichtAusgefuehrt = false;
            inObjektUmwandeln(benutzerNameInput.value, vornameInput.value, auswahlSchwierigkeit, quizAnzahlFragenUserInput, richtig);
        }
    }catch (error)
    {
        window.alert(error.message);
    }
}