//Source:  https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/
var supertest = require("supertest");

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:3000");

// UNIT test begin
describe('GET /', function () {
      it('respond with html', function (done) {
            server
                  .get('/')
                  .expect('Content-Type', /html/)
                  .expect(200, done);
      });

      // Task 13 point 5
      it('respond with 1 + 2 = 3 for variables values specified in the source code', function (done) {
            server
                  .get('/')
                  .expect('Content-Type', /html/)
                  .expect(function (res) {
                        res.text.includes('1 + 2 = 3');
                  })
                  .expect(200, done);
      });

      it('respond with 1 + 2 = 3 for variable values passed in the URL', function (done) {
            server
                  .get('/add/1/2')
                  .expect('Content-Type', /html/)
                  .expect(function (res) {
                        res.text.includes('1 + 2 = 3');
                  })
                  .expect(200, done);
      });
});