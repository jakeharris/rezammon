'using strict';

module.exports = Entity

function Entity (opts) {
  if(!opts) opts = {}
  if(typeof opts !== 'object') throw new TypeError('Entities only take an options object as a parameter.')
  this.x = (opts.x) ? opts.x : 0
  this.y = (opts.y) ? opts.y : 0
}