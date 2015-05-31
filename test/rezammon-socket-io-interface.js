var assert = require('assert'),
    ParameterCountError = require('../src/errors').ParameterCountError,
    ConfiguredHeroError = require('../src/errors').ConfiguredHeroError,
    MissingHeroError = require('../src/errors').MissingHeroError,
    RezammonSocketIOInterface = require('../src/server/rezammon-socket-io-interface'),
    RezammonGame = require('../src/server/rezammon'),
    Socket = require('socket.io').Socket

describe('RezammonSocketIOInterface', function () {
  beforeEach(function () {
    interface = new RezammonSocketIOInterface()
  })
  context('hasConnectedHero()', function () {
    it('should be able to tell if we don\'t have a Hero socket configured', function () {
      assert.equal(false, interface.hasConnectedHero())
    })
    it('should be able to tell if we do have a Hero socket configured', function () {
      interface.setHero('0')
      assert(interface.hasConnectedHero())
    })
  })
  context('setHero()', function () {
    it('should be able to set a socket up as a Hero socket if there isn\'t one', function () {
      assert.equal(false, interface.hasConnectedHero())
      interface.setHero('0')
      assert(interface.hasConnectedHero())
      assert(interface.isHero('0'))
    })
    it('should throw a ConfiguredHeroError if there\'s already a Hero (even if the Hero\'s ID is the submitted ID)', function () {
      interface.setHero('0')
      assert.throws(function () {
        interface.setHero('0')
      }, ConfiguredHeroError)
      assert(interface.hasConnectedHero())
      assert(interface.isHero('0'))
      assert.throws(function () {
        interface.setHero('1')
      }, ConfiguredHeroError)
      assert(interface.hasConnectedHero())
      assert(interface.isHero('0'))
    })
  })
  context('addPlayer()', function () {
    before(function () {
      RezammonGame = require('../src/server/rezammon')
    })
    it('should throw a ParameterCountError if no id was supplied', function () {
      assert.throws(function () {
        interface.addPlayerTo(new RezammonGame(interface))
      }, ParameterCountError)
    })
    it('should throw a TypeError if the supplied game was not a RezammonGame object', function () {
      assert.throws(function () {
        interface.addPlayerTo(123, '0')
      }, TypeError)
    })
    it('should throw a TypeError if the supplied id was not a string', function () {
      assert.throws(function () {
        interface.addPlayerTo(new RezammonGame(interface), { foo: 'bar' })
      }, TypeError)
    })
    it('should not throw an error if the parameters were proper', function () {
      assert.doesNotThrow(function () {
        interface.addPlayerTo(new RezammonGame(interface), '0')
      })
    })
  })
  context('isHero()', function () {
    beforeEach(function () {
      interface.setHero('0')
    })
    it('should throw a ParameterCountError if no id was supplied', function () {
      assert.throws(function () {
        interface.isHero()
      }, ParameterCountError)
    })
    it('should throw a TypeError if the supplied id was not a string', function () {
      assert.throws(function () {
        interface.isHero(123)
      }, TypeError)
    })
    it('should throw a MissingHeroError if there is no Hero', function () {
      assert.throws(function () {
        interface = new RezammonSocketIOInterface()
        interface.isHero('0')
      }, MissingHeroError)
    })
    it('should be able to determine that a given socket is the Hero', function () {
      assert(interface.isHero('0'))
    })
  })
  context('configureSocket()', function () {
    
  })
})