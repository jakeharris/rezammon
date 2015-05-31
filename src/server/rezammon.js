'using strict';

module.exports = RezammonGame

var Player = require('./player'),
    ParameterCountError = require('../errors').ParameterCountError,
    RezammonSocketIOInterface = require('./rezammon-socket-io-interface')

function RezammonGame (face) {
  if(face === undefined)
    throw new ParameterCountError('Rezammon configuration requires an interface with the WebSockets implementation.')
  if(!(face instanceof RezammonSocketIOInterface))
    throw new TypeError('Interface parameter not of expected type; expected ' 
                        + RezammonSocketIOInterface + ', received ' + face)
    
  this.players = []
  this.inter = face
  this.heroID = null
}

RezammonGame.prototype.getHeroID = function () {
  if(!this.inter.hasConnectedHero()) {
    // pick one, set it, and return that
    this.heroID = this.chooseHero().getID()
  }
  return this.heroID
}

RezammonGame.prototype.chooseHero = function () {
  //TODO: flesh this out. needs to pick based on bias
  return this.players[0]
}

RezammonGame.prototype.addPlayer = function (id) {
  this.players.push(new Player(id))
}
