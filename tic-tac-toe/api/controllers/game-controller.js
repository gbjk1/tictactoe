const model = require('../models/game-model');
const fs = require("fs");

// Set session management options
const express = require('express');
const session = require('express-session');
const app = express();
app.use(session({secret: 'topsecret', resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));

class GameController {
    createGame = (req, res) => {
        try{
            const gameId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            const username = req.body.nameCreate;
            
            if(username !== "" && model.getGame(gameId) == null){
                req.session.name = username;
                req.session.gameId = gameId;
                req.session.player = 1;
                model.createGame(gameId, username)
                res.status(201).redirect('http://127.0.0.1:3000/multiplayer.html');
            }else{
                throw new Error(`Game could not be created.`);
            }
        }catch(e){
            res.status(500).send(e.message);
        }
    }

    joinGame = (req, res) => {
        try{
            const gameId = parseInt(req.body.gamePIN, 10);

            if(model.getGame(gameId)){
                const username = req.body.nameJoin; 
                req.session.name = username;
                req.session.gameId = gameId;
                req.session.player = 2;
                model.joinGame(gameId, username);
                res.status(200).redirect('http://127.0.0.1:3000/multiplayer.html');
            }else{
                throw new Error(`Game with id ${gameId} could not be joined.`);
            }
        }catch(e){
            res.status(404).send(e.message);
        }
    }

    getGame = (req, res) => {
        try{
            const gameId = req.session.gameId;
            const game = model.getGame(gameId);

            if(game){
                res.status(200).send(game);
            }else{
                throw new Error(`Game with ${gameId} does not exists!`);
            }
        }catch(e){
            res.status(404).send(e.message);
        }
        
    }

    updateGame = (req, res) => {
        try{
            const gameId = req.session.gameId;

            if(model.getGame(gameId)){
                const player = req.session.player;
                const field = parseInt(req.params.field, 10);
                model.updateGame(gameId, player, field);
                //res.sendStatus(200);
                //if(req.session.)
                res.sendStatus(204);
            }else{
                throw new Error(`Game with ${gameId} does not exists!`);
            }
        }catch(e){
            res.status(404).send(e.message);
        }
        
    }

    getTurn = (req, res) => {
        try{
            const gameId = req.session.gameId;
            if(model.getGame(gameId)){
                const turn = model.getGameTurn(gameId);
                let toSend = {"turn":turn};
                
                res.status(200).send(toSend);
                
            } else {
                throw new Error('getTurn does not work');
            }
        }catch(e){
            res.status(404).send(e.message);
        }
    }

    getWinner = (req, res) => {
        try{
            const gameId = req.session.gameId;
            if(model.getGame(gameId)){
                const [winner, winnerFields] = model.getWinner(gameId);
                res.status(200).send({
                    "winner":winner, 
                    "fields": {
                        "f0":winnerFields[0],
                        "f1":winnerFields[1], 
                        "f2":winnerFields[2], 
                    }});
            } else {
                throw new Error('winner does not work');
            }
        }catch(e){
            res.status(404).send(e.message);
        }
    }
    
    deleteGame = (req, res) => {
        try{
            const gameId = parseInt(req.params.id, 10);
            
            if(model.getGame(gameId)){
                model.deleteGame(gameId);
                res.sendStatus(204);
            }else{
                throw new Error(`Game with ${gameId} does not exist.`);
            }
        }catch(e){
            res.status(404).send(e.message);
        }
    }

    newGame = (req, res) => {
        try{
            const gameId = req.session.gameId;
            if(model.getGame(gameId)){
                const game = model.makeNewGame(gameId);
                res.status(200).send({"gameObject":game});
            } else {
                throw new Error('newGame does not work');
            }
        }catch(e){
            res.status(404).send(e.message);
        }
    }

    getSession = (req, res) => {
        try{
            res.status(200).send(req.session);
        }catch(e){
            res.status(500).send(`Could not get session.`);
        }
    }

    getGameid = (req, res) => {
        const gameId = req.params.id;
        const game = model.getGame(gameId);

        if(game){
            res.status(200).send(game);
        }else{
            throw new Error(`Game with ${gameId} does not exists!`);
        }
    }

    getStats = (req, res) => {

        const filedata = fs.readFileSync('./files/quickData.json', "utf-8");
        //const jsonData = JSON.parse(filedata);

        res.send(filedata);
    }

    updateStats = (req, res) => {

        console.log("Hi");

        const filedata = fs.readFileSync('./files/quickData.json', "utf-8");
        const jsonData = JSON.parse(filedata);

        console.log(jsonData.data.datasets[0].data[0]);

        const d = new Date();
        let month = d.getMonth();
        console.log(month);

        jsonData.data.datasets[0].data[month-5] += 1;


        fs.writeFile("./files/quickData.json", JSON.stringify(jsonData), (err) => {console.log(err)});

        res.send(JSON.stringify(jsonData));


    }

    
}

module.exports = new GameController();