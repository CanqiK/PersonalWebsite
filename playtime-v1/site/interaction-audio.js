// A small shared synthesizer: selection < confirmation < spatial transition.
// No samples, persistent oscillators or external audio files.
export function playFeedback(context, destination, kind, strength = 1) {
  if (context.state !== 'running') return;
  const now = context.currentTime;
  const level = Math.max(0, Math.min(1, strength));
  function voice(type, from, to, duration, gain, delay = 0, pan = 0, fm = 0) {
    const at = now + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const filter = context.createBiquadFilter();
    const stereo = context.createStereoPanner();
    const nodes = [oscillator, envelope, filter, stereo];
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, at);
    oscillator.frequency.exponentialRampToValueAtTime(to, at + duration);
    filter.type = 'lowpass';
    filter.frequency.value = 3200;
    stereo.pan.value = pan;
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(gain * level, at + .008);
    envelope.gain.exponentialRampToValueAtTime(.00001, at + duration);
    oscillator.connect(filter).connect(envelope).connect(stereo).connect(destination);
    if (fm) {
      const modulator = context.createOscillator();
      const depth = context.createGain();
      modulator.frequency.setValueAtTime(from * 2.7, at);
      modulator.frequency.exponentialRampToValueAtTime(to * 1.4, at + duration);
      depth.gain.setValueAtTime(fm, at);
      depth.gain.exponentialRampToValueAtTime(.01, at + duration);
      modulator.connect(depth).connect(oscillator.frequency);
      modulator.start(at); modulator.stop(at + duration + .02);
      nodes.push(modulator, depth);
    }
    oscillator.start(at); oscillator.stop(at + duration + .025);
    oscillator.onended = () => nodes.forEach(node => node.disconnect());
  }
  function grain(duration, gain, from, to, delay = 0, pan = 0, attack = .006) {
    const at = now + delay;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const data = buffer.getChannelData(0);
    let sample = 0;
    for (let i = 0; i < data.length; i++) {
      if (i % 5 === 0) sample = Math.round((Math.random() * 2 - 1) * 12) / 12;
      data[i] = sample;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    const stereo = context.createStereoPanner();
    source.buffer = buffer;
    filter.type = 'bandpass'; filter.Q.value = .8;
    filter.frequency.setValueAtTime(from, at);
    filter.frequency.exponentialRampToValueAtTime(to, at + duration);
    stereo.pan.value = pan;
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(gain * level, at + attack);
    envelope.gain.exponentialRampToValueAtTime(.00001, at + duration);
    source.connect(filter).connect(envelope).connect(stereo).connect(destination);
    source.start(at); source.stop(at + duration + .02);
    source.onended = () => [source,filter,envelope,stereo].forEach(node => node.disconnect());
  }
  if (kind === 'hover') {
    voice('triangle', 650, 980, .10, .042);
    voice('sine', 1300, 1500, .065, .016, .025);
  } else if (kind === 'break') {
    voice('triangle', 175, 48, .25, .20);
    voice('sine', 530, 145, .22, .14, 0, 0, 240);
    grain(.16, .17, 2600, 560);
    voice('square', 920, 610, .09, .032, .07, .12);
  } else if (kind === 'drop') {
    grain(.56, .12, 3200, 440, 0, -.12, .10);
    voice('triangle', 460, 130, .48, .075);
    voice('triangle', 130, 55, .17, .13, .53);
    grain(.13, .085, 1400, 650, .53);
  } else if (kind === 'scatter') {
    grain(.42, .12, 720, 3400, 0, -.6, .025);
    grain(.44, .10, 1100, 2800, .06, .6, .025);
    [330,440,660].forEach((note,index) => voice('triangle',note,note * 1.008,.22,.055,index * .065,(index - 1) * .6));
  }
}

export function createIntroAudio(enabled = true) {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!enabled || !Audio) return { cue() {}, dispose() {} };
  const context = new Audio();
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -14; compressor.ratio.value = 4;
  compressor.connect(context.destination);
  const resume = () => context.state === 'suspended' ? context.resume().catch(()=>{}) : Promise.resolve();
  // Same-origin playback may resume automatically after Got Him. If a browser
  // requires another gesture, only future cues play: never queue a late burst.
  const ready = Promise.race([resume(),new Promise(resolve=>setTimeout(resolve,80))]);
  document.addEventListener('pointerdown',resume);
  document.addEventListener('keydown',resume);
  let disposed = false;
  return {
    ready,
    cue(kind) { if (!disposed) playFeedback(context,compressor,kind); },
    dispose() {
      if (disposed) return;
      disposed = true;
      document.removeEventListener('pointerdown',resume);
      document.removeEventListener('keydown',resume);
      context.close().catch(()=>{});
    }
  };
}
