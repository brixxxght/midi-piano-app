const audioCtx = new AudioContext();
const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626, active: false },
  { note: "Db", key: "S", frequency: 277.183, active: false },
  { note: "D", key: "X", frequency: 293.665, active: false },
  { note: "Eb", key: "D", frequency: 311.127, active: false },
  { note: "E", key: "C", frequency: 329.628, active: false },
  { note: "F", key: "V", frequency: 349.228, active: false },
  { note: "Gb", key: "G", frequency: 369.994, active: false },
  { note: "G", key: "B", frequency: 391.995, active: false },
  { note: "Ab", key: "H", frequency: 415.305, active: false },
  { note: "A", key: "N", frequency: 440, active: false },
  { note: "Bb", key: "J", frequency: 466.164, active: false },
  { note: "B", key: "M", frequency: 493.883, active: false },
];

// key pressed down
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const kbKey = e.code;
  const noteDetail = getNoteDetail(kbKey);

  if (noteDetail == null) return;

  noteDetail.active = true;
  playNotes();

  console.log(noteDetail);
});

// key pressed UP
document.addEventListener("keyup", (e) => {
  if (e.repeat) return;
  const kbKey = e.code;
  const noteDetail = getNoteDetail(kbKey);

  if (noteDetail == null) return;

  noteDetail.active = false;
  playNotes();
  // console.log(e);
});

function getNoteDetail(kbKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` == kbKey);
}

function playNotes() {
  NOTE_DETAILS.forEach((n) => {
    const keyElement = document.querySelector(`[data-note="${n.note}"]`);
    keyElement.classList.toggle("active", n.active);
    if (n.oscillator != null) {
      n.oscillator.stop();
      n.oscillator.disconnect();
    }
  });

  const activeNotes = NOTE_DETAILS.filter((n) => n.active);
  // even out the volume
  const gain = 1 / activeNotes.length;
  activeNotes.forEach((n) => {
    startNote(n, gain);
  });
}

function startNote(noteDetail, gain) {
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = gain;
  const oscillator = audioCtx.createOscillator();
  // passing in the frequency from our note detail
  oscillator.frequency.value = noteDetail.frequency;
  oscillator.type = "wave";
  // connect the sound to the speeaker
  oscillator.connect(gainNode).connect(audioCtx.destination);
  oscillator.start();
  // making the oscillator globally avaivalable where the function is invoked
  noteDetail.oscillator = oscillator;
}
