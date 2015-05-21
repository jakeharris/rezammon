var app = require('express')(),
    port = normalizePort(process.env.PORT || '1107')

app.set('port', port)

var http = require('http').Server(app),
    io = require('socket.io')(http)

app.get('/', function (req, res) {
  'use strict';
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket){
  'use strict';
  
  var heroExists = false,
      heroID,
      numPlayers = 0,
      numObservers = 0
  
  // IMPORTANT
  // Always validate that whoever is claiming to be
  // the hero has the correct id.
  
  if(!socket.id) {
    socket.id = createHash('' + socket.handshake.address.address + new Date()) // should be some form of hash -- IP + join-timestamp checksum?
    if(!heroExists) {
      socket.isHero = true // this may turn into configuration for hero-related events
      heroExists = true
      heroID = socket.id
      socket.emit('hero-connect')
    } 
    else numObservers++
    numPlayers++
    io.emit('user-connect', socket.id)
    console.log('%%%%% NEW USER CONENCTED %%%%%')
    console.log('id: ' + socket.id)
    console.log('is hero? ' + socket.isHero)
    console.log()
    console.log('total number of players: ' + numPlayers)
    console.log('total number of observers: ' + numObservers)
    console.log()
    console.log()
  }
  socket.on('hero-move', function (heroID, x, y) {
    console.log(heroID + ' moves: (' + x + ', ' + y + ')')
    io.emit('hero-move', x, y)
  })
});

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

/* Thanks to @lordvlad for this! http://stackoverflow.com/a/15710692/2774085 */
function createHash(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}