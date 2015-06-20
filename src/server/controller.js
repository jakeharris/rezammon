'using strict';
module.exports = Controller

var NotImplementedError = require('../errors').NotImplementedError

function Controller (server) {
  this.server = this.createServerAdapter(server)
}

Controller.prototype.createServerAdapter = function (server) {
  throw new NotImplementedError(
    'Controller is not intended to be implemented '
    + 'directly. Override createServerAdapter() '
    + 'in the inheriting class.')
}