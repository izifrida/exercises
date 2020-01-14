var http = require("http");
var url = require("url");
var fs = require("fs");
var file = 'form.html';

http.createServer(function(request, response) {
    console.log("--------------------------------------");
    console.log("The relative URL of the current request: " + request.url + "\n");
    var url_parts = url.parse(request.url, true);  // parsing (relative) URL

    switch (url_parts.pathname) {
        case '/':
            fs.stat(file, function(err, stats) {
                if (err == null) {
                    fs.readFile(file, function(err, data) {
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

        case '/file':
            const fileInput = url_parts.query['file'];
            console.log(fileInput);
            var operation = url_parts.query['operation'];

            const fileName = fileInput.split(' ')[0];


            fs.stat(fileName, function(err, stats) {
                if (err == null) {
                    if (operation === 'removeFile') {
                        fs.unlink(fileName, function(err, data) {
                            if (err) {
                                response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                                response.write('Error occured: ' + err);
                                response.end();
                                return;
                            }

                            response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                            response.write('The ' + fileName + ' was removed');
                            response.end();
                        });
                    } else {
                        const newName = fileInput.split(' ')[1];

                        fs.rename(fileName, newName, function(err, data) {
                            if (err) {
                                response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                                response.write('Error occured: ' + err);
                                response.end();
                                return;
                            }

                            response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

                            response.write('The ' + fileName + ' was renamed to ' + newName);
                            response.end();
                        });
                    }


                }
                else {
                    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                    response.write('The ' + fileName + ' file does not exist');
                    response.end();
                }
            });
            break;
    }
}).listen(8080);

console.log("The server was started on port 8080");
console.log("To end the server, press 'CTRL + C'");