// Copyright 2017 Vincenzo Greco
// Copyright 2024 Cisco Systems, Inc.
// Licensed under MIT-style license (see LICENSE.txt file).

import { Writable } from 'stream'

export default class WritableStream extends Writable {
  constructor () {
    super()
    this.forceError = false

    this.once('finish', function () {
      this.close()
    })
  }

  _write (data, encoding, cb) {
    if (this.forceError) this.emit('error', new Error('Fake error'))
    cb(this.forceError || null)
  }

  close (cb) {
    this.emit('close')
    if (cb) cb()
  }

  forceErrorOnWrite () {
    this.forceError = true
    return this
  }
}
