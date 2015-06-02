var assert = require('assert'),
    http = require('http'),
    Server = require('socket.io'),
    RezammonGame = require('../src/server/rezammon'),
    SocketIOAdapter = require('../src/server/socket-io-adapter'),
    ParameterCountError = require('../src/errors').ParameterCountError

describe('SocketIOAdapter', function () {
  before(function () {
    io = Server(http)
    game = new RezammonGame(io)
    server = new SocketIOAdapter(io, game)
  })
  context('constructor', function () {
    it('throws a ParameterCountError when no parameters are supplied', function () {
      assert.throws(function () {
        server = new SocketIOAdapter()
      }, ParameterCountError)
    })
    it('throws a ParameterCountError when only one parameter is supplied', function () {
      assert.throws(function () {
        server = new SocketIOAdapter(io)
      }, ParameterCountError)
    })
    it('throws a TypeError when no SocketIO object is supplied as the first parameter', function () {
      assert.throws(function () {
        server = new SocketIOAdapter({ m: 'ilieu' }, game)
      }, TypeError)
    })
    it('throws a TypeError when no Controller object is supplied as the second parameter', function () {
      assert.throws(function () {
        server = new SocketIOAdapter(io, { m: 'ilieu' })
      }, TypeError)
    })
    it('doesn\'t throw an error when its parameters are proper', function () {
      assert.doesNotThrow(function () {
        server = new SocketIOAdapter(io, game)
      })
    })
  })
  context('hasConnectedHero()', function () {
    it('should be able to tell if we don\'t have a Hero socket configured', function () {
      assert.equal(false, server.hasConnectedHero())
    })
    it('should be able to tell if we do have a Hero socket configured', function () {
      server.setHero('0')
      assert(server.hasConnectedHero())
    })
  })
  context('setHero()', function () {
    it('should be able to set a socket up as a Hero socket if there isn\'t one', function () {
      console.log(server.hasConnectedHero())
      assert(!server.hasConnectedHero())
      server.setHero('0')
      console.log(server.hasConnectedHero())
      assert(server.hasConnectedHero())
      console.log(server.isHero('0'))
      assert(server.isHero('0'))
    })
    it('should throw a ConfiguredHeroError if there\'s already a Hero (even if the Hero\'s ID is the submitted ID)', function () {
      server.setHero('0')
      assert.throws(function () {
        server.setHero('0')
      }, ConfiguredHeroError)
      assert(server.hasConnectedHero())
      assert(server.isHero('0'))
      assert.throws(function () {
        server.setHero('1')
      }, ConfiguredHeroError)
      assert(server.hasConnectedHero())
      assert(server.isHero('0'))
    })
  })
  context('addPlayer()', function () {
    it('should throw a ParameterCountError if no id was supplied', function () {
      assert.throws(function () {
        server.addPlayer()
      }, ParameterCountError)
    })
    it('should throw a TypeError if the supplied id was not a string', function () {
      assert.throws(function () {
        server.addPlayer({ foo: 'bar' })
      }, TypeError)
    })
    it('should not throw an error if the parameters were proper', function () {
      assert.doesNotThrow(function () {
        interface.addPlayer('0')
      })
    })
  })
  context('isHero()', function () {
    beforeEach(function () {
      server.setHero('0')
    })
    it('should throw a ParameterCountError if no id was supplied', function () {
      assert.throws(function () {
        server.isHero()
      }, ParameterCountError)
    })
    it('should throw a TypeError if the supplied id was not a string', function () {
      assert.throws(function () {
        server.isHero(123)
      }, TypeError)
    })
    it('should throw a MissingHeroError if there is no Hero', function () {
      assert.throws(function () {
        server = new SocketIOAdapter(io, game)
        server.isHero('0')
      }, MissingHeroError)
    })
    it('should be able to determine that a given socket is the Hero', function () {
      assert(server.isHero('0'))
    })
  })
})