// Task 11 (The 'http' module)

var http = require("http");
var url = require("url");
var fsModuleModified = require('./fs-module-modified');

http.createServer(function (request, response) {
    /*
      ,,request'' - input stream - contains data received from the browser, e.g. encoded contents of HTML form fields
      
      ,,response'' - output stream - put in it data that you want to send back to the browser.
         The answer sent by this stream must consist of two parts: the header and the body.
         The header contains, among others, information about the type (MIME) of data contained in the body.
         The body contains the correct data, e.g. a form definition.

    */
	console.log("--------------------------------------")
	console.log("The relative URL of the current request: " + request.url + "\n")
	var url_parts = url.parse(request.url, true); //parsing (relative) URL

	console.log(url_parts);
	// Reworked into switched-case statements
	switch (url_parts.pathname) {
		// Based on the data contained in the form field, processes the contents of a file or directory
		// http://localhost:8080/file
		case '/file':
			response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			response.write('<form method="GET" action="/file/submit">');
			response.write('<label for="name">Path to file (directory)</label>');
			response.write('<input name="name">');
			response.write('<br>');
			response.write('<input type="submit">');
			response.write('<input type="reset">');
			response.write('</form>');
			response.end();
			break;

		case '/file/submit':
			var name = url_parts.query['name'];
			fsModuleModified.writeFile(name, response);
			break;

		case '/submit':
			var name = url_parts.query['name']; //Read the contents of the field (form) named 'name'
			console.log("Creating a response header")
			response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });  //Creating an answer header - we inform the browser that the body of the answer will be plain text
			console.log("Creating the body of the response")
			response.write('Hello ' + name); //Place given data (here: 'Hello' text) in the body of the answer
			response.end(); //The end of the response - send it to the browser
			console.log("Sending a response")
			break;

		default:
			console.log("Creating a response header")
			response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });  //Creating a repsonse header - we inform the browser that the body of the response will be HTML text
			//and now we put an HTML form in the body of the answer
			console.log("Creating a response body")
			response.write('<form method="GET" action="/submit">');
			response.write('<label for="name">Give your name</label>');
			response.write('<input name="name">');
			response.write('<br>');
			response.write('<input type="submit">');
			response.write('<input type="reset">');
			response.write('</form>');
			response.end();  //The end of the response - send it to the browser
			console.log("Sending a response")
			break;
	}

}).listen(8080);
console.log("The server was started on port 8080");
console.log("To end the server, press 'CTRL + C'");