// No use of any template system
var express = require('express'),
    logger = require('morgan');
var app = express();
var x = 1;
var y = 2;

// Determining the contents of the middleware stack
app.use(logger('dev'));                         // Place an HTTP request recorder on the stack - each request will be logged in the console in 'dev' format
app.use(express.static(__dirname + '/public')); // Place the built-in middleware 'express.static' - static content (files .css, .js, .jpg, etc.) will be provided from the 'public' directory

// Route definitions
app.get('/', function (req, res) {     // The first route
    // Exercise 12 point 15 (calculate and then print, the value x + y ).
    res.send(`<h1>${x} + ${y} = ${x + y}</h1>`);

    //res.send('<h1>Hello World!</h1>'); // Send a response to the browser
})

// Exercise 13 point 4 (new route app.get('/add/:x/:y')).
app.get('/add/:x/:y', function (req, res) {
    const x = +req.params.x;
    const y = +req.params.y;
    res.send(`<h1>${x} + ${y} = ${x + y}</h1>`);
})

// The application is to listen on port number 3000
app.listen(3000, function () {
    console.log('The application is available on port 3000');
});