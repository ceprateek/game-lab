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
  tap() {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(500, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.08)
    gain.gain.setValueAtTime(0.25, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.08)
  },

  remove() {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.06)
    gain.gain.setValueAtTime(0.2, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.06)
  },

  orderSuccess() {
    const c = getCtx()
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      const t = c.currentTime + i * 0.1
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      osc.connect(gain)
      gain.connect(c.destination)
      osc.start(t)
      osc.stop(t + 0.2)
    })
  },

  orderWrong() {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(180, c.currentTime + 0.35)
    gain.gain.setValueAtTime(0.2, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.35)
  },

  countdown() {
    playTone(880, 'sine', 0.04, 0.15)
  },

  pack() {
    const c = getCtx()
    // Satisfying "snap shut" sound
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(600, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15)
    gain.gain.setValueAtTime(0.3, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.15)
    // Short "click" overlay
    setTimeout(() => playTone(1200, 'square', 0.03, 0.1), 80)
  },

  sessionComplete() {
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
}

export default sounds
