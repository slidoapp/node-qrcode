// Copyright 2017 Vincenzo Greco
// Copyright 2024 Cisco Systems, Inc.
// Licensed under MIT-style license (see LICENSE.txt file).

/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
export function isValid (version) {
  return !isNaN(version) && version >= 1 && version <= 40
}
