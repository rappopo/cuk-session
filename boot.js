'use strict'

module.exports = function (cuk) {
  return new Promise((resolve, reject) => {
    require('./lib/session')(cuk)()
    require('./lib/flash')(cuk)()
    resolve(true)
  })
}
