// We're expecting socket.io and jQuery to
// already be loaded.
(function(exports) {
  'using strict';
  
  exports.Client = Client
  
  // singleton
  function Client(io) {
    if(!io) throw new SyntaxError('Client constructor requires a connection-managing object parameter')
    if(typeof io !== 'object') throw new TypeError('io parameter must be a constructor function (for a connection managing object).')
    
    var socket = io,
        canvas = document.getElementById('c'),
        c = canvas.getContext('2d'),
        id,
        isHero = false,
        renderables = []
    
    
    socket.on('player-connect', this.playerConnect)
    socket.on('hero-connect', this.heroConnect)
    socket.on('hero-connected', this.heroConnected)
    socket.on('hero-disconnected', this.heroDisconnected)
    
    window.addEventListener('unload', function () {
      socket.disconnect()
    })
  }
  
  
  Client.prototype.playerConnect = function (data) {
    id = data.id
    console.log('connected as ' + id)
    if(!isHero) {
      renderables.push(
        new Text({
          fillStyle: '#f64',
          text: 'u r not the hero',
          x: 100,
          y: 100
        })
      )
    }
    render()
  }
  Client.prototype.heroConnect = function (data) {
    isHero = true
    renderables.push(
      new Text({
        fillStyle: '#6f4',
        text: 'u r the hero',
        x: 100,
        y: 100
      })
    )
    for(var r in renderables) {
      if(renderables[r] instanceof Text)
        if(renderables[r].text === 'u r not the hero')
          renderables.splice(r, 1)
    }
    render()
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
      socket.emit('hero-move', { direction: direction })
    })
  }
  Client.prototype.heroConnected = function (data) {
    renderables.push(
      new FilledCircle({
        x: 50,
        y: 50,
        radius: 10,
        fillStyle: '#faaa42'
      })
    )
    for(var r in renderables)
      if(renderables[r] instanceof Text)
        if(renderables[r].text === 'the hero just left.')
          renderables.splice(r, 1)
    render()
  }
  Client.prototype.heroDisconnected = function (data) {
    renderables.push(
      new Text({
        fillStyle: '#f64',
        text: 'the hero just left.', 
        x: 150, 
        y: 150
      })
    )
    for(var r in renderables)
      if(renderables[r] instanceof Text)
        if(renderables[r].text === 'the hero just arrived.')
          renderables.splice(r, 1)
    render()
  }
  Client.prototype.render = function (data) {
    c.clearRect(0, 0, canvas.width, canvas.height)
    for(var r in renderables)
      if(renderables[r] instanceof Renderable)
        renderables[r].render(c)
  }
})(this)