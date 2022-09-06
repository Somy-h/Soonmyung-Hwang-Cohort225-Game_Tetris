const config = {
  cols: 10,
  rows: 18,
  levelUpLineNumbers: 15,
  rewardPoints: 3000,

  keys: {
    SPACE: 32,      // move hard drop
    LEFT: 37,       // move to left
    RIGHT: 39,      // move to right
    UP: 38,         // rotate
    DOWN: 40,       // soft drop
  },

  controlBtn: {
    'btn-left' : 37,  // LEFT
    'btn-up' : 38,    // UP
    'btn-right' : 39, // RIGHT,
    'btn-hard-drop' : 32, // SPACE
    'btn-soft-drop' : 40  // DOWN
  },

  colors: [
    '',
    '#A9E449',  //yellowgreen,
    '#EA3CD9',  //hotpink,
    '#A936F6',  //darkslateblue
    '#E49A24',  //orange,
    '#2AA6CF',  //deepskyblue,
    '#33A355',  //gold,
    '#EC2525',  //red
    '#E9DC25',  //bonus
  ],
  
  levels: [
    700, // level1: 700ms
    600,
    500,
    400,
    300,
    250,
    200,
    150,
    100,
    70   // level10: 70ms 
  ],

  points: {
    [0]: 1,
    [1]: 100,
    [2]: 300,
    [3]: 500,
    [4]: 800,
    HARD_DROP: 1, // extra points
  },

  sound: {
    background: './resources/background.mp3',
    start: './resources/start.mp3',
    hardDrop: './resources/drop.mp3',
    lineClear: './resources/lineClear.mp3',
    levelUp: './resources/levelUp.mp3',
    gameOver: './resources/over.mp3',
  }
}
