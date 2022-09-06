export class User {
  constructor(sounds) {
    this.level = 0; // level 0-9 : display 1-10
    this.score = 0;
    this.lines = 0; // # of lines cleared
    this.sounds = sounds;
  }

  setLineScore(lines) {
    this.score += config.points[lines];
  }

  increaseLine(lines) {
    this.lines += lines;
  }

  updateLevel() {
    this.level =  Math.floor(this.lines / config.levelUpLineNumbers);
    this.level = this.level >= config.levels.length 
      ? config.levels.length 
      : this.level;
  }
     
  update(lines) {
    this.setLineScore(lines);
    this.increaseLine(lines);
    let prevLevel = this.level;
    this.level = Math.floor(this.lines / config.levelUpLineNumbers); // level up: every 15 lines 
    if (this.level > prevLevel) {
      this.sounds.play('levelUp');
    }
    this.level = this.level >= config.levels.length 
      ? config.levels.length // top level
      : this.level; 
  }
};