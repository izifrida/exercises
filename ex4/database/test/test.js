// Run test being in 'database' folder:
// mocha test
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server').app;
const should = chai.should();

const Book = require('../models').Book;

chai.use(chaiHttp);

describe('App with database', function () {
    //Before each test we empty the database
    before(function (done) {
        Book.destroy({
            where: {},
            truncate: true
        });
        done();
    });

    describe('/', function () {
        it('Should return home page "Connected to Database"', function (done) {
            chai.request(app).get('/')
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.have.status(200);
                    res.should.to.be.html;
                    res.text.should.include('Connected to Database');
                    done();
                });
        });
    });

    describe('Get book list', function () {
        it('Should return empty table', function (done) {
            chai.request(app).get('/books')
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.have.status(200);
                    res.should.to.be.html;
                    res.text.should.include('Books List');
                    // Table must be empty
                    res.text.should.not.include('<td>')
                    done();
                });
        });
    });

    describe('Add book', function () {
        //const requester = chai.request(app).keepOpen();

        it('Insert new book', function (done) {
            const book = {
                'title': 'The Shining',
                'author': 'Stephen King',
                'category': 'Horror'
            }

            chai.request(app).post('/books/create')
                .type('form')
                .redirects(0)
                .send(book)
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.redirect;
                    done();
                });
        });

        it('Should have inserted book in table', function (done) {
            chai.request(app).get('/books')
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.have.status(200);
                    res.should.to.be.html;
                    res.text.should.include('Books List');
                    // Table must include inserted book
                    res.text.should.include('The Shining')
                    res.text.should.include('Stephen King');
                    res.text.should.include('Horror');
                    done();
                });
        });
    });

    describe('Update book', function () {
        let bookId;

        it('Should create book in DB to be updated', function (done) {
            Book.create({
                title: 'Harry Potter and the Philosopher\'s Stone',
                author: 'J.K. Rowling',
                category: 'Fantasy'
            }).then(function (book) {
                bookId = book.id;
                done();
            });
        });

        it('Should get book by id', function (done) {
            chai.request(app).get('/books?id=' + bookId)
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.have.status(200);
                    res.should.to.be.html;
                    res.text.should.include('Edit Book');
                    res.text.should.include(`name="title" value="Harry Potter and the Philosopher\'s Stone`);
                    res.text.should.include(`name="author" value="J.K. Rowling`);
                    res.text.should.include(`name="category" value="Fantasy`);
                    done();
                });
        });

        it('Should update book by id', function (done) {
            const book = {
                'title': 'Harry Potter and the Chamber Of Secrets',
                'author': 'J.K. Rowling',
                'category': 'Sci-Fi Humor'
            }

            chai.request(app).post('/books/edit?id=' + bookId)
                .type('form')
                .redirects(0)
                .send(book)
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.redirect;
                    done();
                });
        });

        it('Should have updated book in table', function (done) {
            chai.request(app).get('/books')
                .end(function (err, res) {
                    if (err) done(err);
                    res.should.have.status(200);
                    res.should.to.be.html;
                    res.text.should.include('Books List');
                    // Table must include updated book
                    res.text.should.include('Harry Potter and the Chamber Of Secrets')
                    res.text.should.include('J.K. Rowling');
                    res.text.should.include('Sci-Fi Humor');
                    done();
                });
        });
    });

    describe('Delete book', function () {
        let bookId;

        it('Should create book in DB to be deleted', function (done) {
            Book.create({
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                category: 'Classic'
            }).then(function (book) {
                bookId = book.id;
                done();
            });
        });

        it('Should have created book in table', function (done) {
            chai.request(app).get('/books')
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.have.status(200);
                    res.should.to.be.html;
                    res.text.should.include('Books List');
                    // Table must include inserted book
                    res.text.should.include('The Great Gatsby')
                    res.text.should.include('F. Scott Fitzgerald');
                    res.text.should.include('Classic');
                    done();
                });
        });

        it('Should delete book by id', function (done) {
            chai.request(app).delete('/books/delete?id=' + bookId)
                .redirects(0)
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.redirect;
                    done();
                });
        });

        it('Should not have deleted book in table', function (done) {
            chai.request(app).get('/books')
                .end(function (err, res) {
                    if (err) done(err);
                    res.should.have.status(200);
                    res.should.to.be.html;
                    res.text.should.include('Books List');
                    // Table must include updated book
                    res.text.should.not.include('The Great Gatsby')
                    res.text.should.not.include('F. Scott Fitzgerald');
                    res.text.should.not.include('Classic');
                    done();
                });
        });
    })

    describe('Exceptions', function () {
        it('Should return error if book id is invalid', function (done) {
            chai.request(app).get('/books?id=InvalidId')
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.have.status(400);
                    res.should.to.be.html;
                    res.text.should.include('Error has occured');
                    res.text.should.include('Error details');
                    res.text.should.include(`Invalid id`);
                    done();
                });
        });

        it('Should return error if book id doesn\'t exist', function (done) {
            chai.request(app).get('/books?id=100')
                .end(function (err, res) {
                    if (err) return done(err);

                    res.should.have.status(400);
                    res.should.to.be.html;
                    res.text.should.include('Error has occured');
                    res.text.should.include('Error details');
                    res.text.should.include(`Book not found`);
                    done();
                });
        });
    })
});

