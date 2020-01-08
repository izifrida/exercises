var http = require("http");
var url = require("url");
var fs = require("fs");
var file = 'form.html';

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

        case '/count':
            if (request.method.toLowerCase() === 'post') {
                let body = ''
                request.on('data', function (data) {
                    body += data
                })

                request.on('end', function () {
                    // Parse body and save it
                    const data = JSON.parse(body);

                    // Count the occurrence of a substring in a string
                    const str = data.string + '';
                    const subStr = data.substring + '';

                    if (subStr.length <= 0) {
                        return str.length + 1;
                    }

                    const testSubstr = subStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const count = (str.match(new RegExp(testSubstr, 'gi')) || []).length;

                    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                    response.write(JSON.stringify({ count: count }));
                    response.end();
                })
            } else {
                response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
                response.write('Wrong request method');
                response.end();
            }

            break;
    }
}).listen(8080);

console.log("The server was started on port 8080");
console.log("To end the server, press 'CTRL + C'");