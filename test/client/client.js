var socket = io()

describe('Client', function () {
  context('constructor', function () {
    before(function () {
      var sandbox, client
    })
    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      
      sandbox.stub()
      sandbox.stub(socket, 'on')
      client = new Client(socket)
    })
    afterEach(function () {
      sandbox.restore()
    })
    it('throws a SyntaxError if nothing was passed', function () {
      assert.throws(function () {
        client = new Client()
      }, SyntaxError)
    })
    it('throws a TypeError if the passed socket value was not a connection-managing object', function () {
      assert.throws(function () {
        client = new Client(3)
      }, TypeError)
    })
    it('sets the player-connect handler', function () {
      sinon.assert.calledWithExactly(socket.on, 'player-connect', client.playerConnect)
    })
    it('sets the hero-connect handler', function () {
      sinon.assert.calledWithExactly(socket.on, 'hero-connect', client.heroConnect)
    })
    it('sets the hero-connected handler', function () {
      sinon.assert.calledWithExactly(socket.on, 'hero-connected', client.heroConnected)
    })
    it('sets the hero-disconnected handler', function () {
      sinon.assert.calledWithExactly(socket.on, 'hero-disconnected', client.heroDisconnected)
    })
  })
  context('handlers', function () {
    before(function () {
      var sandbox, client
    })
    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      
      sandbox.stub()
      sandbox.stub(socket, 'on')
      sandbox.stub(console, 'log')
      client = new Client(socket)
    })
    afterEach(function () {
      sandbox.restore()
    })
    context('player-connect', function () {
      it('throws a SyntaxError if nothing was passed', function () {
        assert.throws(function () {
          client.playerConnect()
        }, SyntaxError)
      })
      it('throws a TypeError if the passed value is not an object', function () {
        assert.throws(function () {
          client.playerConnect(3)
        }, TypeError)
      })
      it('throws a SyntaxError if an object is passed, but its id value isn\'t set', function () {
        assert.throws(function () {
          client.playerConnect({ name: '32' })
        }, SyntaxError)
      })
      it('prints the id if it gets one', function () {
        client.playerConnect({ id: '3' })
        sinon.assert.calledOnce(console.log)
        sinon.assert.calledWith(console.log, '3')
      })
      it('pushes a Text object to renderables if the player isn\'t the Hero', function () {
        assert(client.renderables.length == 0)
        client.playerConnect({ id: '3' })
        assert(client.renderables.length > 0)
      })
      it('renders everything', function () {
        sinon.spy(client.render)
        client.playerConnect({ id: '3' })
        sinon.assert.calledOnce(client.render)
      })
    })
  })
  context('render()', function () {
    
  })
})