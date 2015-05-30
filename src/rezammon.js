var Player = require('./player'),
    ParameterCountError = require('./errors').ParameterCountError,
    RezammonSocketIOInterface = require('./rezammon-socket-io-interface')

module.exports = Rezammon

function Rezammon (face) {
  'use strict';

  if(face === undefined)
    throw new ParameterCountError('Rezammon configuration requires an interface with the WebSockets implementation.')
  if(!(face instanceof RezammonSocketIOInterface.constructor))
    throw new TypeError('Interface parameter not of expected type; expected RezammonSocketIOInterface, received ' + face.constructor)
    
  this.players = []
  this.inter = face
  this.heroID = null
}

Rezammon.prototype.getHeroID = function () {
  'use strict';
  if(!this.inter.hasConnectedHero()) {
    // pick one, set it, and return that
    this.heroID = this.chooseHero().getID()
  }
  return this.heroID
}

Rezammon.prototype.chooseHero = function () {
  'use strict';
  //TODO: flesh this out. needs to pick based on bias
  return this.players[0]
}

Rezammon.prototype.addPlayer = function (id) {
  'use strict';
  this.players.push(new Player(id))
}
