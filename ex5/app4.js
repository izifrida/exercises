// Task 14 (usage of request package). Point 2

var request = require('request');

// Task 14 (Handling complex data in JSON format). Point 1
var express = require('express'),
    logger = require('morgan');
var app = express();

// API for fetching JSON data
const api = "https://swapi.co/api";

// Views in folder 
app.set('views', __dirname + '/views4');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

// A home page
app.get('/', function (req, res) {
    res.render('index')
});

// A page with films list
app.get('/films', function (req, res) {
    request(`${api}/films`, function (error, response, body) {
        if (error) {
            res.render('error', { error: error })
            return;
        }

        if (body) {
            const parsedBody = JSON.parse(body);

            if (!parsedBody.results) {
                res.render('error', { error: 'Not found' })
                return;
            }

            res.render('films', { films: parsedBody.results ? parsedBody.results : [] })
        }
    });
});

// A page with film details
app.get('/films/details', function (req, res) {
    if (!req.query.source) {
        res.render('error', { error: 'No source defined' })
        return;
    }

    request(req.query.source, function (error, response, body) {
        if (error) {
            res.render('error', { error: error })
            return;
        }

        if (body) {
            const parsedBody = JSON.parse(body);
            res.render('film', { film: parsedBody })
        }
    });
});

// A page with planets list
app.get('/planets', function (req, res) {
    page = req.query.page ? req.query.page : 1;

    request(`${api}/planets?page=${page}`, function (error, response, body) {
        if (error) {
            res.render('error', { error: error })
            return;
        }

        if (body) {
            const parsedBody = JSON.parse(body);

            if (!parsedBody.results) {
                res.render('error', { error: 'Not found' })
                return;
            }

            res.render('planets', {
                planets: parsedBody.results ? parsedBody.results : [],
                currentPage: +page,
                next: parsedBody.next,
                previous: parsedBody.previous
            })
        }
    });
});

// A page with planet details
app.get('/planets/details', function (req, res) {
    if (!req.query.source) {
        res.render('error', { error: 'No source defined' })
        return;
    }

    request(req.query.source, function (error, response, body) {
        if (error) {
            res.render('error', { error: error })
            return;
        }

        if (body) {
            const parsedBody = JSON.parse(body);
            res.render('planet', { planet: parsedBody })
        }
    });
});

app.listen(3000, function () {
    console.log('The application is available on port 3000');
});
