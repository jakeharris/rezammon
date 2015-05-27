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

io.on('connection', function (socket) {
  'use strict';
  inter.onConnection(socket, io)
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
