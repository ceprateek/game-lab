// Synthetic sound effects using Web Audio API — no audio files needed
let ctx = null

function getCtx() {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function playTone(freq, type, duration, volume = 0.3) {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + duration)
}

function playNoise(duration, volume = 0.15) {
  const c = getCtx()
  const bufferSize = c.sampleRate * duration
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const src = c.createBufferSource()
  src.buffer = buffer
  const gain = c.createGain()
  gain.gain.setValueAtTime(volume, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  const filter = c.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 3000
  src.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)
  src.start()
}

const sounds = {
  paddleHit() {
    playTone(440, 'triangle', 0.1, 0.25)
  },

  wallHit() {
    playTone(220, 'sine', 0.06, 0.12)
  },

  brickHit() {
    playTone(587, 'square', 0.06, 0.15)
  },

  brickBreak() {
    playTone(784, 'square', 0.08, 0.2)
    playNoise(0.08, 0.1)
  },

  launch() {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.12)
    gain.gain.setValueAtTime(0.15, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.15)
  },

  loseLife() {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, c.currentTime + 0.4)
    gain.gain.setValueAtTime(0.25, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.4)
  },

  gameOver() {
    const c = getCtx()
    const notes = [350, 300, 250, 180]
    notes.forEach((freq, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = c.currentTime + i * 0.18
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
      osc.connect(gain)
      gain.connect(c.destination)
      osc.start(t)
      osc.stop(t + 0.25)
    })
  },

  win() {
    const c = getCtx()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      const t = c.currentTime + i * 0.12
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      osc.connect(gain)
      gain.connect(c.destination)
      osc.start(t)
      osc.stop(t + 0.3)
    })
  },
}

export default sounds
