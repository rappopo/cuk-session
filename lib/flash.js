'use strict'

// based on koa-flash-simple: https://github.com/ifraixedes/node-koa-flash-simple
module.exports = function(cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { app } = cuk.pkg.http.lib
  const pkg = cuk.pkg.session

  return () => {
    const key = _.get(pkg, 'cfg.common.flash.key')

    app.use((ctx, next) => {
      let prev = ctx.session[key]
      if (prev) {
        ctx.session[key] = null
      }

      ctx.flash = Object.seal({
        get() { return prev },
        set(data) { ctx.session[key] = data }
      })

      return next()
    })
  }
}