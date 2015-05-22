exports = module.exports = function HeroGameSocketIOInterface (io, hg) {
  
  // CONSTANTS
  var EVENTS = {
    HeroConnect: 'hero-connect',
    UserConnect: 'user-connect',
    Disconnect: 'disconnect'
  }
  
  function onConnection(socket) {
    if(!socket.hasBeenConfigured) {
      if(!hg.heroExists()) {
        socket.isHero = true // this may turn into configuration for hero-related events
        hg.setHero(socket.id)
        socket.emit(EVENTS.HeroConnect)
      } 
      else {
        ++hg.numObservers
        socket.isHero = false
      }
      ++hg.numPlayers
      io.emit(EVENTS.UserConnect, {
        id: socket.id
      })
      console.log('%%%%% NEW USER CONNECTED %%%%%')
      console.log('id: ' + socket.id)
      console.log('is hero? ' + socket.isHero)
      console.log()
      console.log('total number of players: ' + hg.numPlayers)
      console.log('total number of observers: ' + hg.numObservers)
      console.log()
      console.log()
      socket.hasBeenConfigured = true
    }

    
// IMPORTANT
// Always validate that whoever is claiming to be
// the hero has the correct id.
    
//    socket.on('hero-move', function (heroID, x, y) {
//      if(heroID !== hg.getHero().getID()) return false
//      console.log(hg.getHero().getID() + ' moves: (' + x + ', ' + y + ')')
//      io.emit('hero-move', {
//        x: x, 
//        y: y
//      })
//    })
    
    
    socket.on(EVENTS.Disconnect, function () {
      console.log('disconnect')
      --hg.numPlayers
      if(socket.isHero) {
        hg.findNewHero()
      }
      else --hg.numObservers
    })
  }
}