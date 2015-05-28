var app = require('express')(),
    port = normalizePort(process.env.PORT || '1107'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    inter = require('./src/hero-game-socket-io-interface'),
    game = require('./src/hero-game')(inter)


app.get('/', function (req, res) {
  'use strict';
  res.sendFile(__dirname + '/index.html')
})

console.log(game)

// GAME STUFF
var heroID = null,
    players = 0

io.on('connection', function (socket) {
  'use strict';
  
  if(!hasConnectedHero())
    initializeHeroSocket(socket);

  io.emit('user-connect', {
    id: socket.id
  })

  players++

  console.log('%%%%% NEW USER CONNECTED %%%%%')
  console.log('id: ' + socket.id)
  console.log('isHero function: ' + isHero)
  console.log('isHero? ' + isHero(socket))
  console.log('connected players: ' + players)
  console.log()
  
  socket.on('disconnect', function (socket) {
    'use strict';
    console.log('disconnect')
    if(isHero(socket))
      heroID = null

    players--
  })
  
})

function isHero(socket) {
  'use strict';
  return socket.id === heroID 
}
function hasConnectedHero() {
  'use strict';
  return heroID !== null && heroID !== undefined
}
function initializeHeroSocket(socket) {
  'use strict';
  socket.emit('hero-connect')
  heroID = socket.id
}

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

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
