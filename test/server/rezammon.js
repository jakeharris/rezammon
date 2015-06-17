var assert = require('assert'),
    ParameterCountError = require('../../src/errors').ParameterCountError,
    RezammonGame = require('../../src/server/rezammon'),
    SocketIOAdapter = require('../../src/server/socket-io-adapter'),
    http = require('http'),
    io = require('socket.io')

describe('RezammonGame', function () {
  context('constructor', function () {
    beforeEach(function () {
      _server = io(http)
    })
    it('should throw a ParameterCountError if no parameter is supplied', function () {
      assert.throws(function () {
        var game = new RezammonGame()
      }, ParameterCountError)
    })
    it('should throw a TypeError if the server parameter is not a supported server type', function () {
      assert.throws(function () {
        var game = new RezammonGame({ m: 'ilieu' })
      }, TypeError)
    })
    it('should create a RezammonGame if the server parameter is proper', function () {
      assert.doesNotThrow(function () {
        var game = new RezammonGame(_server)
      })
    })
  })
  context('getHeroID()', function () {
    before(function () {
      _server = io(http)
      game = new RezammonGame(_server)
      server = game.server
    })
    beforeEach(function () {
      _server = io(http)
      game = new RezammonGame(_server)
      server = game.server
    })
    it('throws an Error if no players are connected', function () {
      assert.throws(function () {
        game.getHeroID()
      })
    })
    it('returns the Hero\'s ID if there is a Hero', function () {
      server.addPlayer('0')
      server.addPlayer('1')
      game.hero = game.players['1']
      assert.equal(game.getHeroID(), '1')
    })
    it('coerces there to be a Hero if there are players, but no Hero; then, it returns that Hero\'s ID', function () {
      server.addPlayer('0')
      server.addPlayer('1')
      assert(game.getHeroID() === '0')
    })
  })
})