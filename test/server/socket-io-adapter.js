var assert = require('assert'),
    http = require('http'),
    Server = require('socket.io'),
    RezammonGame = require('../../src/server/rezammon'),
    SocketIOAdapter = require('../../src/server/socket-io-adapter'),
    ParameterCountError = require('../../src/errors').ParameterCountError,
    ConfiguredHeroError = require('../../src/errors').ConfiguredHeroError,
    MissingHeroError    = require('../../src/errors').MissingHeroError

describe('SocketIOAdapter', function () {
  beforeEach(function () {
    io = Server(http)
    game = new RezammonGame(io)
    server = new SocketIOAdapter(io, game, true) //third param is optional, is true if testing
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
        server = new SocketIOAdapter({ m: 'ilieu' }, game, true)
      }, TypeError)
    })
    it('throws a TypeError when no Controller object is supplied as the second parameter', function () {
      assert.throws(function () {
        server = new SocketIOAdapter(io, { m: 'ilieu' }, true)
      }, TypeError)
    })
    it('doesn\'t throw an error when its parameters are proper', function () {
      assert.doesNotThrow(function () {
        server = new SocketIOAdapter(io, game, true)
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
    beforeEach(function () {
      server = new SocketIOAdapter(io, game, true)
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
    it('should be able to set a socket up as a Hero socket if there isn\'t one', function () {
      assert(!server.hasConnectedHero())
      server.setHero('0')
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
        server.addPlayer('0')
      })
    })
    it('should return the number of connected players', function () {
      assert.equal(server.addPlayer('0'), 1)
      assert.equal(server.addPlayer('1'), 2)
      assert.equal(server.addPlayer('milieu'), 3)
    })
  })
  context('removePlayer()', function () {
    it('throws a ParameterCountError if no parameter is supplied', function () {
      assert.throws(function () {
        server.removePlayer()
      }, ParameterCountError)
    })
    it('throws a TypeError if an ID is supplied, but it isn\'t a string', function () {
      assert.throws(function () {
        server.removePlayer({ m: 'ilieu' })
      }, TypeError)
    })
    it('throws a RangeError if an ID is supplied, but no players exist', function () {
      assert.throws(function () {
        server.removePlayer('milieu')
      }, RangeError, /No players are connected./)
    })
    it('throws a RangeError if an ID is supplied and players exist, but none have the supplied ID', function () {
      server.addPlayer('0')
      server.addPlayer('1')
      assert.throws(function () {
        server.removePlayer('milieu')
      }, RangeError, /No player exists with id:/)
    })
    it('should not throw an error if the parameters were proper and players existed', function () {
      server.addPlayer('0')
      server.addPlayer('1')
      server.addPlayer('milieu')
      assert.doesNotThrow(function () {
        server.removePlayer('milieu')
      })
    })
    it('should return the number of remaining connected players', function () {
      server.addPlayer('0')
      server.addPlayer('1')
      server.addPlayer('milieu')
      assert.equal(server.removePlayer('milieu'), 2)
    })
  })
  context('isHero()', function () {
    beforeEach(function () {
      server = new SocketIOAdapter(io, game, true)
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
        server = new SocketIOAdapter(io, game, true)
        server.isHero('0')
      }, MissingHeroError)
    })
    it('should be able to determine that a given socket is the Hero', function () {
      assert(server.isHero('0'))
    })
    it('should be able to determine that a given socket is not the Hero', function () {
      assert(!server.isHero('3'))
    })
  })
  context('configureServer()', function () {
    // I'm going to assume this works.
    // Dangerous, but everything in here will be
    // API calls to the particular server. If I'm
    // using a server that isn't well-tested, I've
    // got worse problems.
  })
})