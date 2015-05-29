var assert = require('assert'),
    ParameterCountError = require('../src/errors').ParameterCountError,
    HeroGame = require('../src/hero-game')

describe('HeroGame', function () {
  context('Constructor', function () {
    it('should throw a ParameterCountError if no interface parameter is supplied', function () {
      assert.throws(function () {
        var game = new HeroGame()
      }, ParameterCountError)
    })
    it('should throw a TypeError if the interface parameter is not a HeroGameSocketIOInterface', function () {
      assert.throws(function () {
        var game = new HeroGame('0')
      }, TypeError)
    })
    it('should create a HeroGame if the interface parameter is proper', function () {
      assert.doesNotThrow(function () {
        var game = new HeroGame(require('../src/hero-game-socket-io-interface'))
      })
    })
  })

  
})