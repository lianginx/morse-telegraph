<script lang="ts" setup>
import { SocketStatus } from '~/types'

defineProps<{
  status: SocketStatus
  prefix?: string
  suffix?: string
  uuid?: string
}>()

const colorMap = {
  [SocketStatus.Online]: 'bg-green',
  [SocketStatus.Error]: 'bg-red',
  [SocketStatus.Offline]: 'bg-gray',
}
</script>

<template>
  <div class="flex items-center space-x-1">
    <div class="h-2 w-2" :class="colorMap[status]" />
    <span>
      <span v-if="prefix">{{ prefix }}</span>
      <span>{{ status }}</span>
      <span v-if="suffix">{{ suffix }}</span>
    </span>
    <code class="rounded bg-gray-1 px-1 text-xs">
      {{ uuid?.slice(-6) }}
    </code>
  </div>
</template>
