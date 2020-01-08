var http = require("http");
var url = require("url");
var fs = require("fs");
var file = 'form.html';

// For  parsing URL query strings
const querystring = require('querystring');

http.createServer(function (request, response) {
    console.log("--------------------------------------");
    console.log("The relative URL of the current request: " + request.url + "\n");
    var url_parts = url.parse(request.url, true);  // parsing (relative) URL

    //Compare the relative URL
    switch (url_parts.pathname) {

        // if relative URL is '/' then send, to a browser,
        // the contents of a file (an HTML document) - its name contains the 'file' variable
        case '/':
            fs.stat(file, function (err, stats) {
                if (err == null) { // If the file exists
                    fs.readFile(file, function (err, data) { // Read it content
                        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                        response.write(data);   // Send the content to the web browser
                        response.end();
                    });
                }
                else { // If the file does not exists
                    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                    response.write('The ' + file + ' file does not exist');
                    response.end();
                } //else
            }); //fs.stat
            break;

        // Process the form content if relative URL is '/submit'
        case '/submit':
            // Task 15 point 11, 12, 13
            // Handle POST request
            if (request.method.toLowerCase() === 'post') {
                let body = ''
                request.on('data', function (data) {
                    body += data
                })

                request.on('end', function () {
                    // Parse body
                    const parsedBody = querystring.parse(body);
                    const name = parsedBody.name;

                    console.log('Provided in the URL name is ' + name);

                    if (name) {
                        var welcome = 'Hello ' + name;
                        response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                        response.write(welcome);
                        response.end();
                        console.log("The server sent the '" + welcome + "' text to the browser");
                        return;
                    }

                    var welcome = 'Hello World (Witaj Świecie)';
                    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                    response.write(welcome); // Data (response) that we want to send to the web browser
                    response.end(); // Sending the answer
                    console.log("The server sent the '" + welcome + "' text to the browser");
                })

                break;
                // *** End of Task 15 point 11, 12, 13  

                // Else is for GET request
            } else {
                // Task 15 point 9
                // Modify the script to display (in the console) your name that the browser has provided to the server in the URL above
                const name = url_parts.query['name'];
                console.log('Provided in the URL name is ' + name);

                // It should send "Hello <your_name>" instead of "Hello World (Witaj Świecie)", where <your_name> is your name got from the browser
                if (name) {
                    var welcome = 'Hello ' + name;
                    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                    response.write(welcome);
                    response.end();
                    console.log("The server sent the '" + welcome + "' text to the browser");
                    break;
                }

                // *** End of task Task 15 point 9  

                // If no name send stardard welcome
                var welcome = 'Hello World (Witaj Świecie)';
                response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                response.write(welcome); // Data (response) that we want to send to the web browser
                response.end(); // Sending the answer
                console.log("The server sent the '" + welcome + "' text to the browser");
                break;
            }
        // Other cases

    } //switch
}).listen(8080);
console.log("The server was started on port 8080");
console.log("To end the server, press 'CTRL + C'");