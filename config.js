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

  colors: [
    '',
    'yellowgreen',
    'hotpink',
    'blueviolet',
    'orange',
    'darkturquoise',
    'gold',
    'red'
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
export { config as "tetis-config"};