import { test } from 'tap'
import { Canvas, createCanvas } from 'canvas'
import * as QRCode from './../../../lib/core/qrcode.js'
import * as CanvasRenderer from './../../../lib/renderer/canvas.js'

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
          const blob = new Blob([buffer], { type: mimeType })
          cb(blob)
        }

        return canvas
      }
    }
  }

  t.plan(6)

  const sampleQrData = QRCode.create('sample text', { version: 2 })
  let imageBlob

  t.doesNotThrow(function () { CanvasRenderer.renderToBlob((blob) => {}, sampleQrData) },
    'Should not throw if canvas is not provided')

  t.doesNotThrow(function () {
    CanvasRenderer.renderToBlob((blob) => {
      imageBlob = blob

      t.type(imageBlob, 'Blob',
        'Should return a Blob object')

      t.equal(imageBlob.toString('base64'), '[object Blob]',
        'Blob data cannot be converted to base64 econding')

      t.equal(imageBlob.size % 4, 0,
        'Should have a correct size')

      t.equal(imageBlob.type, 'image/png',
        'Should have a correct type value')
    }, sampleQrData, {
      margin: 10,
      scale: 1,
      type: 'image/png'
    })
  }, 'Should not throw with options param')

  global.document = undefined
})
