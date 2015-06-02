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
    RezammonGame = require('./src/server/rezammon')

var game = new RezammonGame(io),
    port = normalizePort(process.env.PORT || '1107')


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
