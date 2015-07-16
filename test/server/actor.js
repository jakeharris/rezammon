var assert = require('assert'),
    Entity = require('../../src/server/entity'),
    Actor = require('../../src/server/actor'),
    NotImplementedError = require('../../src/errors').NotImplementedError,
    ParameterCountError = require('../../src/errors').ParameterCountError

describe('Actor', function () {
  context('constructor', function () {
    it('creates an Actor with Entity in its prototype chain', function () {
      var a = new Actor()
      assert(a instanceof Entity)
    })
    it('creates an Actor with a positive health value', function () {
      var a = new Actor()
      assert(a.health)
    })
  })
  context('move()', function () {
    it('throws a NotImplementedError if a subclass hasn\'t overridden it', function () {
      assert.throws(function () {
        var a = new Actor()
        a.move()
      }, NotImplementedError)
    })
  })
  context('takeDamage()', function () {
    it('throws a ParameterCountError if an amount isn\'t specified', function () {
      assert.throws(function () {
        var a = new Actor()
        a.takeDamage()
      }, ParameterCountError)
    })
    it('throws a TypeError if the amount specified isn\'t a number', function () {
      assert.throws(function () {
        var a = new Actor()
        a.takeDamage('amt')
      }, TypeError)
    })
    it('throws a SyntaxError if the amount specified isn\'t nonnegative', function () {
      assert.throws(function () {
        var a = new Actor()
        a.takeDamage(-15)
      }, SyntaxError)
    })
    it('decreases health as expected', function () {
      var a = new Actor()
      a.health = 10
      a.takeDamage(3)
      assert.equal(a.health, 7)
    })
    it('sets health to zero when the damage would cause negative health', function () {
      var a = new Actor()
      a.health = 10
      a.takeDamage(12)
      assert.equal(a.health, 0)
    })
    it('kills the actor if the health is zero', function () {
      var a = new Actor()
      a.health = 10
      assert.notEqual(a.hasOwnProperty('dead'))
      a.takeDamage(12)
      assert(a.hasOwnProperty('dead'))
    })
  })
})