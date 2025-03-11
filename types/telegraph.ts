export type MessageType = 'message' | 'command' | 'connection'

/** WebSocket 连接状态 */
export enum SocketStatus {
  Online = '在线',
  Error = '错误',
  Offline = '离线',
}

/** 电报指令 */
export enum TelegraphCommand {
  Backspace = '/backspace',
  Clear = '/clear',
  Br = '/br',
}

export interface ResponseData {
  sendAt?: number
  type: MessageType
  uuid?: string
  message?: string
  command?: TelegraphCommand
  sender?: string
}

export enum ResponseCode {
  Success = 0,
  Error = 1,
}

export interface Response {
  code: ResponseCode
  msg: string
  data: ResponseData
}
