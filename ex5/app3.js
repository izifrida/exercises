// Task 14 (Handling complex data in JSON format). Point 1
var express = require('express'),
    logger = require('morgan');
var app = express();

var multer = require('multer'); // For handling multipart/form-data
var upload = multer();

// Function that reads file and returns response with the result of calculations
function readJSON(file, response) {
    if (file.mimetype !== 'application/json') {
        response.render('error', { error: 'Wrong file format' })
        return;
    }

    let dataObj = JSON.parse(file.buffer.toString());

    // Check if dataObj contains operations
    if (!dataObj.operations || !dataObj.operations.length) {
        response.render('error', { error: 'Wrong data structure' })
        return;
    }

    let result = 0;

    for (operation of dataObj.operations) {
        // Check if operation contains all required field
        if (!operation.name || !operation.arg1 || !operation.arg2) {
            response.render('error', { error: 'Wrong data structure' })
            return;
        }

        // Check if agr1 is valid
        if (operation.arg1 !== 'result' && isNaN(operation.arg1)) {
            response.render('error', { error: 'Wrong data structure' })
            return;
        }

        // Check if agr2 is valid
        if (operation.arg2 !== 'result' && isNaN(operation.arg2)) {
            response.render('error', { error: 'Wrong data structure' })
            return;
        }

        let arg1 = operation.arg1 === 'result' ? result : operation.arg1;
        let arg2 = operation.arg2 === 'result' ? result : operation.arg2;

        switch (operation.name) {
            case 'add':
                result = arg1 + arg2;
                break;
            case 'subtract':
                result = arg1 - arg2;
                break;
            case 'multiply':
                result = arg1 * arg2;
                break;
            case 'divide':
                result = arg1 / arg2;
                break;
            default:
                response.render('error', { error: 'Wrong data structure' })
                return;
        }
    }

    response.render('result', { result: result })
    return;
}

// Views in folder 
app.set('views', __dirname + '/views3');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

// A page with form to input file name
app.get('/', function (req, res) {
    res.render('index', { directory: __dirname })
});

// A page with result of
app.post('/calculate', upload.any(), function (req, res) {
    readJSON(req.files[0], res);
})

app.listen(3000, function () {
    console.log('The application is available on port 3000');
});
