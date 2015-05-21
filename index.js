var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = normalizePort(process.env.PORT || '1107');


app.set('port', port);

app.get('/', function (req, res) {
  'use strict';
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket){
  'use strict';
  socket.on('chat message', function (msg) {
    console.log(msg)
    io.emit('chat message', msg)
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