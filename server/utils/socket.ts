import { randomUUID } from 'node:crypto'
import type WebSocket from 'ws'
import { WebSocketServer } from 'ws'
import type { MessageType, Response, ResponseData, TelegraphCommand } from '~/types'

const server = new WebSocketServer({ port: 8080 })

// 管理客户端连接
const clients = new Map<string, WebSocket>()

function clinetConnection(webSocket: WebSocket) {
  // 为每个客户端连接生成 UUID
  const uuid = randomUUID()
  clients.set(uuid, webSocket)
  send({ uuid, code: 0, msg: '连接成功', data: { type: 'connection', uuid } })
  return uuid
}

function clientClosed(uuid: string) {
  clients.delete(uuid)
}

function send({ uuid, ...response }: { uuid: string } & Response) {
  response.data = { ...response.data, sendAt: Date.now() }
  clients.get(uuid)?.send(JSON.stringify(response))
}

function sendMessage({ uuid, message }: {
  uuid: string
  message: string
  insert?: boolean
}) {
  const data: ResponseData = { type: 'message', message }
  send({ uuid, code: 0, msg: '收到新消息', data })
}

function sendCommand({ uuid, command }: {
  uuid: string
  command: TelegraphCommand
  insert?: boolean
}) {
  const data: ResponseData = { type: 'command', command }
  send({ uuid, code: 0, msg: '收到新指令', data })
}

function sendBroadcast({ sender, type, message }: { sender: string, type: 'message', message: string }): void
function sendBroadcast({ sender, type, command }: { sender: string, type: 'command', command: TelegraphCommand }): void
function sendBroadcast({ sender, type, message, command }: {
  sender: string
  type: MessageType
  message?: string
  command?: TelegraphCommand
}) {
  clients.forEach((client, uuid) => {
    if (client.readyState !== client.OPEN || uuid === sender)
      return
    if (type === 'message')
      sendMessage({ uuid, message: message!, insert: false })
    else if (type === 'command')
      sendCommand({ uuid, command: command!, insert: false })
  })
}

server.on('connection', (client) => {
  const uuid = clinetConnection(client)

  client.on('message', (data) => {
    const res = JSON.parse(data.toString())
    res.message && sendBroadcast({
      sender: uuid,
      type: res.type,
      message: res.message,
    })
    res.command && sendBroadcast({
      sender: uuid,
      type: res.type,
      command: res.command,
    })
  })

  client.on('error', console.error)

  client.on('close', () => {
    clientClosed(uuid)
  })
})

export function useSocketServer() {
  return {
    server,
    clients,
    send,
    sendBroadcast,
    sendCommand,
    sendMessage,
  }
}
