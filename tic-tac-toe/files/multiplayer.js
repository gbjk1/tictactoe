class Player {
	constructor(playerNum, playerName, gameId){
		this.playerNum = playerNum;
        this.playerName = playerName;
        this.gameId = gameId;
		playerNum === 1 ? this.symbol = "x" : this.symbol = "o";
    }
}

class TicTacToe {

	constructor(gameId, thisPlayer, opponent, twoPlayers, currentTurn, gameboard){
		this.gameId = gameId;
		this.thisPlayer = thisPlayer;
		this.opponent = opponent;
		this.twoPlayers = twoPlayers;
		this.currentTurn = currentTurn;
		this.gameboard = gameboard;
		//this.finished = false;
		this.winner = "null";
		this.messages;
		if(this.thisPlayer.playerNum === 1){
			this.messages = {
				"1-turn": "Spieler " + this.thisPlayer.playerName + " ist am Zug",
				"2-turn": "Spieler " + this.opponent.playerName + " ist am Zug",
				"1-wins": "Spieler " + this.thisPlayer.playerName + " gewinnt!",
				"2-wins": "Spieler " + this.opponent.playerName + " gewinnt!",
				"draw": "Das Spiel endet unentschieden!",
				"instructions": "Zum Spielen in die Spielfelder klicken/tappen!",
				"new game?": "Neues Spiel?"
			}
		}else{
			this.messages = {
				"1-turn": "Spieler " + this.opponent.playerName + " ist am Zug",
				"2-turn": "Spieler " + this.thisPlayer.playerName + " ist am Zug",
				"1-wins": "Spieler " + this.opponent.playerName + " gewinnt!",
				"2-wins": "Spieler " + this.thisPlayer.playerName + " gewinnt!",
				"draw": "Das Spiel endet unentschieden!",
				"instructions": "Zum Spielen in die Spielfelder klicken/tappen!",
				"new game?": "Neues Spiel?"
			}
		}
	}

	generateGameboard = (element) => {
		let field = document.createElement("table");
		let caption = document.createElement("caption");
		let cellIds = [
			[11, 12, 13],
			[21, 22, 23],
			[31, 32, 33]
		];
		let paragraph, button, column, row, tr, td;

		// Spielanleitung ins Dokument einfügen
		paragraph = document.createElement("p");
		paragraph.innerHTML = this.messages["instructions"];
		element.appendChild(paragraph);

		// Tabelle ins Dokument einfügen
		element.appendChild(field);

		// Tabelle aufbauen
		field.id = "gameField";
		field.appendChild(caption); // Beschriftung
		field.appendChild(document.createElement("tbody"));

		// Hinweis einrichten
		caption.id = "text";

		caption.innerHTML = this.messages[this.currentTurn + "-turn"];

		for (row = 0; row < 3; row++) {
			// neue Tabellenzeile
			tr = document.createElement("tr");

			field.lastChild.appendChild(tr);

			for (column = 0; column < 3; column++) {
				// neue Tabellenzelle
				td = document.createElement("td");
				td.id = cellIds[row][column];
				tr.appendChild(td);

				// Klickbutton
				button = document.createElement("button");

				tr.lastChild.appendChild(button);
			}
		}
		// Ereignis bei Tabelle überwachen
		field.addEventListener("click", this.buttonHandler);
	}

	deleteGameboard = (element) => {
		while (element.firstChild) {
			element.removeChild(element.lastChild);
		  }
	}

	updateGameboard = () => {
		let field = document.getElementById("gameField"), 
		tds = field.getElementsByTagName("td"),
		i = 0;
		try{
			for (const key in this.gameboard) {
				if(tds[i].className === "" && this.gameboard[key] === this.opponent.playerNum) {
					tds[i].className = this.opponent.symbol;
					tds[i].innerHTML = this.opponent.symbol;
				}
				i++;
			}
		}catch(e){
			console.log(e.message);
		}

	}

	
	
	requestNewGame = () => {
		fetch('http://127.0.0.1:3000/api/game/new')
			.then(response => response.json())
			.then(data => {
				console.log(data);
				if(data.gameObject.gameId === this.gameId){
					this.currentTurn = data.gameObject.currentTurn;
					this.gameboard = data.gameObject.gameboard;
					this.winner = data.gameObject.winner;
					console.log(this);
					this.deleteGameboard(document.querySelector(".tic-tac-toe"));
					this.generateGameboard(document.querySelector(".tic-tac-toe"));
				}else{
					alert("couldn't start new game...");
				}
			})
	}

	newGameButton = () => {
		let caption = document.getElementById("text");

		let button = document.createElement("button");
		button.textContent = "New Game?";
		button.id = "newgame";
		button.addEventListener("click", this.requestNewGame);

		caption.appendChild(button);
	}

	currentPlayer = () => {
		let turn = 0;
		fetch("http://127.0.0.1:3000/api/game/getturn")
		.then(response => response.json())
		.then(data => {
			turn = parseInt(data.turn, 10);
			this.currentTurn = turn;
			if(this.winner === "null"){
				if(turn === tictactoe.thisPlayer.playerNum){
					document.getElementById("text").innerHTML = "Player " + tictactoe.thisPlayer.playerName;
				}else{
					document.getElementById("text").innerHTML = "Player " + tictactoe.opponent.playerName;
				}
			}else{
				document.getElementById("text").innerHTML = "Player " + tictactoe.winner.playerName + "-wins";
				this.newGameButton();
			}

		});
		return turn;
	}

