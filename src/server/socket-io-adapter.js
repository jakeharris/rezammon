'using strict';
module.exports = SocketIOAdapter

var ServerAdapter = require('./server-adapter'),
    SocketIOServer = require('socket.io'),
    RezammonGame = require('./rezammon'),
    ParameterCountError = require('../errors').ParameterCountError,
    ConfiguredHeroError = require('../errors').ConfiguredHeroError,
    MissingHeroError = require('../errors').MissingHeroError

function SocketIOAdapter (io, game) {
  if(!io || !game) 
    throw new ParameterCountError()
  if(!(io instanceof SocketIOServer) || !(game instanceof RezammonGame))
    throw new TypeError()
    
  ServerAdapter.call(this, io, game)
  
  this.heroID = null
  this.players = []
  this.game = this.controller // rational alias
}

SocketIOAdapter.prototype = Object.create(ServerAdapter.prototype)
SocketIOAdapter.prototype.constructor = SocketIOAdapter

SocketIOAdapter.prototype.hasConnectedHero = function () {
  return this.heroID !== null && this.heroID !== undefined
}
SocketIOAdapter.prototype.setHero = function (id) {
  if(this.hasConnectedHero()) throw new ConfiguredHeroError()
  this.heroID = id
}
SocketIOAdapter.prototype.isHero = function (id) {
  if(!id) throw new ParameterCountError()
  if(!(typeof id === 'string')) throw new TypeError()
  if(!this.hasConnectedHero()) throw new MissingHeroError()
  
  return this.heroID === id
}
SocketIOAdapter.prototype.addPlayer = function (id) {
  if(!id) throw new ParameterCountError()
  if(!(typeof id === 'string')) throw new TypeError()
  
  this.players.push(new Player(id))
  return this.players.length
}
