let oscillator: OscillatorNode | null
let audioContext: AudioContext | null

export function startDi() {
  if (!audioContext)
    audioContext = new AudioContext()

  oscillator = audioContext.createOscillator()
  oscillator.type = 'square'
  oscillator.frequency.value = 800

  oscillator.connect(audioContext.destination)
  oscillator.start()
}

export function stopDi() {
  oscillator?.stop()
  oscillator?.disconnect()
  oscillator = null
}
