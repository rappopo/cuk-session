'use strict'

module.exports = function(cuk) {

  return {
    _hasCtx: true,
    handler: ctx => {
      return ctx.flash.get()
    }
  }
}