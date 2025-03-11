<script lang="ts" setup>
import { useMagicKeys } from '@vueuse/core'
import { TelegraphCommand } from '~/types'

const { socketStatus, uuid, theyMessages, myMessages, sendMessage, sendCommand } = useWebSocket()
const { morseMap, inputCode, word, transcoder, press, up } = useTelegraph(sendMessage)
const { enter, backspace } = useMagicKeys()

watch(enter, keyDown => keyDown ? press() : up())
watch(backspace, keyDown => keyDown && sendCommand(TelegraphCommand.Backspace))
</script>

<template>
  <div class="h-screen flex flex-col justify-self-center overflow-hidden p10 space-y-4">
    <div class="flex items-center justify-center space-x-2xl">
      <div class="flex flex-col space-y-4">
        <TelegraphStatus :status="socketStatus" prefix="电台" :uuid="uuid" />
        <div class="mx10 rounded-lg bg-gray-1 p5">
          <div class="font-bold">
            They:
          </div>
          <span v-for="msg in theyMessages" :key="msg" class="leading-8 font-serif">{{ `${msg} ` }}</span>
        </div>
        <div class="mx10 rounded-lg bg-gray-1 p5">
          <div class="font-bold leading-relaxed">
            Me:
          </div>
          <span v-for="msg in myMessages" :key="msg" class="leading-8 font-serif">{{ `${msg} ` }}</span>
        </div>
        <!-- <TelegraphCodeMappingTable :morse-map="morseMap" :transcoder="transcoder" /> -->
        <div>{{ word }}</div>
        <input v-model="inputCode" class="text-2xl" type="text" disabled>
        <button class="h-30 w-30 select-none rounded-full border-none" @touchstart="press" @touchend="up">
          PUSH
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
