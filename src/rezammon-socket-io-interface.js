'using strict';
var ParameterCountError = require('./errors').ParameterCountError,
    ConfiguredHeroError = require('./errors').ConfiguredHeroError,
    MissingHeroError = require('./errors').MissingHeroError,
    RezammonGame = require('./rezammon')


function RezammonSocketIOInterface () {
  this.heroID = null
}

RezammonSocketIOInterface.prototype.hasConnectedHero = function () {
  return this.heroID !== null && this.heroID !== undefined
}
RezammonSocketIOInterface.prototype.setHero = function (id) {
  if(this.hasConnectedHero()) throw new ConfiguredHeroError()
  this.heroID = id
}
RezammonSocketIOInterface.prototype.isHero = function (id) {
  if(!id) throw new ParameterCountError()
  if(!(typeof id === 'string')) throw new TypeError()
  if(!this.hasConnectedHero()) throw new MissingHeroError()
  
  return this.heroID === id
}
RezammonSocketIOInterface.prototype.addPlayerTo = function (game, id) {
  if(!game || !id) throw new ParameterCountError()
  if(!(game instanceof RezammonGame)) throw new TypeError()
  if(!(typeof id === 'string')) throw new TypeError()
  
  game.addPlayer(id)
}

module.exports = RezammonSocketIOInterface