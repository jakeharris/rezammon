'using strict';

module.exports = RezammonGame

var Player = require('./player'),
    ParameterCountError = require('../errors').ParameterCountError,
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

RezammonGame.prototype.getHeroID = function () {
  //TODO: flesh this out. needs to pick based on bias
  if(Object.keys(this.players).length < 1)
    throw new Error('No players are connected; choosing a hero is impossible.')
  if(!this.hero)
    return Object.keys(this.players)[0]
  else
    return this.hero.id
}
RezammonGame.prototype.move = function (direction) {
  if(!direction) throw new ParameterCountError('Asking the Hero to move requires a direction.')
  if(!this.getHero()) throw new MissingHeroError('There must be a Hero in order for the Hero to move.')
  switch(direction) {
    case 'left':
      this.hero.move('left')
      break
    case 'up':
      this.hero.move('up')
      break
    case 'right':
      this.hero.move('right')
      break
    case 'down':
      this.hero.move('down')
      break
    default:
      throw new TypeError('Invalid direction parameter supplied.')
  }
}
