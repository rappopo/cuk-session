'use strict'

const session = require('koa-session')

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const { app } = cuk.pkg.http.lib
  const pkg = cuk.pkg.session

  const handleGet = (key, maxAge, opts) => {
    const model = helper('model:get')('session:store')
    return new Promise((resolve, reject) => {
      model.findOne(key)
        .then(result => {
          resolve(JSON.parse(result.data.data))
        })
        .catch(err => {
          if (err.message === 'Document not found') resolve({})
          else reject(err)
        })
    })
  }

  const handleSet = (key, sess, maxAge, opts) => {
    const model = helper('model:get')('session:store')

    const isExists = id => {
      return new Promise((resolve, reject) => {
        model.findOne(id)
          .then(() => {
            resolve(true)
          })
          .catch(err => {
            if (err.message === 'Document not found') resolve(false)
            else reject(err)
          })
      })
    }

    return new Promise((resolve, reject) => {
      const body = {
        key: key,
        data: JSON.stringify(sess)
      }
      isExists(key)
        .then(result => {
          return result ? model.update(key, body) : model.create(body)
        })
        .then(result => {
          resolve(true)
        })
        .catch(reject)
    })
  }

  const handleDestroy = key => {
    const model = helper('model:get')('session:store')
    return new Promise((resolve, reject) => {
      model.remove(key)
        .then(result => {
          resolve(true)
        })
        .catch(reject)
    })
  }

  return () => {
    let cfg = pkg.cfg.common
    cfg.opts.maxAge = helper('core:parseUnitOfTime')(_.get(cfg, 'opts.maxAge', 86400000))

    if (cuk.pkg.model && cfg.useModel && !cfg.opts.store) {
      cfg.opts.store = {
        get: handleGet,
        set: handleSet,
        destroy: handleDestroy
      }
    }
    app.use(session(cfg.opts, app))
  }
}
