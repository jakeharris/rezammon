var assert = require('assert'),
    Player = require('../src/player'),
    ParameterCountError = require('../src/errors').ParameterCountError

describe('Player', function () {
  context('Constructor', function () {
    it('should throw a ParameterCountError if no id is supplied at construction', function () {
      assert.throws(function () {
        new Player() 
      }, ParameterCountError)
    })
    it('should not throw a TypeError if an id is supplied at construction', function () {
      assert.doesNotThrow(function () {
        new Player('0')
      }, TypeError)
    })
    it('should have an id', function () {
      var p = new Player('0')
      assert.equal(typeof p, 'object')
      assert.equal(typeof p.getID(), 'string')
    })
  })
})