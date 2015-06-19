'using strict';
function ParameterCountError(msg) {
  // The wrong number of parameters was supplied
  // to a function.
  Error.captureStackTrace(this, this.constructor)
  this.name = 'ParameterCountError'
  this.message = msg
}

function ConfiguredHeroError(msg) {
  // The hero was configured in a way we didn't
  // expect, or was configured when we expected
  // no hero to exist.
  Error.captureStackTrace(this, this.constructor)
  this.name = 'ConfiguredHeroError'
  this.message = msg
}

function MissingHeroError(msg) {
  // The hero was missing when we expected 
  // her to be there.
  Error.captureStackTrace(this, this.constructor)
  this.name = 'MissingHeroError'
  this.message = msg
}

function NotImplementedError(msg) {
  // The function wasn't complete, or an
  // interface method should have been overridden
  // that was not.
  Error.captureStackTrace(this, this.constructor)
  this.name = 'NotImplementedError'
  this.message = msg
}

function SocketNotConnectedError(msg) {
  // We expected a socket and got none,
  // or one that didn't have the functions
  // we needed.
  Error.captureStackTrace(this, this.constructor)
  this.name = 'SocketNotConnectedError'
  this.message = msg
}

ParameterCountError.prototype = Object.create(Error.prototype)
ParameterCountError.prototype.constructor = ParameterCountError

ConfiguredHeroError.prototype = Object.create(Error.prototype)
ConfiguredHeroError.prototype.constructor = ConfiguredHeroError

MissingHeroError.prototype = Object.create(Error.prototype)
MissingHeroError.prototype.constructor = MissingHeroError

NotImplementedError.prototype = Object.create(Error.prototype)
NotImplementedError.prototype.constructor = NotImplementedError

SocketNotConnectedError.prototype = Object.create(Error.prototype)
SocketNotConnectedError.prototype.constructor = SocketNotConnectedError

module.exports.ParameterCountError = ParameterCountError
module.exports.ConfiguredHeroError = ConfiguredHeroError
module.exports.MissingHeroError = MissingHeroError
module.exports.NotImplementedError = NotImplementedError
module.exports.SocketNotConnectedError = SocketNotConnectedError