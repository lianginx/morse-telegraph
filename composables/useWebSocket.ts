import { SocketStatus, TelegraphCommand } from '~/types'

/**
 * 创建 WebSocket 连接
 * @param protocol WebSocket 协议
 * @param hostname WebSocket 主机名
 * @param port WebSocket 端口
 */
export function useWebSocket(
  protocol = window.location.protocol === 'https:' ? 'wss' : 'ws',
  hostname = window.location.hostname,
  port = 8080,
) {
  const uuid = ref<string>()
  const allMessage = ref<string[]>([])
  const myMessages = ref<string[]>([])
  const socketStatus = ref<SocketStatus>(SocketStatus.Offline)
  const url = `${protocol}://${hostname}:${port}`
  const socket = new WebSocket(url)

  socket.onopen = () => {
    socketStatus.value = SocketStatus.Online
  }

  socket.onclose = () => {
    socketStatus.value = SocketStatus.Offline
  }

  socket.onerror = (e) => {
    console.error('WebSocket Error:', e)
    socketStatus.value = SocketStatus.Error
  }

  socket.onmessage = (e) => {
    const { code, msg, data } = JSON.parse(e.data)

    if (code !== 0) {
      console.error('WebSocket Error:', msg)
      return
    }

    switch (data.type) {
      case 'message':
        allMessage.value.push(data.message)
        break
      case 'command':
        handleCommand(data.command)
        break
      case 'connection':
        uuid.value = data.uuid
        break
    }
  }

  function send(type: 'message' | 'command', msg: string | TelegraphCommand) {
    if (!msg)
      return
    socket.send(JSON.stringify({
      type,
      uuid: uuid.value,
      message: type === 'message' ? msg : undefined,
      command: type === 'command' ? msg : undefined,
    }))
  }

  function sendMessage(msg: string) {
    send('message', msg)
    myMessages.value.push(msg)
  }

  function sendCommand(command: TelegraphCommand) {
    send('command', command)
    handleCommand(command)
  }

  function handleCommand(command: TelegraphCommand) {
    switch (command) {
      case TelegraphCommand.Backspace:
        myMessages.value.pop()
        break
      case TelegraphCommand.Clear:
        messages.value = []
        break
      case TelegraphCommand.Br:
        messages.value.push('\n')
        break
      default:
        throw new Error('未知指令')
    }
  }

  return {
    /** WebSocket 连接唯一标识 */
    uuid,
    /** 接收的消息列表 */
    allMessage,
    /** 发出的消息列表 */
    myMessages,
    /** WebSocket 协议 */
    protocol,
    /** WebSocket 主机名 */
    hostname,
    /** WebSocket 端口 */
    port,
    /** WebSocket 连接地址 */
    url,
    /** WebSocket 实例 */
    socket,
    /** WebSocket 连接状态 */
    socketStatus,
    /**
     * 发送消息
     * @param msg 文本消息
     */
    sendMessage,
    /**
     * 发送指令
     * @param command 指令
     */
    sendCommand,
  }
}
