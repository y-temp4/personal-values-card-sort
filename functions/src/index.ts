import * as functions from 'firebase-functions'
const { Nuxt } = require('nuxt')

const nuxt = new Nuxt({
  dev: false,
  buildDir: 'ssr',
  // build: {
  //   publicPath: '/assets/',
  // },
})

exports.ssr = functions
  .runWith({ memory: '512MB' })
  .https.onRequest(async (req, res) => {
    await nuxt.ready()
    return nuxt.render(req, res)
  })
