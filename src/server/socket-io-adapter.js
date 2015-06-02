'using strict';
module.exports = SocketIOAdapter

var ServerAdapter = require('./server-adapter'),
    SocketIOServer = require('socket.io'),
    RezammonGame = require('./rezammon'),
    Player = require('./player'),
    ParameterCountError = require('../errors').ParameterCountError,
    ConfiguredHeroError = require('../errors').ConfiguredHeroError,
    MissingHeroError = require('../errors').MissingHeroError,
    SocketNotConnectedError = require('../errors').SocketNotConnectedError

function SocketIOAdapter (io, game, testing) {
  if(!io || !game) 
    throw new ParameterCountError()
  if(!(io instanceof SocketIOServer) || !(game instanceof RezammonGame))
    throw new TypeError()
    
  ServerAdapter.call(this, io, game)
  
  this.heroID = null
  this.players = []
  this.game = this.controller // rational alias
  this.isTesting = (testing) ? testing : false
  
  this.configureServer()
}

SocketIOAdapter.prototype = Object.create(ServerAdapter.prototype)
SocketIOAdapter.prototype.constructor = SocketIOAdapter

SocketIOAdapter.prototype.hasConnectedHero = function () {
  return this.heroID !== null && this.heroID !== undefined
}
SocketIOAdapter.prototype.setHero = function (id) {
  if(this.hasConnectedHero()) throw new ConfiguredHeroError()
  this.heroID = id
  try {
    this.getSocket(this.heroID).emit('hero-connect')
    this.server.emit('hero-connected')
  }
  catch (e) {
    if(!this.isTesting) console.error(e.message)
  }
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
  
  this.game.players.push(new Player(id))
  try {
    this.getSocket(id).emit('player-connect')
    this.server.emit('player-connected')
  }
  catch (e) {
    if(!this.isTesting) console.error(e.message)
  }
  finally {
    return this.game.players.length
  }
}
SocketIOAdapter.prototype.configureServer = function () {
  this.server.on('connection', function (socket) {
    'use strict';
    
    /// ask interface to inform the game of the
    /// new player
    this.addPlayer(socket.id)
    
    /// ask interface to determine if we need
    /// a hero, and assign one if necessary
    if(!this.hasConnectedHero())
      this.setHero(this.game.getHeroID())
    
    
    /// configure the socket to respond to 
    /// events from the client and other
    /// sockets
    
  }.bind(this))
}
SocketIOAdapter.prototype.getSocket = function (id) {
  if(!this.server.sockets.connected[id])
    throw new SocketNotConnectedError('SocketNotConnectedError: getSocket(' + id + ') couldn\'t find socket @ ' + id + '.')
  return this.server.sockets.connected[id]
}
SocketIOAdapter.prototype.onConnection = function (socket) {
  
}.bind(this)
