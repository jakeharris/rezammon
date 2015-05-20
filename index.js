var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = 1107

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