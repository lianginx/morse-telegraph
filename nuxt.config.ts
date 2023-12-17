import { presetAttributify, presetUno, transformerVariantGroup } from 'unocss'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt'],
  unocss: {
    presets: [presetUno(), presetAttributify()],
    transformers: [transformerVariantGroup()],
  },
  ssr: false,
})
