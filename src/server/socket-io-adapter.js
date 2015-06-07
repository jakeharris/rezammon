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
  return this.game.players.length
}
SocketIOAdapter.prototype.removePlayer = function (id) {
  this.game.removePlayer(id)
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
    
    socket.emit('player-connect', { id: socket.id })
    this.server.emit('player-connected')
    
    // print server console data
    console.log('%%%%% USER CONNECTED %%%%%')
    console.log('id: ' + socket.id)
    console.log('isHero: ' + this.isHero(socket.id))
    console.log('players: ' + this.server.sockets.connected.length)
    console.log()
    
    /// configure the socket to respond to 
    /// events from the client and other
    /// sockets
    socket.on('disconnect', function () {
      if(this.isHero(socket.id)) {
        this.heroID =  null
        this.server.emit('hero-disconnected')
      }
      
      this.removePlayer(socket.id)
        
      if(!this.hasConnectedHero()) 
        this.setHero(this.getHeroID())
        
      this.server.emit('player-disconnected')
      console.log('disconnect')
    }.bind(this, socket))
    
    socket.on('hero-move', function (data) {
      try {
        if(!this.isHero(socket.id))
          throw new ConfiguredHeroError(
            'The player requesting to move is not the configured Hero.'
            + '(Hero ID: ' + this.getHeroID() + ', '
            + 'player ID: ' + socket.id + '.)')
        else {
          this.game.move(data.direction)
          this.server.emit('hero-moved', this.game.getHeroLocation())
        }
      }
      catch (e) {
        console.error(e.message)
        return
      }
      
      
    })
    
  }.bind(this))
}
SocketIOAdapter.prototype.getSocket = function (id) {
  if(!this.server.sockets.connected[id])
    throw new SocketNotConnectedError('SocketNotConnectedError: getSocket(' + id + ') couldn\'t find socket @ ' + id + '.')
  return this.server.sockets.connected[id]
}
SocketIOAdapter.prototype.getHeroID = function () {
  if(!this.hasConnectedHero())
    return this.game.chooseHero()
  else return this.heroID
}
