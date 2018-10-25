// Imports
var express    = require('express');
var bodyParser = require('body-parser');
var apiRouter  = require('./apiRouter').router;

// Constants
const SERVER_PORT = 5000;

// Instantiate the server
var server = express();

// Body parser configuration
server.use(bodyParser.urlencoded({extended: true }));
server.use(bodyParser.json());

// Configure routes
server.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send(200, '<h1>Tout va bien</h1>');
});

server.use('/api/', apiRouter);

// Launch server
server.listen(SERVER_PORT, function() {
    console.log("Server running on port 5000 ...");
});