function ParameterCountError() {
  
}

ParameterCountError.prototype = Object.create(Error.prototype)
ParameterCountError.prototype.constructor = ParameterCountError

module.exports.ParameterCountError = ParameterCountError