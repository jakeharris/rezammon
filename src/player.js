'using strict';
var ParameterCountError = require('./errors').ParameterCountError

function Player (id) {
  if(id === undefined)
    throw new ParameterCountError('Players must be given an ID.')
  if(typeof id !== 'string')
    throw new TypeError('Players\' IDs cannot be anything but strings.')
    
  
  this.id = id
}

Player.prototype.getID = function () {
  return this.id
}

module.exports = Player