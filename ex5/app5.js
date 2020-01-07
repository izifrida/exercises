// Task 14 (MongoDB). Point 3
var express = require('express'),
    logger = require('morgan');
var app = express();

// To parse request body
var bodyParser = require('body-parser')

// Views in folder 
app.set('views', __dirname + '/views5');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Connection to DB 
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

// Connection URL
// Note: Make sure your MongoDB server (mongod.exe) is running.
const url = 'mongodb://localhost:27017';

const dbName = 'books';
const collectionName = 'books';

// Create a new MongoClient
const client = new MongoClient(url);

// App Routes
// A home page
app.get('/', function (req, res) {
    res.render('index')
});

// Add new book
app.post('/books', function (req, res) {
    const db = client.db(dbName);

    const newBook = req.body;

    db.collection(collectionName)
        .insertOne(newBook, function (err, result) {
            if (err) {
                res.render('error', { error: err });
                return;
            };

            console.log("1 document inserted");
            // Redirect to books
            res.redirect('/books')
        });
});

// Get all books
app.get('/books', function (req, res) {
    const db = client.db(dbName);

    db.collection(collectionName)
        .find({})
        .toArray(function (err, result) {
            if (err) {
                res.render('error', { error: err });
                return;
            };

            res.render('books', { books: result })
        });;
});

// Get book by ID
app.get('/books/:id', function (req, res) {
    const db = client.db(dbName);

    db.collection(collectionName)
        .findOne(ObjectId(req.params.id), function (err, result) {
            if (err) {
                res.render('error', { error: err });
                return;
            };

            res.render('book', { book: result })
        })
});

// Update book by id
app.post('/books/:id', function (req, res) {
    const db = client.db(dbName);

    const updatedBook = req.body;

    db.collection(collectionName)
        .update({ '_id': ObjectId(req.params.id) }, { $set: updatedBook }, function (err, result) {
            if (err) {
                res.render('error', { error: err });
                return;
            };

            console.log("1 document updated");
            // Redirect to books
            res.redirect('/books')
        })
});


// Delete book by id
app.get('/books/delete/:id', function (req, res) {
    const db = client.db(dbName);

    db.collection(collectionName)
        .deleteOne({ '_id': ObjectId(req.params.id) }, function (err, result) {
            if (err) {
                res.render('error', { error: err })
                return;
            };

            console.log("1 document deleted");
            // Redirect to books
            res.redirect('/books')
        })
});

// Use connect method to connect to the Data Base Server
client.connect(function (err) {
    console.log("Connected successfully to server");

    app.listen(3000, function () {
        console.log('The application is available on port 3000');
    });
});
