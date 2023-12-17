/* eslint-disable no-console */
import { WebSocketServer } from 'ws'

export default defineNitroPlugin(() => {
  const wss = new WebSocketServer({
    port: 8080,
  })

  wss.on('connection', (ws) => {
    // ws.send('WebSocket 🤝')

    ws.on('close', (id) => {
      console.log('再见：', id)
    })

    ws.on('message', (msg) => {
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN && client !== ws)
          client.send(`${msg.toString('utf8')}`)
      })
    })
  })
})
