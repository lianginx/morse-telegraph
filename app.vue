<!-- eslint-disable no-console -->
<script lang="ts" setup>
import { watchDebounced, useMagicKeys } from '@vueuse/core'

const theyMessage = ref<string[]>([])
const myMessages = ref<string[]>([])
const message = ref('')
const code = ref('')

let status: 'down' | 'up' = 'up'
let time: number | undefined

function start() {
  status = 'down'
  startDi()
  time = Date.now()
}

const interval = 300

function stop() {
  status = 'up'
  stopDi()

  if (Date.now() - time! < (interval / 2))
    code.value += '·'
  else
    code.value += '﹣'
}

watchDebounced(code, (newCode) => {
  if (status === 'down')
    return
  message.value += morseMap[newCode] || ''
  code.value = ''
}, { debounce: interval })

watchDebounced(code, () => {
  if (status === 'down')
    return
  ws.send(message.value)
  myMessages.value.push(message.value)
  message.value = ''
}, { debounce: interval * 2 })

const morseMap: { [key: string]: string } = {
  "·﹣": "A",
  "﹣···": "B",
  "﹣·﹣·": "C",
  "﹣··": "D",
  "·": "E",
  "··﹣·": "F",
  "﹣﹣·": "G",
  "····": "H",
  "··": "I",
  "·﹣﹣﹣": "J",
  "﹣·﹣": "K",
  "·﹣··": "L",
  "﹣﹣": "M",
  "﹣·": "N",
  "﹣﹣﹣": "O",
  "·﹣﹣·": "P",
  "﹣﹣·﹣": "Q",
  "·﹣.": "R",
  "···": "S",
  "﹣": "T",
  "··﹣": "U",
  "···﹣": "V",
  "·﹣﹣": "W",
  "﹣··﹣": "X",
  "﹣·﹣﹣": "Y",
  "﹣﹣··": "Z"
}

const { space, enter, backspace } = useMagicKeys()

watch([space, enter], (keys) => {
  if (keys.includes(true))
    start()
  else
    stop()
})

watch(backspace, (keyDown) => {
  if (keyDown) {
    myMessages.value = []
    ws.send('/clear')
  }
})

enum WsStatus {
  "online" = '在线',
  "error" = '错误',
  "offline" = '离线'
}

const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:8080`)
const wsStatus = ref<WsStatus>(WsStatus.offline)

ws.onopen = (e) => {
  wsStatus.value = WsStatus.online
}

ws.onclose = (e) => {
  wsStatus.value = WsStatus.offline
}

ws.onerror = (e) => {
  wsStatus.value = WsStatus.error
}

ws.onmessage = (e) => {
  const msg = e.data as string
  if (msg.startsWith('/')) {
    if (msg === '/clear')
      theyMessage.value = []
    if (msg === '/br')
      theyMessage.value.push('\n')
  } else {
    theyMessage.value.push(msg)
  }
}
</script>

<template>
  <div class="h-screen overflow-hidden p10 flex flex-col justify-self-center space-y-4">
    <div class="flex justify-center items-center space-x-2xl">
      <div class="flex flex-col space-y-4 items-center justify-center ">
        <div class="text-green-5">电台{{ wsStatus }}</div>
        <div>{{ message }}</div>
        <input class="text-2xl"
               type="text"
               disabled
               v-model="code">
        <button class="w-20 h-20 rounded-full bg-red border-none text-white  hover:bg-red-5 active:bg-red-6"
                @mousedown="start"
                @mouseup="stop">Push</button>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(text, code) in morseMap"
             class="space-x-2">
          <code class="font-bold bg-gray-1">{{ code }}</code>
          <span>{{ text }}</span>
        </div>
      </div>
    </div>
    <div class="mx10 bg-gray-1 p5 rounded-lg">
      <div class="font-bold leading-relaxed">Me:</div>
      <span class="leading-8 font-serif"
            v-for="msg in myMessages">{{ msg + ' ' }}</span>
    </div>
    <div class="mx10 bg-gray-1 p5 rounded-lg">
      <div class="font-bold">They:</div>
      <span class="leading-8 font-serif"
            v-for="msg in theyMessage">{{ msg + ' ' }}</span>
    </div>
  </div>
</template>
