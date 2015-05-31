var assert = require('assert'),
    ParameterCountError = require('../src/errors').ParameterCountError,
    RezammonGame = require('../src/rezammon'),
    RezammonSocketIOInterface = require('../src/rezammon-socket-io-interface')

describe('RezammonGame', function () {
  context('constructor', function () {
    it('should throw a ParameterCountError if no interface parameter is supplied', function () {
      assert.throws(function () {
        var game = new RezammonGame()
      }, ParameterCountError)
    })
    it('should throw a TypeError if the interface parameter is not a RezammonSocketIOInterface', function () {
      assert.throws(function () {
        var game = new RezammonGame('0')
      }, TypeError)
    })
    it('should create a RezammonGame if the interface parameter is proper', function () {
      assert.doesNotThrow(function () {
        var game = new RezammonGame(new RezammonSocketIOInterface())
      })
    })
  })

  
})