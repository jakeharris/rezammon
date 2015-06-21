var assert = require('assert'),
    Actor = require('../../src/server/actor'),
    Hero = require('../../src/server/hero'),
    ParameterCountError = require('../../src/errors').ParameterCountError

describe('Hero', function () {
  context('constructor', function () {
    it('throws a ParameterCountError if no ID is supplied', function () {
      assert.throws(function () {
        var h = new Hero()
      }, ParameterCountError)
    })
    it('creates a Hero with the supplied ID and (x,y) set to (0,0)', function () {
      var h
      assert.doesNotThrow(function () {
        h = new Hero('milieu')
      })
      assert(h.id === 'milieu')
      assert(h.x === 0)
      assert(h.y === 0)
    })
    it('creates a Hero with the supplied ID and (x,y) set to the given x and y values', function () {
      var h
      assert.doesNotThrow(function () {
        h = new Hero('milieu', { x: 11, y: 7 })
      })
      assert(h.id === 'milieu')
      assert(h.x === 11)
      assert(h.y === 7)
    })
    it('has Actor in its prototype chain', function () {
      var h = new Hero('milieu')
      assert(h instanceof Actor)
    })
  })
})