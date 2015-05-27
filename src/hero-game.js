//var Player = require('./player')

module.exports = createHero

function createHero(face) {
  'use strict';
  return new HeroGame(face)
}

function HeroGame (face) {
  'use strict';

  var players = []

  this.inter = face
  this.heroID = -1

  this.chooseHero = function() {
    return players[0]
  }

}

HeroGame.prototype.getHeroID = function () {
  'use strict';
  if(!this.inter.hasConnectedHero()) {
    // pick one, set it, and return that
    this.heroID = this.chooseHero().getID()
  }
  return this.heroID
}

HeroGame.prototype.chooseHero = function () {
  'use strict';
  return this.players[0]
};
