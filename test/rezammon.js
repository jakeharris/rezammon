var assert = require('assert'),
    ParameterCountError = require('../src/errors').ParameterCountError,
    Rezammon = require('../src/rezammon')

describe('Rezammon', function () {
  context('Constructor', function () {
    it('should throw a ParameterCountError if no interface parameter is supplied', function () {
      assert.throws(function () {
        var game = new Rezammon()
      }, ParameterCountError)
    })
    it('should throw a TypeError if the interface parameter is not a RezammonSocketIOInterface', function () {
      assert.throws(function () {
        var game = new Rezammon('0')
      }, TypeError)
    })
    it('should create a Rezammon game if the interface parameter is proper', function () {
      assert.doesNotThrow(function () {
        var game = new Rezammon(require('../src/rezammon-socket-io-interface'))
      })
    })
  })

  
})