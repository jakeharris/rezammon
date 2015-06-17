var assert = require('assert'),
    Player = require('../../src/server/player'),
    ParameterCountError = require('../../src/errors').ParameterCountError

describe('Player', function () {
  context('constructor', function () {
    it('throws a ParameterCountError if no id is supplied at construction', function () {
      assert.throws(function () {
        new Player() 
      }, ParameterCountError)
    })
    it('doesn\'t throw a TypeError if an id is supplied at construction', function () {
      assert.doesNotThrow(function () {
        new Player('0')
      }, TypeError)
    })
    it('has an id after successful construction', function () {
      var p = new Player('0')
      assert.equal(typeof p, 'object')
      assert.equal(typeof p.getID(), 'string')
    })
  })
})