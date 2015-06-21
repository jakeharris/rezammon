var assert = require('assert'),
    Controller = require('../../src/server/controller'),
    NotImplementedError = require('../../src/errors').NotImplementedError

describe('Controller', function () {
  context('createServerAdapter()', function () {
    it('throws a NotImplementedError if a subclass hasn\'t overridden it', function () {
      assert.throws(function () {
        var c = new Controller()
        c.createServerAdapter()
      }, NotImplementedError)
    })
  })
})