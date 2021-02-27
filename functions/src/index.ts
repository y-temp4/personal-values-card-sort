import * as functions from 'firebase-functions'
const { Nuxt } = require('nuxt')

// @ts-ignore
import config from './nuxt.config'

const nuxt = new Nuxt({
  ...config,
  dev: false,
  buildDir: 'nuxt',
})

export const ssr = functions
  .runWith({ memory: '1GB' })
  .https.onRequest(async (req, res) => {
    await nuxt.ready()
    return nuxt.render(req, res)
  })
