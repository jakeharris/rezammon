module.exports = Player

function Player (id) {
  this.id = id
}

Player.prototype.getID = function () {
  return this.id
}