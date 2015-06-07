var assert = require('assert'),
    ParameterCountError = require('../../src/errors').ParameterCountError,
    RezammonGame = require('../../src/server/rezammon'),
    SocketIOAdapter = require('../../src/server/socket-io-adapter'),
    http = require('http'),
    io = require('socket.io')(http)

describe('RezammonGame', function () {
  context('constructor', function () {
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
        var game = new RezammonGame(io)
      })
    })
  })
})