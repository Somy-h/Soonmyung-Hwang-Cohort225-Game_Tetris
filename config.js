export { config as "tetris-config"};

const config = {
  cols: 10,
  rows: 18,
  levelUpLineNumbers: 15,

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
    '#9acd32',  //yellowgreen,
    '#EA3CD9',  //hotpink,
    '#A936F6',  //darkslateblue
    '#E4A124',  //orange,
    '#2AA6CF',  //deepskyblue,
    '#E9D44D',  //gold,
    '#EC2525',  //red
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
    LINE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    QUADRUPLE: 800,
    HARD_DROP: 2,
    DROP: 1
  },

}
