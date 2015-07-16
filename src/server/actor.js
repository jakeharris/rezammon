'using strict';

module.exports = Actor

var Entity = require('./entity'),
    NotImplementedError = require('../errors').NotImplementedError,
    ParameterCountError = require('../errors').ParameterCountError

function Actor (opts) {
  if(!opts) opts = {}
  if(typeof opts !== 'object') throw new TypeError('Actors only take an options object as a parameter.')
  
  Entity.call(this, opts)
  
  this.health = 10
}

Actor.prototype = Object.create(Entity.prototype)
Actor.prototype.constructor = Actor

Actor.prototype.move = function () {
  throw new NotImplementedError('Actor is not intended to be implemented '
                                + 'directly. Override move() in the inheriting class.')
}
Actor.prototype.takeDamage = function (amt) {
  if(typeof amt === 'undefined')
    throw new ParameterCountError()
  if(typeof amt !== 'number')
    throw new TypeError()
  if(amt < 0)
    throw new SyntaxError(
      'We shouldn\'t be taking negative damage (received: ' 
      + amt + 
      '). Either rename this function, or use a different one.'
    ) 
    
  this.health -= amt
  if(this.health < 0) this.health = 0
  if(this.health === 0) this.dead = true
  
  return this.health
}