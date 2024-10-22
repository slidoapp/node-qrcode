// Copyright 2017 Vincenzo Greco
// Copyright 2024 Cisco Systems, Inc.
// Licensed under MIT-style license (see LICENSE.txt file).

import * as Mode from './mode.js'
import * as Utils from './utils.js'

export default class KanjiData {
  constructor (data) {
    this.mode = Mode.KANJI
    this.data = data
  }

  static getBitsLength = function getBitsLength (length) {
    return length * 13
  }

  getLength () {
    return this.data.length
  }

  getBitsLength () {
    return KanjiData.getBitsLength(this.data.length)
  }

  write (bitBuffer) {
    let i

    // In the Shift JIS system, Kanji characters are represented by a two byte combination.
    // These byte values are shifted from the JIS X 0208 values.
    // JIS X 0208 gives details of the shift coded representation.
    for (i = 0; i < this.data.length; i++) {
      let value = Utils.toSJIS(this.data[i])

      // For characters with Shift JIS values from 0x8140 to 0x9FFC:
      if (value >= 0x8140 && value <= 0x9FFC) {
        // Subtract 0x8140 from Shift JIS value
        value -= 0x8140

      // For characters with Shift JIS values from 0xE040 to 0xEBBF
      } else if (value >= 0xE040 && value <= 0xEBBF) {
        // Subtract 0xC140 from Shift JIS value
        value -= 0xC140
      } else {
        throw new Error(
          'Invalid SJIS character: ' + this.data[i] + '\n' +
          'Make sure your charset is UTF-8')
      }

      // Multiply most significant byte of result by 0xC0
      // and add least significant byte to product
      value = (((value >>> 8) & 0xff) * 0xC0) + (value & 0xff)

      // Convert result to a 13-bit binary string
      bitBuffer.put(value, 13)
    }
  }
}
