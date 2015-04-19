// Load the http module to create an http server.
var http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
response.writeHead(200, {"Content-Type": "text/plain"});
response.end("Hello World\n");
});

// Listen on port 4444, IP defaults to 127.0.0.1
server.listen(4444);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:4444/");

//Code needed for Express
var express = require('express'),
coffees = require('./routes/coffees');
 
var app = express();
 
app.configure(function () {
app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
app.use(express.bodyParser());
});


// Establishes route to coffee.js
app.get('/coffees', coffees.findAll);
app.get('/coffees/:id', coffees.findById);
app.post('/coffees', coffees.addCoffee);
app.put('/coffees/:id', coffees.updateCoffee);
app.delete('/coffees/:id', coffees.deleteCoffee);
app.listen(8080);
console.log('Listening on port 8080...');



