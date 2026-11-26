//----- Sound (plain Web Audio, no extra library)
// Browsers only allow audio after the first click or key, so startAudio()
// is called from the inputs. Files load in the background.

let audio;
let masterGain;
let sounds = {};
let fireSource;
let fireGain;

const soundFiles = {
  fire: "sfx_Fire.mp3",
  fireStop: "sfx_FireStop.mp3",
  sign: "sfx_Sign.mp3",
  papers: "sfx_Papers.mp3",
  paper: "sfx_Paper.mp3",
  tic: "sfx_Tic.mp3",
  pen1: "sfx_Pen_01.mp3",
  pen2: "sfx_Pen_02.mp3",
  pen3: "sfx_Pen_03.mp3"
};
const fireVolume = { min: 0.15, max: 0.6, library: 0.05 };
const penVolume = 0.12;


function loadSounds() {
  try {
    audio = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    return;
  }
  masterGain = audio.createGain();
  masterGain.connect(audio.destination);

  for (let name in soundFiles) {
    fetch("data/sound/" + soundFiles[name])
      .then(r => r.arrayBuffer())
      .then(data => audio.decodeAudioData(data))
      .then(buffer => {
        sounds[name] = buffer;
        if (name == "fire" && audio.state == "running") startFire();
      })
      .catch(() => {});
  }
}

function startAudio() {
  if (!audio) return;
  if (audio.state != "running") audio.resume();
  startFire();
}

function playSound(name, volume = 1, rate = 1) {
  if (!audio || audio.state != "running" || !sounds[name]) return;
  let source = audio.createBufferSource();
  source.buffer = sounds[name];
  source.playbackRate.value = rate;
  let gain = audio.createGain();
  gain.gain.value = volume;
  source.connect(gain).connect(masterGain);
  source.start();
}

function playPen() {
  let name = random(["pen1", "pen2", "pen3"]);
  playSound(name, random(penVolume * 0.8, penVolume), random(0.9, 1.15));
}

function startFire() {
  if (fireSource || !sounds.fire || audio.state != "running") return;
  fireGain = audio.createGain();
  fireGain.gain.value = 0;
  fireGain.connect(masterGain);
  fireSource = audio.createBufferSource();
  fireSource.buffer = sounds.fire;
  fireSource.loop = true;
  // Skip the few silent ms that mp3 adds at both ends, so the loop has no gap
  fireSource.loopStart = 0.05;
  fireSource.loopEnd = sounds.fire.duration - 0.05;
  fireSource.connect(fireGain);
  fireSource.start();
}

// Called every frame: the fire is louder the more the book is burned
function updateSound() {
  if (!fireGain) return;
  let target = 0;
  if (gameState == "Library") target = fireVolume.library;
  else if (gameState == "Playing" && !bookSaved) {
    let burned = video.currentFrame / video.cantFrames;
    target = lerp(fireVolume.min, fireVolume.max, burned);
  }
  fireGain.gain.setTargetAtTime(target, audio.currentTime, 0.3);
}
