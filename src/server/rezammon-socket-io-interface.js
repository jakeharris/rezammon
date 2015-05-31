'using strict';

module.exports = RezammonSocketIOInterface

var ParameterCountError = require('../errors').ParameterCountError,
    ConfiguredHeroError = require('../errors').ConfiguredHeroError,
    MissingHeroError = require('../errors').MissingHeroError

function RezammonSocketIOInterface () {
  this.heroID = null
  this.playersToAdd = 0
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
RezammonSocketIOInterface.prototype.addPlayer = function (id) {
  if(!game || !id) throw new ParameterCountError()
  if(!(game instanceof RezammonGame)) throw new TypeError()
  if(!(typeof id === 'string')) throw new TypeError()
  
  this.playersToAdd++
}
