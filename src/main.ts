import fs from 'node:fs'
import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {createServer} from 'node:https'
import api from './api/api.ts'

const app = new Hono()

app.route('/', api)

if (process.env['KEY'] && process.env['CERT']) {
  const key = fs.readFileSync(process.env['KEY']!)
  const cert = fs.readFileSync(process.env['CERT']!)
  serve(
    {fetch: app.fetch, createServer, serverOptions: {key, cert}, port: 443},
    (info) => {
      console.log(`Listening on http${key && 's'}://localhost:${info.port}`)
    }
  )
}

serve({fetch: app.fetch, port: 80}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
