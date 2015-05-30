var express = require('express')

app = express()
app.use('/bower_components', express.static(__dirname + '/bower_components'))
app.get('/', function (req, res) {
  'use strict';
  res.sendFile(__dirname + '/index.html')
})

var http = require('http').Server(app),
    io = require('socket.io')(http),
    inter = require('./src/hero-game-socket-io-interface'),
    HeroGame = require('./src/hero-game'),
    game = new HeroGame(inter),
    port = normalizePort(process.env.PORT || '1107')

console.log(game)

io.on('connection', function (socket) {
  'use strict';
  
  if(!hasConnectedHero(inter))
    initializeHeroSocket(socket)

  io.emit('user-connect', {
    id: socket.id
  })
  
  game.addPlayer(socket.id)

  console.log('%%%%% NEW USER CONNECTED %%%%%')
  console.log('id: ' + socket.id)
  console.log('isHero? ' + isHero(socket.id))
  console.log('connected players: ' + io.engine.clientsCount)
  console.log()
  
  socket.on('disconnect', function (socket) {
    'use strict';
    console.log('disconnect')
    if(isHero(socket.id))
      heroID = null
      
    if(!hasConnectedHero()) {
      heroID = game.getHeroID()
      if(io.sockets.server.eio.clients[heroID] && io.sockets.server.eio.clients[heroID].emit) 
        initializeHeroSocket(io.sockets.server.eio.clients[heroID])
      else heroID = null
    }
  })
  
})


http.listen(port, function () {
  'use strict';
  console.log('listening on *:' + port)
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  'use strict';

  var port = parseInt(val, 10)

  if (isNaN(port))
    // named pipe
    return val

  if (port >= 0)
    // port number
    return port

  return false
}
