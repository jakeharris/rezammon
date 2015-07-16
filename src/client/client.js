// We're expecting socket.io and jQuery to
// already be loaded.
(function(exports) {
  'use strict';
  
  exports.Client = Client
  
  // singleton
  function Client(io) {
    if(!io) throw new SyntaxError('Client constructor requires a connection-managing object parameter')
    if(typeof io !== 'object') throw new TypeError('io parameter must be a connection managing object.')
    
    this.socket = io
    this.canvas = document.getElementById('c')
    this.c = this.canvas.getContext('2d')
    
    this.id = null
    this.isHero = false
    this.renderables = new Array(0)
    
    this.socket.on('player-connect', this.playerConnect.bind(this))
    this.socket.on('hero-connect', this.heroConnect.bind(this))
    this.socket.on('hero-connected', this.heroConnected.bind(this))
    this.socket.on('hero-disconnected', this.heroDisconnected.bind(this))
    this.socket.on('hero-moved', this.heroMoved.bind(this))
    this.socket.on('hero-health-changed', this.heroHealthChanged.bind(this))
    
    window.addEventListener('unload', function () {
      this.socket.disconnect()
    })
  }
  
  
  Client.prototype.playerConnect = function (data) {
    if(!data) throw new SyntaxError('No data object was given. All event handlers require a data object from the server.')
    if(typeof data !== 'object') throw new TypeError('data parameter wasn\'t an object. ' + data)
    if(data.id === undefined) throw new SyntaxError('Received a data object with no id, so we can\'t do our work.')
    
    this.id = data.id
    if(!this.isHero) {
      this.renderables.push(
        new Text({
          fillStyle: '#f64',
          text: 'u r not the hero',
          x: 100,
          y: 100
        })
      )
    }
    if(data.hero) {
      this.renderables.push(
        new FilledCircle({
          x: data.hero.x,
          y: data.hero.y,
          radius: 10,
          fillStyle: '#faaa42'
        })
      )
      this.renderables.push(
        new StatusBar({
          type: 'hero-health'
        })
      )
    }
    this.render()
    
    console.log('connected as ' + this.id)
  }
  Client.prototype.heroConnect = function () {
    this.isHero = true
    this.renderables.push(new Text({
        fillStyle: '#6f4',
        text: 'u r the hero',
        x: 100,
        y: 100
    }))
    for(var r in this.renderables) {
      if(this.renderables[r] instanceof Text)
        if(this.renderables[r].text === 'u r not the hero')
          this.renderables.splice(r, 1)
    }
    this.render()
    window.addEventListener('keydown', function (e) {
      var direction
      switch(e.keyCode) {
        case 37:
          direction = 'left'
          break
        case 38:
          direction = 'up'
          break
        case 39:
          direction = 'right'
          break
        case 40:
          direction = 'down'
          break
        default:
          return false
      }
      this.socket.emit('hero-move', { direction: direction })
    }.bind(this))
  }
  Client.prototype.heroConnected = function (data) {
    for(var r in this.renderables)
      if(this.renderables[r] instanceof Text)
        if(this.renderables[r].text === 'the hero just left.')
          this.renderables.splice(r, 1)
    this.render()
  }
  Client.prototype.heroDisconnected = function (data) {
    this.renderables.push(
      new Text({
        fillStyle: '#f64',
        text: 'the hero just left.', 
        x: 150, 
        y: 150
      })
    )
    for(var r in this.renderables)
      if(this.renderables[r] instanceof Text)
        if(this.renderables[r].text === 'the hero just arrived.')
          this.renderables.splice(r, 1)
    this.render()
  }
  Client.prototype.heroMoved = function (data) {
    if(!data || !data.x || !data.y) throw new SyntaxError()
    
    var moved = false
    for(var r in this.renderables)
      if(this.renderables[r] instanceof FilledCircle)
        if(this.renderables[r].radius === 10) {
          this.renderables[r].x = data.x
          this.renderables[r].y = data.y
          moved = true
        }
    this.render()
    return moved
  }
  Client.prototype.heroHealthChanged = function (data) {
    console.log('hero health changed')
    if(typeof data === 'undefined' || typeof data.old === 'undefined' || typeof data.new === 'undefined')
      throw new SyntaxError('heroHealthChanged() requires an object with properties \'old\' and \'new\' as a parameter.')
    if(typeof data.old !== 'number' || typeof data.new !== 'number')
      throw new TypeError('Old and new health values must both be numbers.')
      
    var changed = false
    for(var r in this.renderables)
      if(this.renderables[r] instanceof StatusBar)
        if(this.renderables[r].type === 'hero-health') {
          console.log('setting healthbar health to ' + data.old)
          this.renderables[r].current = data.new
          this.renderables[r].previous = data.old
          changed = true
        }
    this.render()
    return changed
  }
  Client.prototype.render = function (data) {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for(var r in this.renderables)
      if(this.renderables[r] instanceof Renderable)
        this.renderables[r].render(this.c)
  }

  
})(this)