	checkWinner = () => {
		fetch("http://127.0.0.1:3000/api/game/winner")
			.then(response => response.json())
			.then(data => {
				if(data.winner === "-"){
					this.winner = new Player(3, "DRAW", this.gameId);
				}
				else if(data.winner !== "null"){
					console.log(data.winner);
					if(data.winner === this.thisPlayer.playerNum){
						this.winner = this.thisPlayer;
					}
					else{
						this.winner = this.opponent;
					}
					highlightCells(data.fields);
				}
			})
		function highlightCells (fields) {
			let tttfield = document.getElementById("gameField");
			let tds = tttfield.getElementsByTagName("td");
			let cells = [];
			for(let i = 0; i < tds.length; i++){
				if(i === fields.f0 || i === fields.f1 || i === fields.f2){
					cells.push(tds[i]);
				}
			}
			cells.forEach(function (node) {
				let el = document.createElement("strong");
				el.innerHTML = node.innerHTML;

				node.innerHTML = "";
				node.appendChild(el);
				node.classList.add("highlighted");
			});
		}
	}

	buttonHandler = (event) => {
		let field = document.getElementById("gameField");

		if(this.thisPlayer.playerNum === this.currentTurn){
			// Tabellenzelle bestimmen
			let td = event.target;

			// Button oder Zelle?
			while (td.tagName.toLowerCase() != "td" && td != field) {
				td = td.parentNode;
			}

			// Zelle bei Bedarf markieren
			if (td.tagName.toLowerCase() === "td" && td.className.length < 1) {
				td.className = this.thisPlayer.symbol; // Klassennamen vergeben
				td.innerHTML = this.thisPlayer.symbol;
			}

			fetch("http://127.0.0.1:3000/api/game/" + td.id, {
				method: 'PUT'
			});
			/*headers: {
				'Content-Type': 'application/json'
			}*/

			this.gameboard[td.id] = this.thisPlayer.playerNum;
			this.checkWinner(); // Spiel zuende?
		}
		
	}
}

// Polling function
const poll = ({ fn, validate, interval}) => {
  
	const executePoll = async (resolve) => {
	  const result = await fn();
  
	  if (validate(result)) {
		return resolve(result);
	  } else {
		setTimeout(executePoll, interval, resolve);
	  }
	};
	return new Promise(executePoll);
};

const getGameboard = async () => {
	const result = await fetch("http://127.0.0.1:3000/api/game");
	return await result.json();
};

function validateOpponent (change) {
	return change.twoPlayers;
}

function setTicTacToe(game, thisPlayer){
	if(thisPlayer.playerNum === 1){
		tictactoe = new TicTacToe(game.gameId, thisPlayer, new Player(2, game.player2, game.gameId), game.twoPlayers, game.currentTurn, game.gameboard);
	} else {
		tictactoe = new TicTacToe(game.gameId, thisPlayer, new Player(1, game.player1, game.gameId), game.twoPlayers, game.currentTurn, game.gameboard);
	}
	console.log(tictactoe);
	console.log(thisPlayer);
}

function validateGameboard (change) {
	
	for (const key in change.gameboard) {
		if(change.gameboard[key] !== tictactoe.gameboard[key])
		{
			return true;
		}
	}
	return false;
}

const POLL_INTERVAL = 500;
let thisPlayer, opponent;
let tictactoe;

initConnection = () => {
	fetch("http://127.0.0.1:3000/api/game")
		.then(response => response.json())
		.then(initGame => {
			document.getElementById("p1").innerHTML = "Player1: " + initGame.player1;
			document.getElementById("p2").innerHTML = "Player2: " + initGame.player2;
			document.getElementById("pin").innerHTML = "GameID: " + initGame.gameId;

			let thisPlayer;
			fetch("http://127.0.0.1:3000/api/session")
				.then(response => response.json())
				.then(sessionData => {
					thisPlayer = new Player(sessionData.player, sessionData.name, sessionData.gameId);
				});
			
			const pollForOpponent = poll({
				fn: getGameboard,
				validate: validateOpponent,
				interval: POLL_INTERVAL,
				})
				.then(game => {
					document.getElementById("p1").innerHTML = "Player1: " + game.player1;
					document.getElementById("p2").innerHTML = "Player2: " + game.player2;
					setTicTacToe(game, thisPlayer);
					tictactoe.generateGameboard(document.querySelector(".tic-tac-toe"));

					window.setInterval( () => {
						let turn = tictactoe.currentPlayer();
						if (turn !== tictactoe.thisPlayer.playerNum) {
							const pollForMove = poll({
								fn: getGameboard,
								validate: validateGameboard,
								interval: POLL_INTERVAL,
								})
								.then(game => {
									tictactoe.gameboard = game.gameboard;
									
									tictactoe.updateGameboard();
									tictactoe.checkWinner(); // Spiel zuende?
								});
						}
					  },POLL_INTERVAL);
				});
		});
}

document.addEventListener("DOMContentLoaded", function () {
	setDefaultTheme();
	initConnection();
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

function toIndex(){
	window.location.href = "index.html";
}

window.addEventListener("beforeunload", function(){
	fetch("http://127.0.0.1:3000/api/game/"+tictactoe.gameId);
})