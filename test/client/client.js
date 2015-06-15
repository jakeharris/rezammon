var socket = io()

describe('Client', function () {
  context('constructor', function () {
    before(function () {
      var client, sockstub
    })
    beforeEach(function () {
      sockstub = sinon.stub(socket, 'on')
    })
    afterEach(function () {
      sockstub.restore()
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
      client = new Client(socket)
      assert(sockstub.calledWithExactly('player-connect', client.playerConnect))
    })
    it('sets the hero-connect handler', function () {
      client = new Client(socket)
      assert(sockstub.calledWithExactly('hero-connect', client.heroConnect))
    })
    it('sets the hero-connected handler', function () {
      client = new Client(socket)
      assert(sockstub.calledWithExactly('hero-connected', client.heroConnected))
    })
    it('sets the hero-disconnected handler', function () {
      client = new Client(socket)
      assert(sockstub.calledWithExactly('hero-disconnected', client.heroDisconnected))
    })
  })
  context('on: player-connect', function () {
    before(function () {
      var client, sockstub
    })
    beforeEach(function () {
      sockstub = sinon.stub(socket, 'on')
      
      client = new Client(socket)
    })
    afterEach(function () {
      sockstub.restore()
    })
    it('throws a SyntaxError if nothing was passed', function () {
      sinon.stub(console, 'log')
      assert.throws(function () {
        client.playerConnect()
      }, SyntaxError)
      console.log.restore()
    })
    it('throws a TypeError if the passed value is not an object', function () {
      sinon.stub(console, 'log')
      assert.throws(function () {
        client.playerConnect(3)
      }, TypeError)
      console.log.restore()
    })
    it('throws a SyntaxError if an object is passed, but its id value isn\'t set', function () {
      sinon.stub(console, 'log')
      assert.throws(function () {
        client.playerConnect({ name: '32' })
      }, SyntaxError)
      console.log.restore()
    })
    it('prints the id if it gets one', function () {
      sinon.stub(console, 'log')
      var c = console.log.callCount
      client.playerConnect({ id: '3' })
      assert(console.log.callCount === c + 1)
      assert(console.log.calledWith, 'connected as 3')
      console.log.restore()
    })
    it('pushes a Text object to renderables if the player isn\'t the Hero', function () {
      sinon.stub(console, 'log')
      assert(client.renderables.length == 0)
      client.playerConnect({ id: '3' })
      console.log(client.renderables)
      assert(client.renderables.length > 0)
      console.log.restore()
    })
    it('renders everything', function () {
      sinon.stub(console, 'log')
      sinon.spy(client, 'render')
      client.playerConnect({ id: '3' })
      assert(client.render.calledOnce)
      console.log.restore()
    })
  })
  context('on: hero-connect', function () {

  })
})