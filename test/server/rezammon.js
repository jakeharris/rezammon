var assert = require('assert'),
    ParameterCountError = require('../../src/errors').ParameterCountError,
    MissingHeroError = require('../../src/errors').MissingHeroError,
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
      assert.equal(game.chooseHero(), 'milieu')
      
      server.addPlayer('f9a1af')
      server.addPlayer('fjfaiiz91')
      game.chooseHero()
      
      var setHero = false
      for(var p in game.players) {
        if(p === game.getHeroID())
          setHero = true
      }
          
      assert(setHero)
    })
    it('chooses the RIGHT player to become the Hero')
  })
  context('move()', function () {
    it('throws a ParameterCountError if no parameters are supplied', function () {
      assert.throws(function () {
        game.move()
      }, ParameterCountError)
    })
    it('throws a TypeError if a direction parameter is supplied, but it\'s not a string', function () {
      game.server.addPlayer('milieu')
      game.chooseHero()
      assert.throws(function () {
        game.move({ m: 'ilieu' })
      }, TypeError)
    })
    it('throws a SyntaxError if a string is specified, but it\'s not a valid direction', function () {
      game.server.addPlayer('milieu')
      game.chooseHero()
      assert.throws(function () {
        game.move('milieu')
      }, SyntaxError)
    })
    it('throws a MissingHeroError if no actor ID was specified, and no Hero exists', function () {
      assert.throws(function () {
        game.move('left')
      }, MissingHeroError)
    })
    it('doesn\'t throw an error if a direction is correctly specified', function () {
      game.server.addPlayer('milieu')
      game.chooseHero()
      assert.doesNotThrow(function () {
        game.move('left')
      })
    })
    it('moves the Hero as expected if a direction is correctly specified', function () {
      var x,
          xf,
          y,
          yf
      
      game.server.addPlayer('milieu')
      game.chooseHero()
      
      x = game.hero.x
      xf = null
      
      game.move('left')
      xf = game.hero.x
      
      assert.notEqual(xf, null)
      assert.notEqual(x, xf)
      assert.equal(x, xf + 1)
      
      x = game.hero.x
      xf = null
      
      game.move('right')
      xf = game.hero.x
      
      assert.notEqual(xf, null)
      assert.notEqual(x, xf)
      assert.equal(x, xf - 1)
      
      y = game.hero.y
      yf = null
      
      game.move('up')
      yf = game.hero.y
      
      assert.notEqual(yf, null)
      assert.notEqual(y, yf)
      assert.equal(y, yf - 1)
      
      y = game.hero.y
      yf = null
      
      game.move('down')
      yf = game.hero.y
      
      assert.notEqual(yf, null)
      assert.notEqual(y, yf)
      assert.equal(y, yf + 1)
    })
    it('throws a TypeError if an actor parameter is also supplied, but it is not a string', function () {
      assert.throws(function () {
        game.move('left', { m: 'ilieu' })
      }, TypeError)
    })
    it('throws a RangeError if an actor ID is supplied, but no players exist', function () {
      assert.throws(function () {
        game.move('left', 'milieu')
      }, RangeError)
    })
    it('throws a RangeError if an actor ID is supplied, but the ID isn\'t a player\'s ID', function () {
      game.server.addPlayer('fjf193')
      assert.throws(function () {
        game.move('left', 'milieu')
      }, RangeError)
    })
    it('moves the specified actor as expected if a direction is correctly specified')
    it('fails to move the specified actor if the actor is against a boundary and can\'t move in that direction')
  })
})