var assert = require('assert'),
    Entity = require('../../src/server/entity'),
    Actor = require('../../src/server/actor'),
    NotImplementedError = require('../../src/errors').NotImplementedError

describe('Actor', function () {
  context('constructor', function () {
    it('has Entity in its prototype chain', function () {
      var a = new Actor()
      assert(a instanceof Entity)
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
})