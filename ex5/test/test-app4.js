// Task 14 (usage of request package). Point 2
// to run test from ex5 folder: mocha test/test-app4
var supertest = require("supertest");

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:3000");

// UNIT test begin
describe('The Star Wars', function () {
      it('should open home page', function (done) {
            server
                  .get('/')
                  .expect('Content-Type', /html/)
                  .expect(function (res) {
                        res.text.includes('The Star Wars API');
                  })
                  .expect(200, done);
      });

      it('should open list of films', function (done) {
            // The https://swapi.co/api can response slowly, so we added a timout here
            this.timeout(5000);

            server
                  .get('/films')
                  .expect('Content-Type', /html/)
                  .expect(function (res) {
                        res.text.includes('Star Wars Episodes');
                        // element with list of Star Wars Episodes
                        res.text.includes('div class="list-group"');
                  })
                  .expect(200, done);
      });

      it('should return information about Episode 4', function (done) {
            this.timeout(5000);

            server
                  .get('/films/details?source=https://swapi.co/api/films/1/')
                  .expect('Content-Type', /html/)
                  .expect(function (res) {
                        res.text.includes('Episode 4');
                        // In film template we have fragments like h2 #{film.title ? film.title : 'Not found'}
                        // So, if film information fetched correctly, there can't be 'Not found' fragments in response
                        !res.text.includes('Not found');
                  })
                  .expect(200, done);
      });

      it('should open list of planets from Star Wars Universe', function (done) {
            this.timeout(5000);

            server
                  .get('/planets')
                  .expect('Content-Type', /html/)
                  .expect(function (res) {
                        res.text.includes('Star Wars Planets');
                        // element with list of Star Wars Planets
                        res.text.includes('div class="list-group"');
                  })
                  .expect(200, done);
      });

      it('should return information about planet Alderaan', function (done) {
            this.timeout(5000);

            server
                  .get('/planets/details?source=https://swapi.co/api/planets/2/')
                  .expect('Content-Type', /html/)
                  .expect(function (res) {
                        res.text.includes('Alderaan');
                        // In planet template we have fragments like  h1 #{planet.name ? planet.name : 'Not found'}
                        // So, if planet information fetched correctly, there can't be 'Not found' fragments in response
                        !res.text.includes('Not found');
                  })
                  .expect(200, done);
      });
});