<script lang="ts" setup>
defineProps<{
  morseMap: Map<string, string>
  transcoder: (morse: string) => string
}>()
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="morseCode in morseMap" :key="morseCode[0]" class="space-x-2">
      <code class="bg-gray-1 font-bold">{{ transcoder(morseCode[0]) }}</code>
      <span>{{ morseCode[1] }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>
