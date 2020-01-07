// Run app.js from current folder
const http = require("http");
const url = require("url");

// models
const models = require("./models");

// Book Module
const bookModule = require('./books-module');
//Sync Database

// sequelize.sync()  will automatically sync all models.
models.sequelize
    .sync()
    .then(function () {
        console.log('Connection has been established successfully.')
    })
    .catch(function (err) {
        console.error('Unable to connect to the database:', err);
    });

this.server = http.createServer(function (request, response) {
    console.log("--------------------------------------")
    console.log("The relative URL of the current request: " + request.url + "\n")
    var url_parts = url.parse(request.url, true); //parsing (relative) URL

    switch (url_parts.pathname) {
        // Based on the data contained in the form field, processes the contents of a file or directory
        case '/books':
            if (url_parts.query['id']) {
                bookModule.getBook(url_parts.query['id'], response);
            } else {
                bookModule.getAllBooks(response);
            }
            break;

        case '/books/create':
            bookModule.createBook(request, response);
            break;

        case '/books/delete':
            bookModule.deleteBook(url_parts.query['id'], response);
            break;

        case '/books/edit':
            bookModule.updateBook(url_parts.query['id'], request, response);
            break;

        default:
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.write(`
                <h2>Connected to Database</h2>
                <a href="books">Books List</a>
            `)
            response.end();
            break;
    }
})


module.exports.app = this.server;

// We have separated 
module.exports.listen = function () {
    this.server.listen.apply(this.server, arguments);
    console.log("The server was started on port " + arguments[0]);
    console.log("To end the server, press 'CTRL + C'");
};

module.exports.close = function (callback) {
    this.server.close(callback);
};