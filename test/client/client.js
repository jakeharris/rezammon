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
      assert(sockstub.calledWith('player-connect'))
    })
    it('sets the hero-connect handler', function () {
      client = new Client(socket)
      assert(sockstub.calledWith('hero-connect'))
    })
    it('sets the hero-connected handler', function () {
      client = new Client(socket)
      assert(sockstub.calledWith('hero-connected'))
    })
    it('sets the hero-disconnected handler', function () {
      client = new Client(socket)
      assert(sockstub.calledWith('hero-disconnected'))
    })
  })
  context('on player-connect', function () {
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
      assert(console.log.calledWith('connected as 3'))
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
  context('on hero-connect', function () {
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
    it('sets itself as the hero', function () {
      assert(!client.isHero)
      client.heroConnect()
      assert(client.isHero)
    })
    it('hooks up the key listener', function () {
      sinon.spy(window, 'addEventListener')
      var c = window.addEventListener.callCount
      client.heroConnect()
      assert(window.addEventListener.callCount === c + 1)
      window.addEventListener.restore()
    })
  })
  context('on hero-moved', function () {
    it('throws a SyntaxError if no x or no y value is supplied', function () {
      assert.throws(function () {
        client.heroMoved()
      }, SyntaxError)
    })
    it('updates the Hero\'s position', function () {
      sinon.stub(console, 'log')
      client.playerConnect({ id: 'milieu', hero: { x: 1, y: 1 } })
      assert(client.heroMoved({ x: 3, y: 4 }))
      console.log.restore()
    })
  })
  context('on hero-health-changed', function () {
    it('throws a SyntaxError if no previous health value is supplied', function () {
      assert.throws(function () {
        client.heroHealthChanged()
      }, SyntaxError)
    })
    it('throws a SyntaxError if no new health value is supplied', function () {
      assert.throws(function () {
        client.heroHealthChanged({old: 30})
      }, SyntaxError)
    })
    it('throws a TypeError if either health value supplied is not a number', function () {
      assert.throws(function () {
        client.heroHealthChanged({ old: '30', new: 4 })
      }, TypeError)
      assert.throws(function () {
        client.heroHealthChanged({ old: 30, new: '4' })
      }, TypeError)
    })
    it('updates the Hero\'s health', function () {
      sinon.stub(console, 'log')
      client.playerConnect({ id: 'milieu', hero: { x: 1, y: 1 } })
      assert(client.heroHealthChanged({ old: 10, new: 9 }))
      console.log.restore()
    })
  })
})