import { playFeedback } from '../site/interaction-audio.js?v=feedback-2';
const button = document.getElementById('sound-toggle');
const label = button.querySelector('.sound-label');
const realtimeFrame = document.getElementById('realtime-scene');
const entrance = document.getElementById('entrance');
const bootSound = document.getElementById('boot-sound');
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
// Every new visit starts with sound enabled; mute applies to this visit only.
let userMuted = false;
let engine = null;
let audible = false;
let sceneEntered = entrance.classList.contains('scene-entered');

function noiseBuffer(context, seconds) {
  const buffer = context.createBuffer(1, Math.round(context.sampleRate * seconds), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function noiseLayer(context, buffer, filterType, frequency, gain, destination) {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = frequency;
  const level = context.createGain();
  level.gain.value = gain;
  source.connect(filter).connect(level).connect(destination);
  source.start();
  return level;
}

function tone(context, type, frequency, gain, destination, cutoff = null) {
  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  const level = context.createGain();
  level.gain.value = gain;
  if (cutoff) {
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    oscillator.connect(filter).connect(level).connect(destination);
  } else {
    oscillator.connect(level).connect(destination);
  }
  oscillator.start();
  return level;
}

function keyboardBuffer(context) {
  const buffer = context.createBuffer(1, Math.round(context.sampleRate * .065), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / context.sampleRate;
    const press = Math.exp(-t * 110);
    const release = t > .024 ? .45 * Math.exp(-(t - .024) * 160) : 0;
    data[i] = ((Math.random() * 2 - 1) * .75 + Math.sin(t * 2 * Math.PI * 1850) * .25) * (press + release);
  }
  return buffer;
}

function officeBus(context, master, pan) {
  const panner = context.createStereoPanner();
  panner.pan.value = pan;
  panner.connect(master);
  const reflection = context.createDelay(.2);
  reflection.delayTime.value = .085 + (pan + 1) * .018;
  const soft = context.createBiquadFilter();
  soft.type = 'lowpass';
  soft.frequency.value = 1250;
  const wet = context.createGain();
  wet.gain.value = .12;
  panner.connect(reflection).connect(soft).connect(wet).connect(master);
  return panner;
}

function playNoise(context, buffer, destination, when, duration, gain, frequency, type = 'bandpass', attack = .004) {
  const source = context.createBufferSource();
  source.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = .65;
  const level = context.createGain();
  level.gain.setValueAtTime(0, when);
  level.gain.linearRampToValueAtTime(gain, when + attack);
  level.gain.exponentialRampToValueAtTime(.00001, when + duration);
  source.connect(filter).connect(level).connect(destination);
  source.start(when);
  source.stop(when + duration + .02);
  source.onended = () => { source.disconnect(); filter.disconnect(); level.disconnect(); };
}

function playTone(context, destination, when, frequency, duration, gain) {
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, when);
  const level = context.createGain();
  level.gain.setValueAtTime(0, when);
  level.gain.linearRampToValueAtTime(gain, when + .009);
  level.gain.exponentialRampToValueAtTime(.00001, when + duration);
  oscillator.connect(level).connect(destination);
  oscillator.start(when);
  oscillator.stop(when + duration + .02);
  oscillator.onended = () => { oscillator.disconnect(); level.disconnect(); };
}

function startOfficeSounds(context, master) {
  const click = keyboardBuffer(context);
  const rustle = noiseBuffer(context, .8);
  const paper = rustle.getChannelData(0);
  for (let i = 0; i < paper.length; i++) {
    const t = i / context.sampleRate;
    paper[i] *= .5 + .25 * Math.sin(t * 83) + .18 * Math.sin(t * 147);
  }
  const desks = [-.72, -.32, .12, .46, .78].map((pan, i) => ({
    bus: officeBus(context, master, pan), next: .4 + i * .87,
    remaining: 6 + i * 2, gain: [.095, .065, .085, .055, .072][i], frequency: [1650, 1100, 1450, 950, 1250][i],
  }));
  let nextPage = 3.7;
  let nextPhone = 8.3;
  let nextNotification = 2.4;
  let notificationIndex = 0;
  let hangup = null;
  setInterval(() => {
    if (context.state !== 'running' || !audible || document.hidden) return;
    const now = context.currentTime;
    for (const desk of desks) {
      if (now < desk.next) continue;
      if (desk.remaining <= 0) {
        desk.remaining = 8 + Math.floor(Math.random() * 16);
        desk.next = now + .35 + Math.random() * 1.8;
        continue;
      }
      playNoise(context, click, desk.bus, now, .065, desk.gain * (.7 + Math.random() * .6),
        desk.frequency + Math.random() * 350, 'lowpass', .001);
      // Occasional space/return keys have a lower, hollow keycap impact.
      if (desk.remaining % 7 === 0) playTone(context, desk.bus, now, 185 + Math.random() * 80, .045, .009);
      desk.remaining--;
      desk.next = now + .075 + Math.random() * .15;
    }
    if (now >= nextNotification) {
      const desk = desks[notificationIndex++ % desks.length];
      const notes = [[523, 784], [659, 880], [587, 740]][notificationIndex % 3];
      playTone(context, desk.bus, now, notes[0], .16, .017);
      playTone(context, desk.bus, now + .095, notes[1], .24, .014);
      nextNotification = now + 3.5 + Math.random() * 4.5;
    }
    if (now >= nextPage) {
      const desk = desks[Math.floor(Math.random() * desks.length)];
      playNoise(context, rustle, desk.bus, now, .56, .011, 1050, 'lowpass', .11);
      playNoise(context, rustle, desk.bus, now + .23, .24, .007, 690, 'bandpass', .035);
      nextPage = now + 5.2 + Math.random() * 6.8;
    }
    if (now >= nextPhone) {
      const desk = desks[Math.floor(Math.random() * desks.length)];
      // Receiver lift: muted mechanical release and a brief, distant line tone.
      playNoise(context, click, desk.bus, now, .045, .022, 1250, 'lowpass');
      playTone(context, desk.bus, now + .035, 260, .08, .008);
      playTone(context, desk.bus, now + .12, 350, .24, .0024);
      playTone(context, desk.bus, now + .12, 440, .24, .0019);
      hangup = { at: now + 4.5 + Math.random() * 4, desk };
      nextPhone = now + 17 + Math.random() * 12;
    }
    if (hangup && now >= hangup.at) {
      const { bus } = hangup.desk;
      playTone(context, bus, now, 170, .12, .016);
      playNoise(context, click, bus, now, .05, .028, 950, 'lowpass');
      playNoise(context, click, bus, now + .065, .032, .014, 1400, 'lowpass');
      hangup = null;
    }
  }, 75);
}

function startDistantSiren(context, master) {
  const oscillator = context.createOscillator();
  oscillator.type = 'triangle';
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1050;
  filter.Q.value = .55;
  const level = context.createGain();
  level.gain.value = 0;
  const panner = context.createStereoPanner();
  panner.pan.value = -.85;
  oscillator.connect(filter).connect(level).connect(panner).connect(master);
  oscillator.start();
  setInterval(() => {
    if (context.state !== 'running') return;
    const now = context.currentTime;
    const phase = now % 32;
    const pass = Math.max(0, Math.min(1, (phase - 2) / 13));
    const distance = phase > 2 && phase < 15 ? Math.sin(Math.PI * pass) ** 1.4 : 0;
    const doppler = 1.04 - .08 * pass;
    oscillator.frequency.setTargetAtTime((615 + 195 * Math.sin(now * 2.5)) * doppler, now, .075);
    filter.frequency.setTargetAtTime(730 + distance * 420, now, .25);
    panner.pan.setTargetAtTime(-.92 + pass * .62, now, .3);
    level.gain.setTargetAtTime(.020 * distance, now, .2);
  }, 100);
}

function targetFoundSignal(unit = .07) {
  const alphabet = { T: '-', A: '.-', R: '.-.', G: '--.', E: '.',
    F: '..-.', O: '---', U: '..-', N: '-.', D: '-..' };
  const pulses = [];
  let cursor = 0;
  for (const [wordIndex, word] of 'TARGET FOUND'.split(' ').entries()) {
    if (wordIndex) cursor += unit * 7;
    for (const [letterIndex, letter] of [...word].entries()) {
      if (letterIndex) cursor += unit * 3;
      const code = alphabet[letter];
      for (const [symbolIndex, symbol] of [...code].entries()) {
        if (symbolIndex) cursor += unit;
        const duration = unit * (symbol === '-' ? 3 : 1);
        pulses.push({ at: cursor, duration });
        cursor += duration;
      }
    }
  }
  return { pulses, duration: cursor };
}

function playSignal(context, destination, when, frequency, duration, gain) {
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  const amplitude = context.createGain();
  amplitude.gain.setValueAtTime(0, when);
  amplitude.gain.linearRampToValueAtTime(gain, when + .006);
  // A sustained dash, with softened edges, stays distinct from a dot.
  amplitude.gain.setValueAtTime(gain, when + duration - .008);
  amplitude.gain.linearRampToValueAtTime(0, when + duration);
  oscillator.connect(amplitude).connect(destination);
  oscillator.start(when);
  oscillator.stop(when + duration + .01);
  oscillator.onended = () => { oscillator.disconnect(); amplitude.disconnect(); };
}

function playTargetFound(context, destination, now) {
  for (const [at, pitch, duration] of [[0, 880, .14], [.18, 1175, .16],
    [.4, 880, .14], [.58, 1175, .20]]) {
    playSignal(context, destination, now + at, pitch, duration, .082);
  }
  const code = targetFoundSignal();
  for (const pulse of code.pulses) {
    playSignal(context, destination, now + 1 + pulse.at, 720, pulse.duration, .058);
  }
  return 1 + code.duration;
}

function createAirshipVoice(context, master, index) {
  const level = context.createGain();
  level.gain.value = 0;
  const glass = context.createBiquadFilter();
  glass.type = 'lowpass';
  glass.frequency.value = 250;
  glass.Q.value = .55;
  const pan = context.createStereoPanner();
  pan.pan.value = -.7;
  const presence = context.createGain();
  presence.gain.value = 2.4;
  level.connect(presence).connect(glass).connect(pan).connect(master);
  const rotor = context.createGain();
  rotor.gain.value = .72;
  rotor.connect(level);
  const oscillators = [];
  function engineTone(type, frequency, gain, destination) {
    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    const amplitude = context.createGain();
    amplitude.gain.value = gain;
    oscillator.connect(amplitude).connect(destination);
    oscillator.start();
    oscillators.push({ oscillator, frequency });
  }
  const tuning = index ? .91 : 1;
  // Sub-bass weight plus audible upper harmonics for small speakers.
  engineTone('sine', 39 * tuning, .058, level);
  engineTone('triangle', 78 * tuning, .032, rotor);
  engineTone('sawtooth', 53 * tuning, .029, rotor);
  engineTone('triangle', 117 * tuning, .014, rotor);
  engineTone('triangle', 156 * tuning, .016, rotor);
  const turbulence = noiseBuffer(context, 6.3 + index * .7);
  noiseLayer(context, turbulence, 'lowpass', 170, .10, level);
  noiseLayer(context, turbulence, 'bandpass', 360, .12, rotor);
  // Audio-rate blade pulses retain their rhythm independently of frame rate.
  const blades = context.createOscillator();
  blades.type = 'sine';
  blades.frequency.value = (index ? 10.2 : 12.3);
  const bladeDepth = context.createGain();
  bladeDepth.gain.value = .26;
  blades.connect(bladeDepth).connect(rotor.gain);
  blades.start();
  oscillators.push({ oscillator: blades, frequency: blades.frequency.value });
  return { level, glass, pan, oscillators };
}

function createEngine() {
  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.value = 0;
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -14;
  compressor.knee.value = 12;
  compressor.ratio.value = 4;
  compressor.attack.value = .006;
  compressor.release.value = .22;
  master.connect(compressor).connect(context.destination);
  const rainNoise = noiseBuffer(context, 5);
  const distantRain = noiseLayer(context, rainNoise, 'lowpass', 760, .085, master);
  noiseLayer(context, rainNoise, 'bandpass', 240, .029, master);
  const roomNoise = noiseBuffer(context, 7);
  noiseLayer(context, roomNoise, 'lowpass', 1500, .026, master);
  noiseLayer(context, roomNoise, 'bandpass', 390, .025, master); // building ventilation / computer fans
  const rainDrift = context.createOscillator();
  rainDrift.frequency.value = .11;
  const driftDepth = context.createGain();
  driftDepth.gain.value = .012;
  rainDrift.connect(driftDepth).connect(distantRain.gain);
  rainDrift.start();
  tone(context, 'sine', 58, .006, master);
  tone(context, 'sine', 116, .0028, master);
  tone(context, 'triangle', 103, .0024, master);
  const airships = [0, 1].map(index => createAirshipVoice(context, master, index));
  const neonBus = officeBus(context, master, .82);
  const tube = tone(context, 'sawtooth', 100, 0, neonBus, 620);
  const electrical = noiseLayer(context, rainNoise, 'bandpass', 1250, 0, neonBus);
  const scan = tone(context, 'sine', 185, 0, master, 500);
  startOfficeSounds(context, master);
  startDistantSiren(context, master);
  return { context, master, airships, tube, electrical, scan,
    bubbleNoise: noiseBuffer(context, .3) };
}

function renderButton() {
  button.dataset.sound = audible ? 'on' : userMuted ? 'off' : 'pending';
  button.setAttribute('aria-pressed', String(audible));
  button.setAttribute('aria-label', audible ? 'Mute ambient sound' : userMuted ? 'Enable ambient sound' : 'Sound enabled automatically; click to allow playback');
  button.title = audible ? 'Mute sound' : userMuted ? 'Enable sound' : 'Sound starts automatically when permitted, or after your first interaction';
  label.textContent = audible ? 'SOUND ON' : userMuted ? 'SOUND OFF' : 'SOUND AUTO';
  if (bootSound) {
    const unlocked = engine?.context.state === 'running' && !userMuted;
    bootSound.textContent = unlocked ? 'SOUND READY' : 'CLICK FOR SOUND';
    bootSound.setAttribute('aria-label', unlocked ? 'Sound will fade in after the scene opens' : 'Enable sound after the scene opens');
  }
}

function prepareEngine() {
  if (!engine && AudioContextClass) {
    engine = createEngine();
    engine.context.addEventListener('statechange', syncAudioState);
  }
}
entrance.addEventListener('scene:preparing', () => {
  if (!userMuted) {
    try { prepareEngine(); } catch (error) { console.warn('Ambient audio preparation skipped:', error); }
  }
});
async function startSound() {
  if (!AudioContextClass || document.hidden) return;
  userMuted = false;
  try {
    prepareEngine();
    // Unlock during loading, but keep the mix silent until the iris has opened.
    engine.master.gain.setTargetAtTime(sceneEntered ? 1.45 : 0, engine.context.currentTime, sceneEntered ? 1.05 : .02);
    await engine.context.resume();
    syncAudioState();
  } catch (error) {
    console.warn('Ambient audio could not start:', error);
  }
}

function syncAudioState() {
  audible = Boolean(sceneEntered && engine && engine.context.state === 'running' && !userMuted && !document.hidden);
  renderButton();
}

function muteSound() {
  audible = false;
  userMuted = true;
  if (engine) engine.master.gain.setTargetAtTime(0, engine.context.currentTime, .06);
  // After the fade, stop DSP as well as output. Re-enabling sound resumes the
  // existing graph, so oscillator/buffer layers never accumulate across toggles.
  setTimeout(() => {
    if (userMuted && engine?.context.state === 'running') engine.context.suspend();
  }, 250);
  renderButton();
}

button.addEventListener('click', () => {
  if (audible) muteSound();
  else startSound();
});
bootSound?.addEventListener('click', startSound);
entrance.addEventListener('scene:entered', () => {
  sceneEntered = true;
  if (!userMuted) startSound();
});
entrance.addEventListener('scene:leaving', () => {
  if (engine) engine.master.gain.setTargetAtTime(0, engine.context.currentTime, .09);
});
entrance.addEventListener('scene:handoff', () => {
  try { sessionStorage.setItem('canqi-intro-sound', !userMuted && engine?.context.state === 'running' ? 'on' : 'off'); } catch {}
});
entrance.addEventListener('scene:returned', () => {
  if (!userMuted) startSound();
});

document.getElementById('entrance').addEventListener('scene:bubble-sound', event => {
  if (!engine || !audible || document.hidden) return;
  const { context, master, bubbleNoise } = engine;
  const now = context.currentTime;
  const kind = event.detail.kind;
  const opening = kind === 'open';
  const strength = Math.max(.25, Math.min(1, Number(event.detail.level) || 1));
  const panner = context.createStereoPanner();
  panner.pan.value = Math.max(-.8, Math.min(.8, event.detail.pan));
  panner.connect(master);
  if (kind === 'target') {
    const duration = playTargetFound(context, panner, now);
    setTimeout(() => panner.disconnect(), (duration + .4) * 1000);
    return;
  }
  if (kind === 'hover' || kind === 'break') {
    playFeedback(context,panner,kind,strength);
    setTimeout(() => panner.disconnect(), 600);
    return;
  }
  playTone(context, panner, now, opening ? 740 : 480, .12, .088 * strength);
  playTone(context, panner, now + .065, opening ? 1110 : 190, .17, .065 * strength);
  if (!opening) {
    playNoise(context, bubbleNoise, panner, now + (kind === 'break' ? 0 : .16),
      kind === 'break' ? .19 : .11, .115 * strength, 1900);
  }
  setTimeout(() => panner.disconnect(), 700);
});

// Browsers need a gesture before audio can play. The first interaction with the
// scene starts the default ambience; the explicit button also works immediately.
function unlockFromGesture(event) {
  if (!audible && !userMuted && !button.contains(event.target)) startSound();
}
document.addEventListener('pointerdown', unlockFromGesture);
// Touch browsers may grant audio activation only on release or click.
document.addEventListener('pointerup', unlockFromGesture);
document.addEventListener('click', unlockFromGesture);
document.addEventListener('keydown', event => {
  if (!audible && !userMuted && event.key !== 'Tab') startSound();
});

window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== realtimeFrame.contentWindow ||
      event.data?.type !== 'canqi:ambience-state' || !engine || engine.context.state !== 'running') return;
  const searchlight = Math.max(0, Math.min(1, Number(event.data.searchlight) || 0));
  const neon = Math.max(0, Math.min(1, Number(event.data.neon) || 0));
  const spark = Math.max(0, Math.min(1, Number(event.data.spark) || 0));
  const now = engine.context.currentTime;
  const states = Array.isArray(event.data.airships) ? event.data.airships : [];
  engine.airships.forEach((voice, index) => {
    const state = states[index] || {};
    const level = Math.max(0, Math.min(1, Number(state.level) || 0));
    const pan = Math.max(-.92, Math.min(.92, Number(state.pan) || 0));
    const cutoff = Math.max(190, Math.min(750, Number(state.cutoff) || 190));
    const doppler = Math.max(.98, Math.min(1.02, Number(state.doppler) || 1));
    voice.level.gain.setTargetAtTime(level, now, .28);
    voice.pan.pan.setTargetAtTime(pan, now, .3);
    voice.glass.frequency.setTargetAtTime(cutoff, now, .35);
    for (const { oscillator, frequency } of voice.oscillators) {
      oscillator.frequency.setTargetAtTime(frequency * doppler, now, .3);
    }
  });
  engine.tube.gain.setTargetAtTime(.0016 * neon, now, .025);
  engine.electrical.gain.setTargetAtTime(.0038 * spark + .00035 * neon, now, .018);
  engine.scan.gain.setTargetAtTime(.0015 * searchlight, now, .18);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) engine?.context.suspend();
  else if (!userMuted) startSound();
});

if (!AudioContextClass) {
  button.disabled = true;
  button.setAttribute('aria-label', 'Ambient sound is unavailable in this browser');
  label.textContent = 'NO AUDIO';
  if (bootSound) { bootSound.disabled = true; bootSound.textContent = 'AUDIO UNAVAILABLE'; }
} else {
  renderButton();
  // Autoplay succeeds where permitted. Otherwise resume remains pending until
  // the first pointer/keyboard gesture handled above; never report false playback.
  startSound();
}
