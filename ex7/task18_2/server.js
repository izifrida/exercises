var http = require("http");
var url = require("url");
var fs = require("fs");
var file = 'index.html';

http.createServer(function (request, response) {
    console.log("--------------------------------------");
    console.log("The relative URL of the current request: " + request.url + "\n");
    var url_parts = url.parse(request.url, true);  // parsing (relative) URL

    switch (url_parts.pathname) {
        case '/':
            fs.stat(file, function (err, stats) {
                if (err == null) {
                    fs.readFile(file, function (err, data) {
                        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                        response.write(data);
                        response.end();
                    });
                }
                else {
                    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                    response.write('The ' + file + ' file does not exist');
                    response.end();
                }
            });
            break;

        //the server script creates a list of text values and then sends them
        case '/groceries':
            const texts = [
                '2 green apples',
                'cheese',
                'bread',
                'pasta',
                'butter'
            ];

            response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            response.write(JSON.stringify({ list: texts }));
            response.end();

            break;
    }
}).listen(8080);

console.log("The server was started on port 8080");
console.log("To end the server, press 'CTRL + C'");