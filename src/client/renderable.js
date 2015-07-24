(function(exports) {
  'using strict';
  
  exports.Renderable = Renderable
  exports.Text = Text
  exports.FilledRect = FilledRect
  exports.FilledCircle = FilledCircle
  exports.StatusBar = StatusBar
  
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
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  Renderable.prototype.render = function (ctx) {
    if(!ctx) 
      throw new Error('ParameterCountError(): no Canvas context supplied')
    if(!(ctx instanceof CanvasRenderingContext2D))
      throw new TypeError()
    if(this.fillStyle) ctx.fillStyle = this.fillStyle
    ctx.beginPath()
    this.draw(ctx)
    ctx.closePath()
  }

  function Text(opts) {
    Renderable.call(this, opts)
    this.text = (opts.text) ? opts.text : 'default text'
  }
  Text.prototype = Object.create(Renderable.prototype)
  Text.prototype.constructor = Text
  Text.prototype.draw = function (ctx) {
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
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*4)
    ctx.fill()
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
    this.current = 100
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