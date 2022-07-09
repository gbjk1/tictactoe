let current = 0,
    element,
    finished = false,
    gamestatus = ["-","-","-","-","-","-","-","-","-"];
const players = [ "x", "o" ],    
    field = document.createElement("table"),
    caption = document.createElement("caption"), 
    messages = {
        "o's-turn": "Dein Klon ist am Zug.",
        "x's-turn": "Du bist am Zug.",
        "o-wins": "Dein Klon gewinnt.",
        "x-wins": "Du gewinnst.",
        "draw": "Das Spiel endet unentschieden.",
        "instructions": "Zum Spielen bitte in die Spielfelder klicken/tappen!",
        "select": "wählen",
        "new game?": "Neues Spiel?"
    };
// click / tap verarbeiten
function mark (event) {
    // Tabellenzelle bestimmen
    let td = event.target;

    if(!finished && td.className === "" && current === 0){
        td.className = players[current];

        checkWinner();
        if (!finished) {

            current = 1; // api ist dran

            // Hinweis aktualisieren
            caption.innerHTML = messages[players[current] + "'s-turn"];

            let tds = field.getElementsByTagName("td");
            for(i = 0; i < tds.length; i++){
                if(tds[i].className !== ""){
                    gamestatus[i] = tds[i].className.toUpperCase();
                }
            }

            const url = (gamestatus) => {
                let request = "https://stujo-tic-tac-toe-stujo-v1.p.rapidapi.com/";
                for(let m = 0; m < gamestatus.length; m++){
                    request += gamestatus[m];
                }
                return request += "/O";
            }

            const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '7cc0b375ebmsh09ffbcb03092657p10d91djsn3c2ae37e1b28',
                'X-RapidAPI-Host': 'stujo-tic-tac-toe-stujo-v1.p.rapidapi.com'
            }
            };

            fetch(url(gamestatus), options)
                .then(res => res.json())
                .then(json => {
                    tds[json.recommendation].className = players[current];

                    checkWinner();
                    if (!finished) {

                        current = 0; // spieler ist dran

                        // Hinweis aktualisieren
                        caption.innerHTML = messages[players[current] + "'s-turn"];
                    }
                }
            );
        }
    }
}

