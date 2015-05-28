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
    game = require('./src/hero-game')(inter),
    port = normalizePort(process.env.PORT || '1107')

console.log(game)

// GAME STUFF
var heroID = null,
    players = 0

io.on('connection', function (socket) {
  'use strict';
  
  if(!hasConnectedHero(io))
    initializeHeroSocket(socket)

  io.emit('user-connect', {
    id: socket.id
  })
  
  game.addPlayer(socket.id)

  console.log('%%%%% NEW USER CONNECTED %%%%%')
  console.log('id: ' + socket.id)
  console.log('isHero function: ' + isHero)
  console.log('isHero? ' + isHero(socket))
  console.log('connected players: ' + io.engine.clientsCount)
  console.log()
  
  socket.on('disconnect', function (socket) {
    'use strict';
    console.log('disconnect')
    if(isHero(socket))
      heroID = null
      
    if(!hasConnectedHero()) {
      heroID = game.getHeroID()
      if(io.sockets.server.eio.clients[heroID] && io.sockets.server.eio.clients[heroID].emit) 
        initializeHeroSocket(io.sockets.server.eio.clients[heroID])
      else heroID = null
    }
  })
  
  socket.on('log-client-disconnect', function (socket) {
    'use strict';
    console.log('disconnecting via browser call')
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
