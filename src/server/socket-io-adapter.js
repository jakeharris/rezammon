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
    this.heroID = null
  }
}
SocketIOAdapter.prototype.isHero = function (id) {
  if(!id) throw new ParameterCountError()
  if(!(typeof id === 'string')) throw new TypeError()
  
  return this.heroID === id
}
SocketIOAdapter.prototype.addPlayer = function (id) {
  if(!id) throw new ParameterCountError()
  if(!(typeof id === 'string')) throw new TypeError()
  
  this.game.players[id] = (new Player(id))
  return Object.keys(this.game.players).length
}
SocketIOAdapter.prototype.removePlayer = function (id) {
  if(!id) throw new ParameterCountError('No ID was supplied.')
  if(typeof id !== 'string') throw new TypeError('ID supplied was not a string')
  if(Object.keys(this.game.players).length < 1) throw new RangeError('No players are connected.')
  if(!this.game.players[id]) throw new RangeError('No player exists with id: ' + id + '.')
  
  delete this.game.players[id]
  return Object.keys(this.game.players).length
}
SocketIOAdapter.prototype.emitHealth = function (health, maxHealth) {
  if(health === null || health === undefined) throw new ParameterCountError('emitHealth() requires a health parameter. Received: ' + health)
  if(!(typeof health === 'number')) throw new TypeError()
  if(maxHealth && typeof maxHealth !== 'number') throw new TypeError()
  if(!maxHealth) maxHealth = 10
  
  var opts = {
    maxHealth: maxHealth,
    health: (health >= 0) ? health : 0
  }
  
  this.server.emit('hero-health-changed', opts)
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
      this.setHero(this.getHeroID())
      
    var opts = {
      id: socket.id 
    }
    if(this.hasConnectedHero()) {
      opts.hero = {
        x: this.game.hero.x,
        y: this.game.hero.y
      }
    }
    socket.emit('player-connect', opts)
    this.server.emit('player-connected')
    
    // print server console data
    console.log('%%%%% USER CONNECTED %%%%%')
    console.log('id: ' + socket.id)
    console.log('isHero: ' + this.isHero(socket.id))
    console.log('players: ')
    for(var p in this.server.sockets.connected)
      console.log(p)
    console.log()
    
    /// configure the socket to respond to 
    /// events from the client and other
    /// sockets
    socket.on('disconnect', function () {
      console.log('%%%%% USER DISCONNECTED %%%%%')
      console.log('id: ' + socket.id)
      console.log('isHero: ' + this.isHero(socket.id))
      
      try {
        this.removePlayer(socket.id)
      } catch(e) { 
        console.error(e.message)
      } // should perhaps ensure that the player is no longer listed?
      
      if(this.isHero(socket.id)) {
        this.heroID = null
        this.game.hero.id =  null
        this.server.emit('hero-disconnected')
      }
      
      console.log('hero post-disconnect: ' + this.getHeroID())
      console.log()
      
      if(!this.hasConnectedHero()) 
        this.setHero(this.getHeroID())
          
      this.server.emit('player-disconnected')
    }.bind(this, socket))
    
    socket.on('hero-move', function (socket, data) {
      try {
        if(!this.isHero(socket.id))
          throw new ConfiguredHeroError(
            'The player requesting to move is not the configured Hero.'
            + '(Hero ID: ' + this.getHeroID() + ', '
            + 'player ID: ' + socket.id + '.)')
        else {
          this.game.move(data.direction)
          this.server.emit('hero-moved', { x: this.game.hero.x, y: this.game.hero.y })
        }
      }
      catch (e) {
        console.error(e.message)
        return
      }
      
      
    }.bind(this, socket))
  }.bind(this))
}
SocketIOAdapter.prototype.getSocket = function (id) {
  if(!this.server.sockets.connected[id])
    throw new SocketNotConnectedError('SocketNotConnectedError: getSocket(' + id + ') couldn\'t find socket @ ' + id + '.')
  return this.server.sockets.connected[id]
}
SocketIOAdapter.prototype.getHeroID = function () {
  var id
  if(!this.hasConnectedHero())
    try {
      id = this.game.getHeroID()
      return id
    }
    catch (e) {
      console.error(e.message)
      return null
    }
  else return this.heroID
}