// Gewinner?
function checkWinner () {
    let tds = field.getElementsByTagName("td"),
        full = true,
        winner;

    // alle Felder markiert?
    for (let i = 0; i < tds.length; i++) {
        if (tds[i].className === "") {
            full = false;
            break;
        }
    }
    // Gewinner ermitteln
    for (let i = 0; i < 3; i++) {
        // senkrecht
        if (tds[i].className !== "" && tds[i].className === tds[3 + i].className && tds[3 + i].className === tds[6 + i].className) {
            // we have a winner!
            winner = tds[i].className;
            highlightCells([
                tds[i], tds[3 + i], tds[6 + i]
            ]);
        }
        // waagrecht
        if (tds[i*3 + 0].className !== "" && tds[i*3 + 0].className === tds[i*3 + 1].className && tds[i*3 + 1].className === tds[i*3 + 2].className) {
            // we have a winner!
            winner = tds[i*3].className;
            highlightCells([
                tds[i*3], tds[i*3 + 1], tds[i*3 + 2]
            ]);
        }
    }
    // diagonal links oben nach rechts unten
    if (tds[0].className !== "" && tds[0].className === tds[4].className && tds[4].className === tds[8].className) {
        winner = tds[0].className;

        highlightCells([
            tds[0], tds[4], tds[8]
        ]);
    }

    // diagonal rechts oben nach links unten
    if (tds[2].className !== "" && tds[2].className === tds[4].className && tds[4].className === tds[6].className) {
        winner = tds[2].className;

        highlightCells([
            tds[2], tds[4], tds[6]
        ]);
    }

    // game over?
    if (full || winner) {
        finished = true;
        field.className = "game-over";
        if (winner) {
            caption.innerHTML = messages[players[current] + "-wins"];
        } else {
            caption.innerHTML = messages["draw"];
        }
        // restliche Interaktion entfernen
        for(let j = 0; j < tds.length; j++) {
            tds[j].removeEventListener("click", mark);
        }
        // new game?
        let button = document.createElement("button");
        button.innerHTML = messages["new game?"];

        caption.appendChild(document.createTextNode(" "));
        caption.appendChild(button);

        button.addEventListener("click", function (event) {
            let cells = field.getElementsByTagName("td"),
            cell;

            // reset game
            current = 0;
            finished = false;
            gamestatus = ["-","-","-","-","-","-","-","-","-"];
            field.removeAttribute("class");

            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    // reset cell
                    cell = cells[r * 3 + c];
                    cell.removeAttribute("class");

                    // re-add listener
                    cell.addEventListener("click", mark);

                }
            }

            // Hinweis einrichten
            caption.innerHTML = messages[players[current] + "'s-turn"];
        });
    }
    function highlightCells (cells) {
        let el = document.createElement("strong");
        cells.forEach((cell) => {
            cell.appendChild(el);
            cell.classList.add("highlighted");
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Spielanleitung ins Dokument einfügen
    element = document.querySelector(".tic-tac-toe");
    let paragraph = document.createElement("p");
    paragraph.innerHTML = messages["instructions"];
    element.appendChild(paragraph);

    // Tabelle ins Dokument einfügen
    element.appendChild(field);

    // Tabelle aufbauen
    field.appendChild(caption); // Beschriftung
    let tbody = document.createElement("tbody");
    field.appendChild(tbody);

    // Hinweis einrichten
    caption.innerHTML = messages[players[current] + "'s-turn"];
    
    let i = 0;
    for (let r = 0; r < 3; r++) {
        // neue Tabellenzeile
        let tr = document.createElement("tr");
        tbody.appendChild(tr);

        for (let c = 0; c < 3; c++) {
            let td = document.createElement("td");
            // neue Tabellenzelle
            td.id = i;
            i++;
            td.addEventListener("click", mark);
            tr.appendChild(td);
        }
    }

    setDefaultTheme();

    fetch("http://127.0.0.1:3000/api/updateStats", {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            }
        })
});

function setDefaultTheme(){
    let current = new Date();
    let currentYear = current.getFullYear();
    let currentMonth = current.getMonth();
    let currentDay = current.getDate();
    let currentHour = new Date().getHours();
    let currentMinute = new Date().getMinutes();

    fetch("https://api.sunrise-sunset.org/json?lat=48.1454&lng=16.2142")
        .then(response => response.json())
        .then(data => {
            let sunriseHour = parseInt(data.results.sunrise.split(":")[0]);
            let sunriseMinute = parseInt(data.results.sunrise.split(":")[1]);
            let sunsetHour = parseInt(data.results.sunset.split(":")[0])+12;
            let sunsetMinute = parseInt(data.results.sunset.split(":")[1]);
            let sunriseTime = new Date(currentYear, currentMonth, currentDay, sunriseHour, sunriseMinute);
            let sunsetTime = new Date(currentYear, currentMonth, currentDay, sunsetHour, sunsetMinute);
            if(sunriseTime < current && current < sunsetTime){
                console.log("day");
                document.getElementById('main').style.background="linear-gradient(to left bottom, rgb(147, 209, 128), rgb(96, 116, 231))";
            }else{
                console.log("night");
                document.getElementById('main').style.background="linear-gradient(to left bottom, rgb(22, 20, 31), rgb(24, 57, 70))";
            }
        })
}

function swapTheme () {
	if(document.getElementById('main').style.background!=="linear-gradient(to left bottom, rgb(22, 20, 31), rgb(24, 57, 70))")
    document.getElementById('main').style.background="linear-gradient(to left bottom, rgb(22, 20, 31), rgb(24, 57, 70))";

    else {
        document.getElementById('main').style.background="linear-gradient(to left bottom, rgb(147, 209, 128), rgb(96, 116, 231))";
    }
}

function recaptchaCallback() {
    document.getElementById('joinBtn').removeAttribute('disabled');
	document.getElementById('createBtn').removeAttribute('disabled');
};