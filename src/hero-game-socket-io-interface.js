var ParameterCountError = require('./errors').ParameterCountError

module.exports = new HeroGameSocketIOInterface()

function HeroGameSocketIOInterface () {
  'use strict';
  this.heroID = null
}

HeroGameSocketIOInterface.prototype.isHero = function (socketID) {
  'use strict';
  return socketID === this.heroID 
}
HeroGameSocketIOInterface.prototype.hasConnectedHero = function () {
  'use strict';
  return this.heroID !== null && this.heroID !== undefined
}
HeroGameSocketIOInterface.prototype.initializeHeroSocket = function (socket) {
  'use strict';
  if(socket === undefined)
    throw new ParameterCountError('Function requires a socket input.')
  if(typeof socket !== 'object' && !socket.emit)
    throw new TypeError('Function requires input to be a socket.io socket.')
    
  // how am I gonna test that this emit happened?
  // maybe I'm not. I'll just assume their code works
  // as long as it's "atomic" like this
  if(socket.emit) socket.emit('hero-connect') 
  this.heroID = socket.id
}