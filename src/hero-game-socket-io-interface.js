module.exports = new HeroGameSocketIOInterface()

function HeroGameSocketIOInterface () {
  'use strict';

  // DATA
  this.heroID = null
}

// CONSTANTS
HeroGameSocketIOInterface.prototype.EVENTS = {
      HeroConnect: 'hero-connect',
      UserConnect: 'user-connect',
      Disconnect: 'disconnect'
};

// METHODS

HeroGameSocketIOInterface.prototype.onConnection = function (socket, io) {
  'use strict';
  if(!socket.hasBeenConfigured) {

    if(!this.hasConnectedHero())
      this.initializeHeroSocket(socket)

    io.emit(this.EVENTS.UserConnect, {
      id: socket.id
    })

    console.log('%%%%% NEW USER CONNECTED %%%%%')
    console.log('id: ' + socket.id)
    console.log('isHero? ' + this.isHero(socket))
    console.log()
    socket.hasBeenConfigured = true
  }


  // IMPORTANT
  // Always validate that whoever is claiming to be
  // the hero has the correct id.
  socket.on(this.EVENTS.Disconnect, function (socket) {
    this.disconnect(socket)
  })
}

HeroGameSocketIOInterface.prototype.disconnect = function (socket) {
  'use strict';
  console.log('disconnect')
  if(this.isHero(socket)) {
    this.heroID = null
  }
}

HeroGameSocketIOInterface.prototype.initializeHeroSocket = function (socket) {
  'use strict';
  socket.emit(this.EVENTS.HeroConnect)
  this.heroID = socket.id
}

HeroGameSocketIOInterface.prototype.hasConnectedHero = function () {
  'use strict';
  return this.heroID !== null && this.heroID !== undefined
}

HeroGameSocketIOInterface.prototype.isHero = function (socket) {
  'use strict';
  return socket.id === this.heroID
}
