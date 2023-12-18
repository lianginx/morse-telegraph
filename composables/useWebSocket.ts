enum Status {
  Online = '在线',
  Error = '错误',
  Offline = '离线',
}

enum Command {
  Backspace = '/backspace',
  Clear = '/clear',
  Br = '/br',
}

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
  const theyMessages = ref<string[]>([])

  const myMessages = ref<string[]>([])

  const socketStatus = ref<Status>(Status.Offline)

  const url = `${protocol}://${hostname}:${port}`

  const socket = new WebSocket(url)

  socket.onopen = () => {
    socketStatus.value = Status.Online
  }

  socket.onclose = () => {
    socketStatus.value = Status.Offline
  }

  socket.onerror = (e) => {
    console.error('WebSocket Error:', e)
    socketStatus.value = Status.Error
  }

  socket.onmessage = (e) => {
    const msg = e.data as string
    if (msg.startsWith('/'))
      handleCommand(theyMessages, msg as Command)
    else
      theyMessages.value.push(msg)
  }

  onUnmounted(() => {
    // 关闭连接
    socket.close()
  })

  function handleCommand(messages: Ref<string[]>, command: Command) {
    switch (command) {
      case Command.Backspace:
        messages.value.pop()
        break
      case Command.Clear:
        messages.value = []
        break
      case Command.Br:
        messages.value.push('\n')
        break
      default:
        throw new Error('未知指令')
    }
  }

  function send(msg: string) {
    socket.send(msg)
    myMessages.value.push(msg)
  }

  function sendCommand(command: Command) {
    socket.send(command)
    handleCommand(myMessages, command)
  }
  return {
    /** 枚举 - WebSocket 连接状态 */
    Status,
    /** 枚举 - 指令 */
    Command,
    /** 接收的消息列表 */
    theyMessages,
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
    send,
    /**
     * 发送指令
     * @param command 指令
     */
    sendCommand,
  }
}
