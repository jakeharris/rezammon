var assert = require('assert'),
    Entity = require('../../src/server/entity')

describe('Entity', function () {
  context('constructor', function () {
    it('throws a TypeError if the opts parameter isn\'t an object', function () {
      var opts = 3
      assert.throws(function () {
        var e = new Entity(opts)
      }, TypeError)
    })
    it('sets x and y as 0 if nothing was supplied', function () {
      var e = new Entity()
      assert(e.x === 0)
      assert(e.y === 0)
    })
    it('sets x and y properly if something was supplied', function () {
      var opts = {
        x: 3 
      }
      var e = new Entity(opts)
      assert(e.x === opts.x)
      assert(e.y === 0)
      
      opts = {
        x: 1,
        y: 15
      }
      e = new Entity(opts)
      assert(e.x === opts.x)
      assert(e.y === opts.y)
    })
  })
})
