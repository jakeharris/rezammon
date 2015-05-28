module.exports = new HeroGameSocketIOInterface()

function HeroGameSocketIOInterface () {
  'use strict';

  // DATA
  this.heroID = null
  this.players = 0
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
  
}

HeroGameSocketIOInterface.prototype.disconnect = function (socket) {

}

HeroGameSocketIOInterface.prototype.initializeHeroSocket = function (socket) {
}

HeroGameSocketIOInterface.prototype.hasConnectedHero = function () {
  'use strict';
}

HeroGameSocketIOInterface.prototype.isHero = function (socket) {
  'use strict';
}
