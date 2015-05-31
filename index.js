'using strict';
var express = require('express')

app = express()
app.use('/bower_components', express.static(__dirname + '/bower_components'))
app.use('/src/client', express.static(__dirname + '/src/client'))
app.get('/', function (req, res) {
  'use strict';
  res.sendFile(__dirname + '/index.html')
})

var http = require('http').Server(app),
    io = require('socket.io')(http),
    RezammonGame = require('./src/server/rezammon'),
    RezammonSocketIOInterface = require('./src/server/rezammon-socket-io-interface');

var inter = new RezammonSocketIOInterface(),
    game = new RezammonGame(inter),
    port = normalizePort(process.env.PORT || '1107')

console.log(game)

io.on('connection', function (socket) {
  'use strict';
  
  // all of the following should be in one
  // interface call:
  
  /// ask interface to determine if we need
  /// a hero, and assign one if necessary
  
  /// ask interface to inform the game of the
  /// new player
  
  /// configure the socket to respond to 
  /// events from the client and other
  /// sockets
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
