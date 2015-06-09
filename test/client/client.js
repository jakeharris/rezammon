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
  context('render()', function () {
    
  })
})