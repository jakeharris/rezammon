var Player = require('./player'),
    ParameterCountError = require('./errors').ParameterCountError,
    HeroGameSocketIOInterface = require('./hero-game-socket-io-interface')

module.exports = HeroGame

function HeroGame (face) {
  'use strict';

  if(face === undefined)
    throw new ParameterCountError('HeroGame configuration requires an interface with the WebSockets implementation.')
  if(!(face instanceof HeroGameSocketIOInterface.constructor))
    throw new TypeError('Interface parameter not of expected type; expected HeroGameSocketIOInterface, received ' + face.constructor)
    
  this.players = []
  this.inter = face
  this.heroID = null
}

HeroGame.prototype.getHeroID = function () {
  'use strict';
  if(!this.inter.hasConnectedHero()) {
    // pick one, set it, and return that
    this.heroID = this.chooseHero().getID()
  }
  return this.heroID
}

HeroGame.prototype.chooseHero = function () {
  'use strict';
  //TODO: flesh this out. needs to pick based on bias
  return this.players[0]
}

HeroGame.prototype.addPlayer = function (id) {
  'use strict';
  this.players.push(new Player(id))
}
