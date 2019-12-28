var assert = require('assert');
var sinon = require('sinon'); // Install sinon (npm install sinon) to enable creation of spies;
var module = require('../fs-module');

describe('The writeFile() method', function () {
    let spy = sinon.spy(console, 'log');
    it('Displays \'No path provided\' message if no string provided', function () {
        module.writeFile();
        assert(spy.calledWith('No path provided'));
    });

    it('Displays \'Path doesn\'t exist\' message for "not-existing-file.js"', function () {
        module.writeFile('not-existing-file.js');
        assert(spy.calledWith('Path doesn\'t exist'));
    });
    it('Displays \'Directory exists\' message for "test"', function () {
        module.writeFile('test');
        assert(spy.calledWith('Directory exists'));
    });
    it('Outputs "test-file.txt" content to console ', function () {
        module.writeFile('test-file.txt');
        assert(spy.calledWith('File exists'));
        assert(spy.calledWith('This is a test file to test FS module'));
    });
});