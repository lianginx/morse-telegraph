let oscillator: OscillatorNode | null
let audioContext: AudioContext | null

export function startOscillate() {
  if (!audioContext)
    audioContext = new AudioContext()

  oscillator = audioContext.createOscillator()
  oscillator.type = 'square'
  oscillator.frequency.value = 800

  oscillator.connect(audioContext.destination)
  oscillator.start()
}

export function stopOscillate() {
  oscillator?.stop()
  oscillator?.disconnect()
  oscillator = null
}
