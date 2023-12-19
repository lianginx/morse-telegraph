<script lang="ts" setup>
import { useMagicKeys } from '@vueuse/core'

const { Command, socketStatus, theyMessages, myMessages, send, sendCommand } = useWebSocket()
const { morseMap, inputCode, word, transcoder, press, up } = useTelegraph(send)
const { enter, backspace } = useMagicKeys()

watch(enter, (keyDown) => {
  keyDown ? press() : up()
})

watch(backspace, (keyDown) => {
  keyDown && sendCommand(Command.Backspace)
})
</script>

<template>
  <div class="h-screen overflow-hidden p10 flex flex-col justify-self-center space-y-4">
    <div class="flex justify-center items-center space-x-2xl">
      <div class="flex flex-col space-y-4 items-center justify-center">
        <div class="text-green-5">
          电台{{ socketStatus }}
        </div>
        <div>{{ word }}</div>
        <input
          v-model="inputCode"
          class="text-2xl"
          type="text"
          disabled
        >
        <button
          class="w-20 h-20 rounded-full bg-red border-none text-white hover:bg-red-5 active:bg-red-6"
          @mousedown="press"
          @mouseup="up"
        >
          Push
        </button>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="morseCode in morseMap"
          :key="morseCode[0]"
          class="space-x-2"
        >
          <code class="font-bold bg-gray-1">{{ transcoder(morseCode[0]) }}</code>
          <span>{{ morseCode[1] }}</span>
        </div>
      </div>
    </div>
    <div class="bg-gray-1 mx10 p5 rounded-lg">
      <div class="font-bold leading-relaxed">
        Me:
      </div>
      <span
        v-for="msg in myMessages"
        :key="msg"
        class="leading-8 font-serif"
      >{{ `${msg} ` }}</span>
    </div>
    <div class="mx10 bg-gray-1 p5 rounded-lg">
      <div class="font-bold">
        They:
      </div>
      <span
        v-for="msg in theyMessages"
        :key="msg"
        class="leading-8 font-serif"
      >{{ `${msg} ` }}</span>
    </div>
  </div>
</template>
