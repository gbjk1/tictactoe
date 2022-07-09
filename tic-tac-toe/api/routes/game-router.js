const { Router } = require('express');
const controller = require('../controllers/game-controller');

const routes = Router();

const session = require('express-session');
routes.use(session({secret: 'topsecret', resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));


routes.post('/create', controller.createGame);

routes.post('/join', controller.joinGame);

routes.get('/game', controller.getGame);

routes.put('/game/:field', controller.updateGame);

routes.get('/game/getturn', controller.getTurn);

routes.get('/game/winner', controller.getWinner);

routes.delete('/game/:id', controller.deleteGame);

routes.get('/game/new', controller.newGame);

routes.get('/session', controller.getSession);

routes.get('/stats', controller.getStats);

routes.patch('/updateStats', controller.updateStats);



module.exports = routes;