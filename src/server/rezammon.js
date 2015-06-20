'using strict';

module.exports = RezammonGame

var Player = require('./player'),
    Hero = require('./hero'),
    ParameterCountError = require('../errors').ParameterCountError,
    MissingHeroError = require('../errors').MissingHeroError,
    SocketIOAdapter = require('./socket-io-adapter'),
    SocketIOServer = require('socket.io'),
    Controller = require('./controller')


function RezammonGame (server) {
  Controller.call(this, server)
  
  this.players = []
  this.hero = null
}

RezammonGame.prototype = Object.create(Controller.prototype)
RezammonGame.prototype.constructor = RezammonGame
RezammonGame.prototype.createServerAdapter = function (server) {
  if(!server)
    throw new ParameterCountError('Rezammon configuration requires a WebSockets implementation.')
  if(!(server instanceof SocketIOServer))
    throw new TypeError('Interface parameter not of supported type.\n'
                        + 'Supported types include: \n' 
                        + '\t\u2022 ' + SocketIOServer + '\n'
                        + ', received ' + server)
    
  switch(server.constructor.name) {
    case 'Server': // socket.io
      return new SocketIOAdapter(server, this)
      break
    default:
      throw new TypeError('Failed to create server adapter from server object ' + server.constructor.toString())
      break
  }
}

RezammonGame.prototype.getHeroID = function () {
  //TODO: flesh this out. needs to pick based on bias
  if(Object.keys(this.players).length < 1)
    throw new Error('No players are connected; choosing a hero is impossible.')
  if(!this.hero)
    return this.chooseHero()
  else
    return this.hero.id
}
RezammonGame.prototype.chooseHero = function () {
  if(Object.keys(this.players).length < 1)
    throw new Error('No players are connected; choosing a hero is impossible.')
  
  this.hero = new Hero(Object.keys(this.players)[0])
    
  return this.hero.id
}
RezammonGame.prototype.move = function (direction, actorID) {
  if(!direction) throw new ParameterCountError('Asking the Hero to move requires a direction.')
  if(!actorID && !this.hero) throw new MissingHeroError('There must be a Hero in order for the Hero to move.')
  if(actorID && typeof actorID !== 'string') throw new TypeError('The Actor ID must be a string.')
  
  if(actorID) {
    if(this.players.length < 1) throw new RangeError('Players must be exist in order for one to move.')
    if(!this.players[actorID]) throw new RangeError('The Actor ID must belong to an extant Player.')
    /* actor.move() */
  }
  else this.hero.move(direction)
}
