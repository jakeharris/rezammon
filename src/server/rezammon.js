'using strict';

module.exports = RezammonGame

var Player = require('./player'),
    Hero = require('./hero'),
    ParameterCountError = require('../errors').ParameterCountError,
    MissingHeroError = require('../errors').MissingHeroError,
    SocketIOAdapter = require('./socket-io-adapter'),
    SocketIOServer = require('socket.io'),
    Controller = require('./controller'),
    ServerAdapter = require('./server-adapter')


function RezammonGame (server) {
  Controller.call(this, server)
  
  this.players = []
  this.hero = null
  
  setInterval(function () {
    if(this.hero && this.hero.health) {
      this.server.emitHealth(this.hero.health - 1, this.hero.health)
      this.hero.takeDamage(1)
      if(this.hero.dead) {
        this.hero = null
        this.server.hasHero = false
      }
    }
  }.bind(this), 300)
  
  
}

RezammonGame.prototype = Object.create(Controller.prototype)
RezammonGame.prototype.constructor = RezammonGame
RezammonGame.prototype.createServerAdapter = function (server) {
  if(!server)
    throw new ParameterCountError('Game configuration requires a WebSockets implementation.')
  if(!(server instanceof SocketIOServer))
    throw new TypeError('Interface parameter not of supported type.\n'
                        + '\tSupported types include: \n' 
                        + '\t\t\u2022 SocketIOServer\n'
                        + '\n\tReceived ' + server.prototype)
    
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
  if(this.hero && this.hero.id)
    return this.hero.id
  else
    return this.chooseHero()
}
RezammonGame.prototype.chooseHero = function () {
  if(Object.keys(this.players).length < 1)
    throw new Error('No players are connected; choosing a hero is impossible.')
    
  var newHeroID = Math.floor(Math.random() * Object.keys(this.players).length)
  
  this.hero = new Hero(Object.keys(this.players)[newHeroID])

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
RezammonGame.prototype.giveHealth = function () {
  var numberOfObservers = Object.keys(this.players).length - 1,
      currentHealth = this.hero.health,
      maxHealth = this.hero.maxHealth

  // for now, we'll just say:
  // give the hero x health, 
  //   where x is 1/100th of his max health,
  //   divided by the number of observers.
  // this is obviously too much per click,
  //   but as long as we're just testing, 
  //   it should be fine.
  this.hero.heal(maxHealth / 100 / numberOfObservers)
  
  this.server.emitHealth(currentHealth)
}
