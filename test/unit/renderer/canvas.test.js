const test = require('tap').test
const { Canvas, createCanvas } = require('canvas')
const QRCode = require('core/qrcode')
const CanvasRenderer = require('renderer/canvas')

test('CanvasRenderer interface', function (t) {
  t.type(CanvasRenderer.render, 'function',
    'Should have render function')

  t.type(CanvasRenderer.renderToDataURL, 'function',
    'Should have renderToDataURL function')

  t.end()
})

test('CanvasRenderer render', function (t) {
  // Mock document object
  global.document = {
    createElement: function (el) {
      if (el === 'canvas') {
        return createCanvas(200, 200)
      }
    }
  }

  const sampleQrData = QRCode.create('sample text', { version: 2 })
  let canvasEl

  t.doesNotThrow(function () { canvasEl = CanvasRenderer.render(sampleQrData) },
    'Should not throw if canvas is not provided')

  t.ok(canvasEl instanceof Canvas,
    'Should return a new canvas object')

  t.doesNotThrow(function () {
    canvasEl = CanvasRenderer.render(sampleQrData, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  // modules: 25, margins: 10 * 2, scale: 1
  t.equal(canvasEl.width, 25 + 10 * 2,
    'Should have correct size')

  t.equal(canvasEl.width, canvasEl.height,
    'Should be a square image')

  global.document = undefined

  t.throws(function () { canvasEl = CanvasRenderer.render(sampleQrData) },
    'Should throw if canvas cannot be created')

  t.end()
})

test('CanvasRenderer render to provided canvas', function (t) {
  const sampleQrData = QRCode.create('sample text', { version: 2 })
  const canvasEl = createCanvas(200, 200)

  t.doesNotThrow(function () { CanvasRenderer.render(sampleQrData, canvasEl) },
    'Should not throw with only qrData and canvas param')

  t.doesNotThrow(function () {
    CanvasRenderer.render(sampleQrData, canvasEl, {
      margin: 10,
      scale: 1
    })
  }, 'Should not throw with options param')

  // modules: 25, margins: 10 * 2, scale: 1
  t.equal(canvasEl.width, 25 + 10 * 2,
    'Should have correct size')

  t.equal(canvasEl.width, canvasEl.height,
    'Should be a square image')

  t.end()
})

test('CanvasRenderer renderToDataURL', function (t) {
  // Mock document object
  global.document = {
    createElement: function (el) {
      if (el === 'canvas') {
        return createCanvas(200, 200)
      }
    }
  }

  const sampleQrData = QRCode.create('sample text', { version: 2 })
  let url

  t.doesNotThrow(function () { url = CanvasRenderer.renderToDataURL(sampleQrData) },
    'Should not throw if canvas is not provided')

  t.doesNotThrow(function () {
    url = CanvasRenderer.renderToDataURL(sampleQrData, {
      margin: 10,
      scale: 1,
      type: 'image/png'
    })
  }, 'Should not throw with options param')

  t.type(url, 'string',
    'Should return a string')

  t.equal(url.split(',')[0], 'data:image/png;base64',
    'Should have correct header')

  const b64png = url.split(',')[1]
  t.equal(b64png.length % 4, 0,
    'Should have a correct length')

  global.document = undefined
  t.end()
})

test('CanvasRenderer renderToDataURL to provided canvas', function (t) {
  const sampleQrData = QRCode.create('sample text', { version: 2 })
  const canvasEl = createCanvas(200, 200)
  let url

  t.doesNotThrow(function () {
    url = CanvasRenderer.renderToDataURL(sampleQrData, canvasEl)
  }, 'Should not throw with only qrData and canvas param')

  t.doesNotThrow(function () {
    url = CanvasRenderer.renderToDataURL(sampleQrData, canvasEl, {
      margin: 10,
      scale: 1,
      type: 'image/png'
    })
  }, 'Should not throw with options param')

  t.type(url, 'string',
    'Should return a string')

  t.equal(url.split(',')[0], 'data:image/png;base64',
    'Should have correct header')

  const b64png = url.split(',')[1]
  t.equal(b64png.length % 4, 0,
    'Should have a correct length')

  t.end()
})

test('CanvasRenderer renderToBlob', function (t) {
  // Mock document object
  global.document = {
    createElement: function (el) {
      if (el === 'canvas') {
        const canvas = createCanvas(200, 200)

        // The `HTMLCanvas` element has a `toBlob()` method
        // to export content as image bytes. The equivalent
        // methos in `canvas` library is the `toBuffer()`.
        canvas.toBlob = (cb, mimeType, config) => {
          const buffer = canvas.toBuffer(mimeType, config)
          cb(buffer)
        }

        return canvas
      }
    }
  }

  t.plan(5)

  const sampleQrData = QRCode.create('sample text', { version: 2 })
  let imageBlob

  t.doesNotThrow(function () { CanvasRenderer.renderToBlob((blob) => {}, sampleQrData) },
    'Should not throw if canvas is not provided')

  t.doesNotThrow(function () {
    CanvasRenderer.renderToBlob((blob) => {
      imageBlob = blob
      console.log('====CALLBACK CALLED====', blob.toString('base64'))

      t.type(imageBlob, 'object',
        'Should return a Buffer object')

      t.equal(imageBlob.toString('base64'), 'iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAABmJLR0QA/wD/AP+gvaeTAAABfUlEQVRYhe2Z4Y4DIQiE18u9/ytzv2jIdBBQ6qWJkzRrXdb9RBRth4jI82X6+W+AFV3oU7rQp3ShT+lCn9Jv1nCM4d4Tkdd9TbBo79Uzm0hpaK9RC6Hw1s7CajlqJ1IJmkFimdVV2smoDF2FwLDpUNtEtJ5mIVIZ/khlT0ceU2DrYQa84/kS9MxbCKtgrH7X62nojGcwLPS5nUnHlI5pffEY461sYb2wYOs0a7MVGicYSyYzMGuDHROR0giMyhmRvcyL5VlHrFbCJQ3N0jKCR8+jzWqsl8JDr7gmIwCLe7W19aydVmgLjh6KYtKbDyvAZWiMafQcs8HRwD3KSpovLXnMK+hFlr5nYbAyEcsxbTugZbx6GTCqy2pr78F2c+yeZ48TtP0QsHLiYM9U4DyVVw/8MM28Ho1ARq0nl8iLHZPweRoPAV46Z0lpVx//CYFtmPBeNc7bTi5RSmbJR79/NKajk4uFyUw4ryMhx/374pAu9Cld6FO60Kd0oU/pD1hTe2vcG9EjAAAAAElFTkSuQmCC',
        'Should have correct content')

      t.equal(imageBlob.length % 4, 0,
        'Should have a correct length')
    }, sampleQrData, {
      margin: 10,
      scale: 1,
      type: 'image/png'
    })
  }, 'Should not throw with options param')

  global.document = undefined
})
