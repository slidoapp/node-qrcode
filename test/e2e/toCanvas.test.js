import { test } from 'tap'
import { Canvas, createCanvas } from 'canvas'
import * as QRCode from '../../lib/index.js'
import * as Helpers from '../helpers.js'

test('toCanvas - no promise available', function (t) {
  Helpers.removeNativePromise()

  // Mock document object
  global.document = {
    createElement: function (el) {
      if (el === 'canvas') {
        return createCanvas(200, 200)
      }
    }
  }
  const canvasEl = createCanvas(200, 200)

  t.throws(function () { QRCode.toCanvas() },
    'Should throw if no arguments are provided')

  t.throws(function () { QRCode.toCanvas('some text') },
    'Should throw if a callback is not provided')

  t.throws(function () { QRCode.toCanvas(canvasEl, 'some text') },
    'Should throw if a callback is not provided')

  t.throws(function () { QRCode.toCanvas(canvasEl, 'some text', {}) },
    'Should throw if callback is not a function')

  t.end()

  global.document = undefined
  Helpers.restoreNativePromise()
})

test('toCanvas', function (t) {
  // Mock document object
  global.document = {
    createElement: function (el) {
      if (el === 'canvas') {
        return createCanvas(200, 200)
      }
    }
  }

  t.plan(7)

  t.throws(function () { QRCode.toCanvas() },
    'Should throw if no arguments are provided')

  QRCode.toCanvas('some text', function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })

  QRCode.toCanvas('some text', {
    errorCorrectionLevel: 'H'
  }, function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })

  QRCode.toCanvas('some text').then(function (canvasEl) {
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object (promise)')
  })

  QRCode.toCanvas('some text', {
    errorCorrectionLevel: 'H'
  }).then(function (canvasEl) {
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object (promise)')
  })

  global.document = undefined
})

test('toCanvas with specified canvas element', function (t) {
  const canvasEl = createCanvas(200, 200)

  t.plan(6)

  QRCode.toCanvas(canvasEl, 'some text', function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })

  QRCode.toCanvas(canvasEl, 'some text', {
    errorCorrectionLevel: 'H'
  }, function (err, canvasEl) {
    t.ok(!err, 'There should be no error')
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object')
  })

  QRCode.toCanvas(canvasEl, 'some text').then(function (canvasEl) {
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object (promise)')
  })

  QRCode.toCanvas(canvasEl, 'some text', {
    errorCorrectionLevel: 'H'
  }).then(function (canvasEl) {
    t.ok(canvasEl instanceof Canvas,
      'Should return a new canvas object (promise)')
  })
})
