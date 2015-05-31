'using strict';
function ParameterCountError() {
  // The wrong number of parameters was supplied
  // to a function.
}

function ConfiguredHeroError() {
  // The hero was configured in a way we didn't
  // expect, or was configured when we expected
  // no hero to exist.
}

function MissingHeroError() {
  // The hero was missing when we expected 
  // her to be there.
}

ParameterCountError.prototype = Object.create(Error.prototype)
ParameterCountError.prototype.constructor = ParameterCountError

ConfiguredHeroError.prototype = Object.create(Error.prototype)
ConfiguredHeroError.prototype.constructor = ConfiguredHeroError

MissingHeroError.prototype = Object.create(Error.prototype)
MissingHeroError.prototype.constructor = MissingHeroError

module.exports.ParameterCountError = ParameterCountError
module.exports.ConfiguredHeroError = ConfiguredHeroError
module.exports.MissingHeroError = MissingHeroError