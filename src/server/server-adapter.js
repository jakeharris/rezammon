'using strict';
module.exports = ServerAdapter

function ServerAdapter(server, controller) {
  this.server = server
  this.controller = controller
}