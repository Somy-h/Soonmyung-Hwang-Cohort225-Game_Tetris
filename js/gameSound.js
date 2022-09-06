export class GameSound {
  constructor() {
    this.sounds = [];
    this.muted = false;
    this.setup();
  }

  setup () {
    for (let key in config.sound) {
    //config.sound.keys.forEach(key => {
      let audioEl = document.createElement('audio');
      audioEl.src = config.sound[key];
      audioEl.id = key;
      audioEl.muted = this.muted;
      audioEl.classList.add('game-sound');
      audioEl.loop = key === 'background' ? true : false;
      document.body.appendChild(audioEl);
      this.sounds.push(audioEl);
    };
  }

  pause (id) {
    let audioEl = this.sounds.filter (soundEl => soundEl.id === id);
    if (audioEl) {
      audioEl[0].pause();
    }
  }

  play (id) {
    let audioEl = this.sounds.filter (soundEl => soundEl.id === id);
    if (audioEl) {
      audioEl[0].play();
    }
  }

  toggleSounds () {
    this.muted = !this.muted;
    this.sounds.forEach(soundEl => {
      soundEl.muted = this.muted;
    });
  }

}