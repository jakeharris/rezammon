'using strict';

module.exports = Actor

var Entity = require('./entity'),
    NotImplementedError = require('../errors').NotImplementedError

function Actor (opts) {
  if(!opts) opts = {}
  if(typeof opts !== 'object') throw new TypeError('Actors only take an options object as a parameter.')
  
  Entity.call(this, opts)
}

Actor.prototype = Object.create(Entity.prototype)
Actor.prototype.constructor = Actor

Actor.prototype.move = function () {
  throw new NotImplementedError('Actor is not intended to be implemented '
                                + 'directly. Override move() in the inheriting class.')
}