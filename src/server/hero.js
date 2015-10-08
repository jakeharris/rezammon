'using strict';

module.exports = Hero

var Actor = require('./actor'),
    ParameterCountError = require('../errors').ParameterCountError

function Hero (id, opts) {
  if(!id) throw new ParameterCountError('An ID parameter must be supplied.')
  
  Actor.call(this, opts)
  this.id = id
  this.health = 100 // override
  this.maxHealth = 100
}

Hero.prototype = Object.create(Actor.prototype)
Hero.prototype.constructor = Hero
Hero.prototype.move = function (direction) {
  if(typeof direction !== 'string') throw new TypeError('Directions must be strings.')
  if(!
      (
         direction === 'left'
      || direction === 'up'
      || direction === 'right'
      || direction === 'down'
      )
    ) throw new SyntaxError('Directions are limited to left, up, right, and down.')
  switch(direction) {
    case 'left':
      this.x--
      break
    case 'up':
      this.y--
      break
    case 'right':
      this.x++
      break
    case 'down':
      this.y++
      break
    default:
      throw new SyntaxError('Directions are limited to left, up, right, and down.')
  }
}