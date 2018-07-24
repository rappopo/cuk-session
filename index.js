'use strict'

module.exports = function(cuk) {
  const { path } = cuk.pkg.core.lib
  return Promise.resolve({
    id: 'session',
    level: 24
  })
}