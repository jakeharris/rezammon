// We're expecting socket.io and jQuery to
// already be loaded.

var socket = io(),
    canvas = document.getElementById('c'),
    c = canvas.getContext('2d'),
    id,
    isHero = false

socket.on('user-connect', function (data) {
  id = data.id
  console.log('connected as ' + id)
  if(!isHero) {
    c.fillStyle = '#f64'
    c.beginPath()
    c.fillText('u r not the hero', 100, 100)
    c.closePath()
  }
})

socket.on('hero-connect', function() {
  isHero = true
  c.fillStyle = '#6f4'
  c.beginPath()
  c.fillText('u r the hero', 100, 100)
  c.closePath()
})
socket.on('hero-connected', function () {
  c.fillStyle = '#6f4'
  c.beginPath()
  c.fillText('the hero is here.', 150, 150)
  c.closePath()
})

$(window).on('unload', function () {
  socket.disconnect()
})