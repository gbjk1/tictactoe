const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const gameRouter = require('./api/routes/game-router');

const app = express();
const port = 3000;

// Serving static files from folder 'files'
app.use(express.static(path.join(__dirname, 'files')));

// Parse urlencoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true })); 

// Parse JSON bodies (from requests)
app.use(bodyParser.json());

// Include the game routes
app.use('/api', gameRouter);

// Set session management options
app.use(session({secret: 'topsecret', resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));

app.listen(port, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server listening at http://127.0.0.1:${port}`)
    }
});

app.get('/', (req, res) => {res.redirect('./files/index.html')});
