var app = require('express')(),
    port = normalizePort(process.env.PORT || '1107'),
    game = require('hero-game'),
    interface = require('hero-game-socket-io-interface')

app.set('port', port)

var http = require('http').Server(app),
    io = require('socket.io')(http)

app.get('/', function (req, res) {
  'use strict';
  res.sendFile(__dirname + '/index.html')
});



io.on('connection', function(socket){
  'use strict';
  
  
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