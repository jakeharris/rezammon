module.exports = new HeroGameSocketIOInterface()

function HeroGameSocketIOInterface () {
  'use strict';
  this.heroID = null
}

HeroGameSocketIOInterface.prototype.isHero = function (socket) {
  'use strict';
  return socket.id === heroID 
}
HeroGameSocketIOInterface.prototype.hasConnectedHero = function () {
  'use strict';
  var heroSocket = io.sockets.server.eio.clients[heroID]
  if(heroSocket === undefined)
    heroID = null
  return heroID !== null && heroID !== undefined
}
HeroGameSocketIOInterface.prototype.initializeHeroSocket = function (socket) {
  'use strict';
  socket.emit('hero-connect')
  heroID = socket.id
}