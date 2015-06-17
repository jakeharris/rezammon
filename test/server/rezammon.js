var assert = require('assert'),
    ParameterCountError = require('../../src/errors').ParameterCountError,
    RezammonGame = require('../../src/server/rezammon'),
    SocketIOAdapter = require('../../src/server/socket-io-adapter'),
    http = require('http'),
    Server = require('socket.io')

describe('RezammonGame', function () {
  beforeEach(function () {
    io = new Server(http)
    game = new RezammonGame(io)
    server = new SocketIOAdapter(io, game, true) //third param is optional, is true if testing
  })
  context('constructor', function () {
    it('throws a ParameterCountError if no parameter is supplied', function () {
      assert.throws(function () {
        game = new RezammonGame()
      }, ParameterCountError)
    })
    it('throws a TypeError if the server parameter is not a supported server type', function () {
      assert.throws(function () {
        game = new RezammonGame({ m: 'ilieu' })
      }, TypeError)
    })
    it('creates a RezammonGame if the server parameter is proper', function () {
      assert.doesNotThrow(function () {
        game = new RezammonGame(io)
      })
    })
  })
  context('createServerAdapter()', function () {
    it('throws a ParameterCountError if no server parameter was supplied', function () {
      assert.throws(function () {
        game.createServerAdapter()
      }, ParameterCountError)
    })
    it('throws a TypeError if the server parameter is not a supported type', function () {
      assert.throws(function () {
        game.createServerAdapter({ m: 'ilieu' })
      }, TypeError)
    })
    it('doesn\'t throw an error otherwise', function () {
      assert.doesNotThrow(function () {
        game.createServerAdapter(io)
      })
    })
  })
  context('getHeroID()', function () {
    beforeEach(function () {
      server = game.server
    })
    it('throws an Error if no players are connected', function () {
      assert.throws(function () {
        game.getHeroID()
      }, Error)
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
  context('chooseHero()', function () {
    it('throws an Error if no players are connected', function () {
      assert.throws(function () {
        game.chooseHero()
      }, Error)
    })
    it('chooses an extant player to become the Hero', function () {
      server = game.server
      
      server.addPlayer('milieu')
      game.chooseHero()
      assert.equal(game.getHeroID(), 'milieu')
      
      server.addPlayer('f9a1af')
      server.addPlayer('fjfaiiz91')
      game.chooseHero()
      
      var setHero = false
      for(var p of game.players)
        if(p === game.getHeroID())
          setHero = true
          
      assert(setHero)
    })
    it('chooses the RIGHT player to become the Hero')
  })
})