class Game {
    constructor(player1, player2, twoPlayers, gameId, currentTurn, gameboard){
        this.player1 = player1;
        this.player2 = player2;
        this.twoPlayers = twoPlayers;
        this.gameId = gameId;
        this.winner = "null";
        this.currentTurn = currentTurn;
        this.gameboard = gameboard;
    }
}

class GameModel {

    constructor() {
        this.games = new Map();
    }

    createGame = (gameId, name) => {
        if(this.games.get(gameId)){
            throw new Error(`Game with ${gameId} already exists!`);
        }

        let initGameboard = {11: 0, 12: 0, 13: 0, 21: 0, 22: 0, 23: 0, 31: 0, 32: 0, 33: 0};
        let game = new Game(name, "Waiting", false, gameId, 0, initGameboard);
        this.games.set(gameId, game);
    }

    joinGame = (gameId, name) => {
        const game = this.getGame(gameId);

        if(game && !game.twoPlayers){
            game.player2 = name;
            game.twoPlayers = true;
            game.currentTurn = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        }else{
            throw new Error(`Game with ${gameId} does not exists!`);
        }
    }

    getGame = (gameId) => {
        let game = null;

        if (this.games.get(gameId)) {
            game = this.games.get(gameId);
        }

        return game;
    }

    updateGame = (gameId, player, field) => {
        let updated = false;
        const game = this.getGame(gameId);
        if(game){
            game.gameboard[field] = player; //Wer hat Feld geklickt
            game.currentTurn === 1 ? game.currentTurn = 2 : game.currentTurn = 1;
            updated = true;
        }
        return updated;
    }

    getGameTurn = (gameId) => {
        let turn = 0;
        const game = this.getGame(gameId);
        if(game){
            turn = game.currentTurn;
        }
        return turn;
    }

    makeNewGame = (gameId) => {
        const game = this.getGame(gameId);
        game.winner = "null";
        game.gameboard = {11: 0, 12: 0, 13: 0, 21: 0, 22: 0, 23: 0, 31: 0, 32: 0, 33: 0};
        game.currentTurn = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        return game;
    }

    getWinner = (gameId) => {
        const game = this.getGame(gameId);
        const gameBoard = game.gameboard;
		let full = true;
		let winner = "null";
        let winnerFields = [];
        winnerFields[0] = -1;
        winnerFields[1] = -1;
        winnerFields[2] = -1;
        let array = ['11', '12', '13', '21', '22', '23', '31', '32', '33'];

		// alle Felder markiert?
		for (let i = 0; i <= array.length; i++) {
			if (gameBoard[array[i]] === 0) {
				full = false;
				break;
			}
		}
		
		// Gewinner ermitteln
		for (let i = 0; i < 3; i++) {
			// senkrecht
			if (gameBoard[array[i]] !== 0 && gameBoard[array[i]] === gameBoard[array[3 + i]] && gameBoard[array[3 + i]] === gameBoard[array[6 + i]]) {
				// we have a winner!
				winner = gameBoard[array[i]];
                winnerFields[0] = i;
                winnerFields[1] = i + 3;
                winnerFields[2] = i + 6;
			}
			// waagrecht
			if (gameBoard[array[i*3]] !== 0 && gameBoard[array[i*3]] === gameBoard[array[i*3 + 1]] && gameBoard[array[i*3 + 1]] == gameBoard[array[i*3 + 2]]) {
				// we have a winner!
				winner = gameBoard[array[i*3]];
                winnerFields[0] = 3 * i;
                winnerFields[1] = 3 * i + 1;
                winnerFields[2] = 3 * i + 2;
			}
		}
		// diagonal links oben nach rechts unten
		if (gameBoard[array[0]] !== 0 && gameBoard[array[0]] === gameBoard[array[4]] && gameBoard[array[4]] === gameBoard[array[8]]) {
			winner = gameBoard[array[0]];
            winnerFields[0] = 0;
            winnerFields[1] = 4;
            winnerFields[2] = 8;
		}

		// diagonal rechts oben nach links unten
		if (gameBoard[array[2]] !== 0 && gameBoard[array[2]] == gameBoard[array[4]] && gameBoard[array[4]] === gameBoard[array[6]]) {
			winner = gameBoard[array[2]];
            winnerFields[0] = 2;
            winnerFields[1] = 4;
            winnerFields[2] = 6;
		}

        if(full && winner === "null"){
            game.winner = "-";
        }
        else if(winner !== "null"){
            game.winner = winner;
        }
        return [game.winner, winnerFields];
    }
    
    deleteGame = (gameId) => {
        let deleted = false;
        const toDelete = this.getGame(gameId);
        if(toDelete){
            deleted = this.games.delete(gameId);
        }
        return deleted;
    }
}

module.exports = new GameModel();