// Task 14 (Handling complex data in JSON format). Point 1

var chai = require('chai');
var expect = require('chai').expect;

chai.use(require('chai-json'));

//Source:  https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/
var supertest = require("supertest");

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:3000");

describe('JSON File', function () {

    it('a "operations.json" is equal to an javascript object', function (done) {
        const jsonObj = {
            operations: [
                { name: 'add', arg1: 5, arg2: 10 },
                { name: 'subtract', arg1: 'result', arg2: 5 },
                { name: 'multiply', arg1: 10, arg2: 'result' },
                { name: 'divide', arg1: 'result', arg2: 2 }
            ]
        }

        expect('./operations.json').to.be.a.jsonFile().to.be.jsonObj(jsonObj);
        done();
    });

    it('respond with "Calculated result = 50" for operations.json', function (done) {
        server
            .post('/calculate')
            .attach('operations', './operations.json')
            .expect('Content-Type', /html/)
            .expect(function (res) {
                res.text.includes('Calculated result = 50');
            })
            .expect(200, done);
    });
})