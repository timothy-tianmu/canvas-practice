class Canvas {
  constructor(options) {
    this.initCanvas(options)
    this.mount(options)
    this.initEvents()
  }

  // 根据传入的options配置canvas元素
  initCanvas(options) {
    this.id = options.id || "canvas"
    this.rootId = options.root || "root"
    this.W = options.width || 800
    this.H = options.height || 600
  }

  // 设置canvas相关事件
  initEvents() {
    this.setupKeyActions()
  }

  // 收集用户按键
  setupKeyActions() {
    this.keydowns = new Set()
    this.keyActions = new Map()
    window.addEventListener("keydown",(ev) => {
      var {key} = ev
      this.keydowns.add(key)
    })
    window.addEventListener("keyup",(ev) => {
      var {key} = ev
      this.keydowns.delete(key)
    })
  }

  // 注册一个键盘事件
  registerKeyAction(ev, callback) {
    this.registerAction(this.keyActions, ev, callback)
  }
  
  // 辅助函数，在actionMap添加一条ev事件映射记录
  registerAction(actionMap, ev, callback) {
    if (actionMap.has(ev)) {
      var acts = actionMap.get(ev)
      if (Array.isArray(acts)) {
        acts.push(callback)
      } else if (isFunc(acts)) {
        actionMap.set(ev, [acts, callback])
      } else {
        throw new Error("Action type error")
      }
    } else {
      actionMap.set(ev, callback)
    }
  }

  // 执行按下按键对应的处理函数
  performKeyActions() {
    var eventWrapper = {}
    for (var k of this.keydowns.keys()) {
        if (k === "Control") {
          eventWrapper.ctrlDown = true
        } else if (k === "Alt") {
          eventWrapper.altDown = true
        } else if (k === "Shift") {
          eventWrapper.shiftDown = true
        }
        var acts = this.keyActions.get(k)
        this.callActions(acts, eventWrapper)
    }
  }
  
  // 辅助函数，执行acts变量指向的函数或指向的数组中的所有函数
  callActions(acts, ev) {
    if (acts) {
      if (Array.isArray(acts)) {
        for (var f of acts) {
          f(ev)
        }
      } else if (isFunc(acts)) {
        acts(ev)
      }
    }
  }


  mount(options) {
    // 将canvas挂载到指定根元素下
    var {W, H, id, rootId} = this
    var elem = document.getElementById(rootId)
    var canvas = `
      <canvas id='${id}' width='${W}' height='${H}'></canvas>
    `
    elem.insertAdjacentHTML("beforeend", canvas)
    // 将canvas元素和canvas上下文环境保存到Canvas实例中
    this.canvas = document.getElementById(id)
    this.ctx = this.canvas.getContext("2d")
  }

  update() {
    this.performKeyActions()
  }
  
  draw() {
    // 绘制一帧canvas的代码
    // 由继承该类的具体Canvas实现
  }

  // 循环每一帧绘制一次canvas
  loop() {
    var c = this
    window.requestAnimationFrame(function() {
      c.update()
      c.draw()
      c.loop()
    })
  }

  start() {
    this.loop()
  }
}

