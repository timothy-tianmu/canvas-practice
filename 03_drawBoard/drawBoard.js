class DrawBoard extends Canvas {
  constructor(options) {
    super(options)
    this.setup()
    this.setupTools()
  }

  setupTools() {
    this.tool = PEN
    var penBtn = document.getElementById("pen")
    var eraserBtn = document.getElementById("eraser")
    var rectBtn = document.getElementById("rect")
    penBtn.addEventListener("click", (ev) => {
      this.tool = PEN
    })
    eraserBtn.addEventListener("click", (ev) => {
      this.tool = ERASER
    })
    rectBtn.addEventListener("click", (ev) => {
      this.tool = RECT
      log("clicked")
    })
  }

  updateMouseOffset(mouseEvent) {
    var {offsetX, offsetY} = mouseEvent
    this.offsetX = offsetX
    this.offsetY = offsetY
  }

  setup() {
    var b = this
    var canvas = this.layers.get(UILAYER)
    canvas.addEventListener("mousedown", function(ev) {
      b.updateMouseOffset(ev)
      b.mouseDownX = ev.offsetX
      b.mouseDownY = ev.offsetY
      b.isMouseDown = true
    })
    canvas.addEventListener("mousemove", function(ev) {
      var lastOffsetX = b.offsetX
      var lastOffsetY = b.offsetY
      b.updateMouseOffset(ev)
      if (!b.isMouseDown) {
        return
      }
      if (b.tool === PEN) {
        b.switchLayer(UILAYER)
        b.drawLine(lastOffsetX, lastOffsetY, b.offsetX, b.offsetY)
      } else if (b.tool === ERASER) {
        b.switchLayer(this.id)
        b.ctx.clearRect(b.offsetX, b.offsetY, 20, 20)
      } else if (b.tool === RECT) {
        b.switchLayer(UILAYER)
        b.ctx.clearRect(0,0,b.W,b.H)
        var rect = new Path2D()
        rect.rect(b.mouseDownX, b.mouseDownY, b.offsetX - b.mouseDownX, b.offsetY - b.mouseDownY)
        b.drawRect(rect)
      }
    })
    canvas.addEventListener("mouseup", function(ev) {
      b.isMouseDown = false
      var dataURL = b.layer.toDataURL()
      var img = new Image()
      img.onload = function() {
        b.switchLayer(b.id)
        b.ctx.drawImage(img, 0, 0)
      }
      img.src = dataURL
    })
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.save()
    this.ctx.lineWidth = 1.5
    this.ctx.strokeStyle = "#000"
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
    this.ctx.restore()
  }

  drawRect(rectPath) {
    this.ctx.save()
    this.ctx.lineWidth = 1.5
    this.ctx.strokeStyle = "#000"
    this.ctx.stroke(rectPath)
    this.ctx.restore()
  }

  update() {
    super.update()
  }

  mount() {
    super.mount()
    // 添加与用户交互的canvas层和背景层
    this.addLayer(UILAYER, 1, false)
    this.addLayer(BACKGROUNDLAYER, -1, false)
    // 添加工具条
    var root = document.getElementById(this.rootId)
    var toolPane = `
      <div id="toolPane">
        <button id="eraser">ERASER</button>
        <button id="pen">PEN</button>
        <button id="rect">RECT</button>
      </div>
    `
    root.insertAdjacentHTML("beforebegin", toolPane)
  }
}