import express from 'express'
import * as https from 'node:https'
import * as http from 'node:http'

export function createHttpServer(
  protocol: 'http' | 'https',
  hostname: string,
  port: number,
  privateKey?: string,
  certificate?: string
): http.Server | https.Server {
  const app = express()

  if (protocol === 'https') {
    if (!privateKey || !certificate) {
      throw new Error('privateKey and certificate are required for https')
    }
    const server = https.createServer({ key: privateKey, cert: certificate }, app)
    server.listen(port, hostname)
    return server
  } else {
    const server = http.createServer(app)
    server.listen(port, hostname)
    return server
  }
}
