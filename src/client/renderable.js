(function(exports) {
  'using strict';
  
  exports.Renderable = Renderable
  exports.Text = Text
  exports.FilledRect = FilledRect
  exports.FilledCircle = FilledCircle
  exports.StatusBar = StatusBar
  exports.Button = Button
  
  function Renderable (opts) {
    this.x = (opts.x) ? opts.x : 0
    this.y = (opts.y) ? opts.y : 0
    this.z = (opts.z) ? opts.z : 0
    this.width = (opts.width) ? opts.width : 0
    this.height = (opts.height) ? opts.height : 0
    if(opts.fillStyle) this.fillStyle = opts.fillStyle
  }
  Renderable.prototype.draw = function (ctx) {
    // each implementing type should
    // override this
    throw new Error('NotImplementedError(): every Renderable subtype must define its own draw(ctx) function')
  }
  Renderable.prototype.render = function (ctx) {
    if(!ctx) 
      throw new Error('ParameterCountError(): no Canvas context supplied')
    if(!(ctx instanceof CanvasRenderingContext2D))
      throw new TypeError()
      
    ctx.save()
    
    if(this.fillStyle) ctx.fillStyle = this.fillStyle
    ctx.beginPath()
    this.draw(ctx)
    ctx.closePath()
    
    ctx.restore()
  }

  function Text(opts) {
    Renderable.call(this, opts)
    this.text = (opts.text) ? opts.text : 'default text'
    this.isCentered = (opts.isCentered) ? opts.isCentered : false
  }
  Text.prototype = Object.create(Renderable.prototype)
  Text.prototype.constructor = Text
  Text.prototype.draw = function (ctx) {
    if(this.isCentered) ctx.textAlign = 'center'
    else ctx.textAlign = 'left'
    
    ctx.fillText(this.text, this.x, this.y)
  }

  function FilledRect(opts) {
    Renderable.call(this, opts)
  }
  FilledRect.prototype = Object.create(Renderable.prototype)
  FilledRect.prototype.constructor = FilledRect

  function FilledCircle(opts) {
    Renderable.call(this, opts)
    this.radius = (opts.radius) ? opts.radius : 10
  }
  FilledCircle.prototype = Object.create(Renderable.prototype)
  FilledCircle.prototype.constructor = FilledCircle
  FilledCircle.prototype.draw = function (ctx) {
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*4)
    ctx.fill()
  }
  
  function Button (opts) {
    if(!opts || !opts.onClick) throw new SyntaxError('Buttons require an onClick event handler.')
    
    Renderable.call(this, opts)
    
    this.borderRadius = (opts.borderRadius !== undefined) ? opts.borderRadius : 0
    this.depth = (opts.depth !== undefined) ? opts.depth : 5
    this.text = (opts.text !== undefined) ? opts.text : null
    this.onClick = opts.onClick
    this.state = 'up' // valid states: up, down
    
    window.addEventListener('mousedown', function (e) {
      e.preventDefault()
      if(this.containsPoint(e.clientX, e.clientY))
        this.onMouseDown()
    }.bind(this))
    window.addEventListener('mouseup', function (e) {
      e.preventDefault()
      if(this.containsPoint(e.clientX, e.clientY) && this.state === 'down')
        this.onMouseUp()
    }.bind(this))
  }
  Button.prototype = Object.create(Renderable.prototype)
  Button.prototype.constructor = Button
  Button.prototype.draw = function (ctx) {
    
    /* DRAW THE TOP OF THE BUTTON */
    var curX = this.x + this.borderRadius,
        curY = this.y
    
    ctx.moveTo(curX, curY)
    
    curX += this.width - 2 * this.borderRadius
    ctx.lineTo(curX, curY)
    curY += this.borderRadius
    ctx.arc(curX, curY, this.borderRadius, (-Math.PI / 2), 0)
    curX += this.borderRadius
    
    curY += this.height - 2 * this.borderRadius
    ctx.lineTo(curX, curY)
    curX -= this.borderRadius
    ctx.arc(curX, curY, this.borderRadius, 0, Math.PI / 2)
    curY += this.borderRadius
    
    curX -= this.width - 2 * this.borderRadius
    ctx.lineTo(curX, curY)
    curY -= this.borderRadius
    ctx.arc(curX, curY, this.borderRadius, Math.PI / 2, Math.PI)
    curX -= this.borderRadius
    
    curY -= this.height - 2 * this.borderRadius
    ctx.lineTo(curX, curY)
    curX += this.borderRadius
    ctx.arc(curX, curY, this.borderRadius, Math.PI, 3 * Math.PI / 2)
    
    ctx.fillStyle = this.fillStyle
    ctx.fill()
    
    /* PUT TEXT ON IT */
    if(this.text) {
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
    }
  }
  Button.prototype.onMouseUp = function () {
    this.onClick()
    this.state = 'up'
  }
  Button.prototype.onMouseDown = function () {
    this.state = 'down' 
  }
  Button.prototype.containsPoint = function (x, y) {
    return ( x >= this.x
          && x <= this.x + this.width
          && y >= this.y
          && y <= this.y + this.height)
  }
  
  function StatusBar (opts) {
    if(!opts || !opts.type) throw new SyntaxError('Status bars require a type.')
    if(!(
       opts.type === 'hero-health'
    || opts.type === 'hero-mana'
      )) throw new SyntaxError('Invalid type given (' + opts.type + ').')
    
    Renderable.call(this, opts)
    
    this.healthRed = '#cf3434'
    this.healthDark = '#5f1212'
    this.type = opts.type
    this.max = 100
    this.current = (opts.current > 0) ? opts.current : this.max
  }
  StatusBar.prototype = Object.create(Renderable.prototype)
  StatusBar.prototype.constructor = StatusBar
  StatusBar.prototype.draw = function (ctx) {
    ctx.fillStyle = this.healthDark
    ctx.fillRect(this.x, this.y, 100, 15)
    ctx.fillStyle = this.healthRed
    ctx.fillRect(this.x, this.y, (this.current / this.max) * 100, 15)
  }
  
})(this)