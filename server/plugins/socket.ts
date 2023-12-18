/* eslint-disable no-console */
import { WebSocketServer } from 'ws'

export default defineNitroPlugin(() => {
  const wss = new WebSocketServer({
    port: 8080,
  })

  wss.on('connection', (ws) => {
    console.log('客户端数量: ', wss.clients.size)

    ws.on('ping', () => {
      console.log('ping')
    })

    ws.on('pong', () => {
      console.log('pong')
    })

    ws.on('message', (msg) => {
      console.log('message: ', msg.toString())
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN && client !== ws)
          client.send(`${msg.toString('utf8')}`)
      })
    })

    ws.on('error', (err) => {
      console.log('WebSocket Error: ', err.message)
    })

    ws.on('close', (code) => {
      console.log(code, '已断开')
    })
  })
})
