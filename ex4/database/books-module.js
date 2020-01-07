const Book = require('./models').Book;
const url = require("url");
// For  parsing URL query strings
const querystring = require('querystring');

// Error handler
function onError(response, err) {
    response.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    response.write(`
        <h2 style="color: red">Error has occured</h2>
        <p>Error details</p>
        <code>${err}</code>
    `);
    response.end();
}

// Check whether provided id exists
// Method returns Promise, so we can chain it in the chain of Promises
function checkIDExist(id) {
    // We expect id as number
    if (isNaN(id)) {
        return new Promise((resolve, reject) => {
            throw new Error("Invalid id");
        })
    }

    return Book.count({ where: { id: id } })
        .then(count => {
            if (count == 0) {
                throw new Error('Book not found')
            }
        });

};

// Redirect to books list
function redirectToList(response) {
    response.writeHead(302, { 'Location': 'http://localhost:8080/books' });
    response.end();
}

// CRUD Methods to read and manipulate data
// CREATE
function createBook(request, response) {
    if (request.method.toLowerCase() !== 'post') {
        return onError(response, 'Wrong request method');
    }
    // Save request body in variable body
    let body = ''
    request.on('data', function (data) {
        body += data
    })

    request.on('end', function () {
        // Parse body
        const data = querystring.parse(body);
        Book.create({
            title: data.title,
            author: data.author,
            category: data.category
        })
            .then(book => {
                redirectToList(response)
            })
            .error(err => {
                onError(response, err)
            });
    })
}

// READ ALL
function getAllBooks(response) {
    Book.findAll()
        .then(book => {
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.write(`
          <h2>Books List</h2>  
          <table style="border-collapse: collapse; width:  700px;">
            <tr style="border: 1px solid black; background: #edf0ee">
              <th style="text-align: left;">Title</th>
              <th style="text-align: left;">Author</th>
              <th style="text-align: left;">Category</th>
              <th></th>
              <th></th>
            </tr> 
        `);

            book.forEach(element => {
                response.write(`
                    <tr style="border: 1px solid grey">
                        <td>${element.title}</td>
                        <td>${element.author}</td>
                        <td>${element.category}</td>
                        <td><a href="books?id=${element.id}">Edit Book</a></td>          
                        <td><a href="books/delete?id=${element.id}">Remove Book</a></td>
                    </tr>
                `)
            });

            response.write('</table>');

            response.write(`
                <p style="margin: 50px 0 20px 0">Add Book</p>
                <form method="post" action="/books/create">
                    <label for="title">Title</label>
                    <input name="title">
                    <label for="author">Author</label>
                    <input name="author">
                    <label for="category">Category</label>
                    <input name="category">
                    <br>                    
                    <input type="submit" style="margin-top: 20px">
                    <input type="reset">
                </form>
            `);

            response.end();
        })
        .error(err => {
            onError(response, err)
        });
}

// GET BY ID
function getBook(id, response) {
    checkIDExist(id)
        .then(() => Book.findByPk(id))
        .then(book => {
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.write(`
                <h2>Edit Book</h2>  
                <form method="post" action="/books/edit?id=${book.id}">
                    <label for="title">Title</label>
                    <input name="title" value="${book.title}">
                    <label for="author">Author</label>
                    <input name="author" value="${book.author}">
                    <label for="category">Category</label>
                    <input name="category" value="${book.category}"> 
                    <br>
                    <input type="submit" style="margin-top: 20px">
                    <input type="reset">
                </form>
            `);

            response.end();
        })
        .catch(err => {
            console.log('Error');
            onError(response, err)
        });
}
// DELETE
function deleteBook(id, response) {
    checkIDExist(id)
        .then(() => Book.destroy({
            where: { id: id }
        }))
        .then(result => {
            redirectToList(response)
        })
        .catch(err => {
            onError(response, err)
        });
}

// UPDATE
function updateBook(id, request, response) {
    checkIDExist(id)
        .then(() => {
            let body = '';
            request.on('data', function (data) {
                body += data
            })

            request.on('end', function () {
                // Parse body
                const data = querystring.parse(body);
                Book.update({
                    title: data.title,
                    author: data.author,
                    category: data.category
                }, {
                        where: { id: id }
                    })
                    .then(book => {
                        redirectToList(response)
                    })
                    .error(err => {
                        onError(response, err)
                    });
            })
        });
}

module.exports.getAllBooks = getAllBooks;

module.exports.createBook = createBook;

module.exports.deleteBook = deleteBook;

module.exports.getBook = getBook;

module.exports.updateBook = updateBook;