// We're expecting socket.io and jQuery to
// already be loaded.
(function(exports) {
  'using strict';
  
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
    
    this.socket.on('player-connect', this.playerConnect)
    this.socket.on('hero-connect', this.heroConnect)
    this.socket.on('hero-connected', this.heroConnected)
    this.socket.on('hero-disconnected', this.heroDisconnected)
    
    window.addEventListener('unload', function () {
      this.socket.disconnect()
    })
  }
  
  
  Client.prototype.playerConnect = function (data) {
    if(!data) throw new SyntaxError('No data object was given. All event handlers require a data object from the server.')
    if(typeof data !== 'object') throw new TypeError('data parameter wasn\'t an object. ' + data)
    if(data.id === undefined) throw new SyntaxError('Received a data object with no id, so we can\'t do our work.')
    this.id = data.id
    console.log('connected as ' + this.id)
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
    this.render()
  }
  Client.prototype.heroConnect = function (data) {
    this.isHero = true
    var text = new Text({
        fillStyle: '#6f4',
        text: 'u r the hero',
        x: 100,
        y: 100
    })
    this.renderables.push(text)
    for(var r in this.renderables) {
      if(this.renderables[r] instanceof Text)
        if(this.renderables[r].text === 'u r not the hero')
          this.renderables.splice(r, 1)
    }
    this.render()
    $(window).on('keydown', function (e) {
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
    this.renderables.push(
      new FilledCircle({
        x: 50,
        y: 50,
        radius: 10,
        fillStyle: '#faaa42'
      })
    )
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
  Client.prototype.render = function (data) {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for(var r in this.renderables)
      if(this.renderables[r] instanceof Renderable)
        this.renderables[r].render(this.c)
  }
  
  Client.prototype.playerConnect
  Client.prototype.heroConnect
  Client.prototype.heroConnected
  Client.prototype.heroDisconnected
  Client.prototype.render
})(this)