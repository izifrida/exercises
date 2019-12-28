// Modified for task 11 "The 'http' module"
// writeFile function uses asynchronous methods 
const fs = require('fs');

function writeFile(input, response) {
    if (input) {
        return fs.stat(input, (err, stats) => {
            if (err) {
                response.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
                response.write('<p style="color: red">Path doesn\'t exist</p>');
                response.end();
                return;
            }

            if (stats.isDirectory()) {
                response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                response.write('<p>Given string represents the name of the <b>directory</b></p>');
                response.end();
                return;
            }

            if (stats.isFile()) {
                console.log('Reading file...');

                fs.readFile(input, (err, data) => {
                    if (err) {
                        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                        response.write(err);
                        response.end();
                        return;
                    }

                    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                    response.write('<p>Given string represents the name of the <b>file</b></p>');
                    response.write('<p>File content:</p>');
                    response.write('<p>' + data.toString('utf8') + '</p>');
                    response.end();
                    return;
                })
            }
        })
    } else {
        response.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        response.write('<p style="color: red">No path provided</p>');
        response.end();
    }
}

exports.writeFile = writeFile;
