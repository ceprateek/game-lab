// Synthetic sound effects using Web Audio API
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

const sounds = {
  placeBomb() {
    playTone(120, 'sine', 0.15, 0.2)
    setTimeout(() => playTone(80, 'sine', 0.1, 0.15), 50)
  },

  explode() {
    const c = getCtx()
    // Noise burst
    const bufferSize = c.sampleRate * 0.3
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
    }
    const noise = c.createBufferSource()
    noise.buffer = buffer
    const noiseGain = c.createGain()
    noiseGain.gain.setValueAtTime(0.3, c.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3)
    noise.connect(noiseGain)
    noiseGain.connect(c.destination)
    noise.start(c.currentTime)

    // Low rumble
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(30, c.currentTime + 0.4)
    gain.gain.setValueAtTime(0.25, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.4)
  },

  enemyDeath() {
    playTone(600, 'square', 0.08, 0.15)
    setTimeout(() => playTone(800, 'square', 0.08, 0.12), 60)
    setTimeout(() => playTone(1000, 'square', 0.12, 0.1), 120)
  },

  powerUp() {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(400, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.2)
    gain.gain.setValueAtTime(0.2, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.25)
  },

  playerDeath() {
    const c = getCtx()
    const notes = [400, 350, 280, 200, 140]
    notes.forEach((freq, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = c.currentTime + i * 0.12
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      osc.connect(gain)
      gain.connect(c.destination)
      osc.start(t)
      osc.stop(t + 0.2)
    })
  },

  levelComplete() {
    const c = getCtx()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      const t = c.currentTime + i * 0.15
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      osc.connect(gain)
      gain.connect(c.destination)
      osc.start(t)
      osc.stop(t + 0.3)
    })
  },
}

export default sounds
