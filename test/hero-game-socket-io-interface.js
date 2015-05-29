var assert = require('assert'),
    ParameterCountError = require('../src/errors').ParameterCountError

describe('HeroGameSocketIOInterface', function () {
  it('should not start with a connected hero', function () {
    interface = require('../src/hero-game-socket-io-interface')
    assert.equal(false, interface.hasConnectedHero())
  })
  it('should require a socket to initialize a hero', function () {
    interface = require('../src/hero-game-socket-io-interface')
    assert.throws(function () {
      interface.initializeHeroSocket()
    }, ParameterCountError)
    assert.throws(function () {
      interface.initializeHeroSocket(23)
    }, TypeError)
    assert.doesNotThrow(function () {
      interface.initializeHeroSocket({ id: '0', emit: function () {} }) // note that we don't check if it's a Socket.io socket
    })
  })
  it('should have a connected hero after a successful initialization', function () {
    interface = require('../src/hero-game-socket-io-interface')
    interface.initializeHeroSocket({ id: '0', emit: function () {} })
    assert(interface.hasConnectedHero())
  })
  it('should be able to verify that a socket id is the hero\'s id', function () {
    interface = require('../src/hero-game-socket-io-interface')
    interface.initializeHeroSocket({ id: '0', emit: function () {} })
    assert(interface.isHero('0'))
  })
})