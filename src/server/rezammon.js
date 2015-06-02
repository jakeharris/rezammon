'using strict';

module.exports = RezammonGame

var Player = require('./player'),
    ParameterCountError = require('../errors').ParameterCountError,
    SocketIOAdapter = require('./socket-io-adapter'),
    SocketIOServer = require('socket.io'),
    Controller = require('./controller')


function RezammonGame (server) {
  Controller.call(this, server)
  
  this.heroID = null
  this.players = []
}

RezammonGame.prototype = Object.create(Controller.prototype)
RezammonGame.prototype.constructor = RezammonGame

RezammonGame.prototype.getHeroID = function () {
  if(!this.server.hasConnectedHero()) {
    // pick one, set it, and return that
    this.heroID = this.chooseHero().getID()
  }
  return this.heroID
}

RezammonGame.prototype.chooseHero = function () {
  //TODO: flesh this out. needs to pick based on bias
  if(this.players.length < 1)
    throw new Error('No players are connected; choosing a hero is impossible.')
  return this.players[0]
}

RezammonGame.prototype.addPlayer = function (id) {
  this.players.push(new Player(id))
}

RezammonGame.prototype.createServerAdapter = function (server) {
  if(server === undefined)
    throw new ParameterCountError('Rezammon configuration requires a WebSockets implementation.')
  if(!(server instanceof SocketIOServer))
    throw new TypeError('Interface parameter not of expected type; expected ' 
                        + SocketIOServer + ', received ' + server)
    
  switch(server.constructor.name) {
    case 'Server': // socket.io
      return new SocketIOAdapter(server, this)
      break
    default:
      throw new TypeError('Failed to create server adapter from server object ' + server.constructor.toString())
      break
  }
}