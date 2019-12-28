/* To run test being in the '~/ex4' directory use the command 
  node ../node_modules/mocha/bin/mocha test
*/

var expect = require('chai').expect;
var module = require('../module');
 
describe('The sum() method', function() {
  it('Returns 4 for 2+2', function() {
    var op = new module.Operation(2,2);
    expect(op.sum()).to.equal(4);
  });
  it('Returns 0 for -2+2', function() {
    var op = new module.Operation(-2,2);
    expect(op.sum()).to.equal(0);
  });
});