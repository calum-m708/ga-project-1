// * Dom Elements
const grid = document.querySelector('.grid');
const start = document.querySelector('#start-button');

// * grid variables
const width = 20;
const height = 10;
const cellCount = height * width;

// * global game variables (to be reassigned per level)
let movementID = [];
let timerID = [];
let playerPosition;
let cells = [];
let walls = [];
let enemyArray = [];
let timerArray = [];
let running = true;
let exit = 0;
let currentLevelIndex = 0;
// * other global variables (not reassigned per level)

const levels = [
  level1Tutorial,
  level1,
  level2Tutorial,
  level2,
  level3Tutorial,
  level3,
  level4Tutorial,
  level4,
  level5Tutorial,
  level5,
  endGame,
];
let caught = 0;

function checkCaught() {
  if (cells[playerPosition].classList.contains('enemy')) {
    console.log('player has run into enemy');
    gameOver();
  } else if (cells[playerPosition].classList.contains('vision')) {
    console.log('player was seen by the enemy');
    gameOver();
  } else if (cells[playerPosition].classList.contains('exit')) {
    objectiveAchieved();
  }
}

function handleKeyUp(event) {
  removePlayer(playerPosition);
  switch (event.keyCode) {
    // RIGHT
    case 39:
    case 68:
      if (!collideWithWall(playerPosition + 1)) playerPosition++;
      break;
    // LEFT
    case 37:
    case 65:
      if (!collideWithWall(playerPosition - 1)) playerPosition--;
      break;
    // UP
    case 38:
    case 87:
      if (!collideWithWall(playerPosition - width)) playerPosition -= width;
      break;
    // DOWN
    case 40:
    case 83:
      if (!collideWithWall(playerPosition + width)) playerPosition += width;
      break;
    default:
      console.log('invalid key do nothing');
  }

  addPlayer();
  checkCaught();
}

function objectiveAchieved() {
  // TODO build a transition screen, and use the 'currentLevel' variable to determine the next level
  running = false;
  document.removeEventListener('keyup', handleKeyUp);
  for (let i = 0; i < movementID.length; i++) {
    clearInterval(movementID[i]);
  }
  console.log('Player has reached the end of the level');
  enemyArray = [];
  cells = [];
  timerArray = [];
  grid.innerHTML = '';
  currentLevelIndex++;
  if (currentLevelIndex < levels.length) {
    levels[currentLevelIndex]();
  } else {
    console.log('Game Complete!');
  }
}

function gameOver() {
  running = false;
  caught++;
  document.removeEventListener('keyup', handleKeyUp);
  for (let i = 0; i < movementID.length; i++) {
    clearInterval(movementID[i]);
  }
  for (let i = 0; i < timerID.length; i++) {
    clearInterval(timerID[i]);
  }
  enemyArray = [];
  cells = [];
  grid.innerHTML = '';
  grid.classList.add('game-over');
  grid.innerHTML =
    '<button class="game-over-button" id="exit">Exit to Menu</button><button class="game-over-button" id="continue">Retry Level</button>';
  const retry = document.querySelector('#continue');
  retry.addEventListener('click', levels[currentLevelIndex]);
  const exit = document.querySelector('#exit');
  exit.addEventListener('click', function () {
    window.location.reload();
  });
}

function addPlayer() {
  cells[playerPosition].classList.add('player');
}

function removePlayer() {
  cells[playerPosition].classList.remove('player');
}

function addVision(position, direction, vision) {
  if (direction === 'left') {
    for (i = 1; i <= vision; i++) {
      cells[position - i].classList.add('vision', 'left');
      if (cells[position - i].classList.contains('player')) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
  } else if (direction === 'right') {
    for (i = 1; i <= vision; i++) {
      cells[position + i].classList.add('vision', 'right');
      if (cells[position + i].classList.contains('player')) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
  } else if (direction === 'up') {
    for (i = 1; i <= vision; i++) {
      cells[position - width * i].classList.add('vision', 'up');
      if (cells[position - width * i].classList.contains('player')) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
  } else if (direction === 'down') {
    for (i = 1; i <= vision; i++) {
      cells[position + width * i].classList.add('vision', 'down');
      if (cells[position + width * i].classList.contains('player')) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
  }
}
function removeVision(position, direction, vision) {
  if (direction === 'left') {
    for (let i = 1; i <= vision; i++) {
      cells[position - i].classList.remove('vision', 'left');
    }
  }
  if (direction === 'right') {
    for (let i = 1; i <= vision; i++) {
      cells[position + i].classList.remove('vision', 'right');
    }
  }
  if (direction === 'up') {
    for (let i = 1; i <= vision; i++) {
      cells[position - width * i].classList.remove('vision', 'up');
    }
  }
  if (direction === 'down') {
    for (let i = 1; i <= vision; i++) {
      cells[position + width * i].classList.remove('vision', 'down');
    }
  }
}

function addEnemy(enemyObject) {
  cells[enemyObject.position].classList.add('enemy');
  addVision(enemyObject.position, enemyObject.direction, enemyObject.vision);
  if (cells[enemyObject.position].classList.contains('player')) {
    console.log('enemy has run into player');

    gameOver();
  }
}

function removeEnemy(enemyObject) {
  cells[enemyObject.position].classList.remove('enemy');
  removeVision(enemyObject.position, enemyObject.direction, enemyObject.vision);
}

function createGrid(wallsArray, exit) {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div');
    //cell.textContent = i;
    if (wallsArray.includes(i)) {
      cell.classList.add('wall');
    }
    if (i === exit) {
      cell.classList.add('exit');
    }
    grid.appendChild(cell);
    cells.push(cell);
  }
}

function switchDirection(direction) {
  if (direction === 'right') return 'left';
  else if (direction === 'left') return 'right';
  else if (direction === 'up') return 'down';
  else if (direction === 'down') return 'up';
}
function enemyMove(enemy, index) {
  movementID[index] = setInterval(() => {
    if (running) {
      removeEnemy(enemy);
      if (enemy.direction === 'right' && enemy.position < enemy.endPoint) {
        enemy.position++;
      }
      if (enemy.direction === 'left' && enemy.position > enemy.startPoint) {
        enemy.position--;
      }
      if (enemy.direction === 'up' && enemy.position > enemy.endPoint) {
        enemy.position -= width;
      }
      if (enemy.direction === 'down' && enemy.position < enemy.startPoint) {
        enemy.position += width;
      }
      if (
        (enemy.direction === 'left' || enemy.direction === 'down') &&
        enemy.position === enemy.startPoint
      ) {
        enemy.direction = switchDirection(enemy.direction);
      }
      if (
        (enemy.direction === 'right' || enemy.direction === 'up') &&
        enemy.position === enemy.endPoint
      ) {
        enemy.direction = switchDirection(enemy.direction);
      }
      addEnemy(enemy);
    }
  }, enemy.speed);
}
function collideWithWall(direction) {
  return walls.includes(direction);
}

function timerStart(timer, index) {
  timerID[index] = setInterval(() => {
    if (playerPosition === timer.position) {
      timer.count--;
      cells[timer.position].textContent = timer.count;
      if (timer.count <= 0) {
        timer.unlock();
        clearInterval(timerID[index]);
      }
    }
  }, 100);
}
function placeTimers(object) {
  if (object.position < 40) {
    cells[object.position].classList.add('timer-down');
  } else {
    cells[object.position].classList.add('timer-up');
  }
}
// level functions - The actual game goes here

function level1Tutorial() {
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.add('tutorial');
  grid.style.backgroundImage = "url('./assets/level1tutorial.png')";
  grid.innerHTML =
    '<button class="start-level" id="level1start">Start Level</button>';
  const startLevel = document.querySelector('#level1start');
  startLevel.style.marginBottom = '2%';
  currentLevelIndex++;
  startLevel.addEventListener('click', levels[currentLevelIndex]);
}

function level1() {
  // * clear the welcome screen
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.remove('tutorial');
  grid.style.backgroundImage = '';
  // * define level specific variables
  const level1StartPosition = 161;
  const level1Exit = 39;
  const level1EnemyArray = [
    {
      name: 'enemy1',
      startPoint: 90,
      speed: 1000,
      position: 90,
      endPoint: 93,
      vision: 3,
      direction: 'right',
    },
    {
      name: 'enemy2',
      startPoint: 146,
      speed: 500,
      position: 153,
      endPoint: 153,
      vision: 3,
      direction: 'left',
    },
    {
      name: 'enemy3',
      startPoint: 137,
      speed: 750,
      position: 77,
      endPoint: 77,
      vision: 3,
      direction: 'down',
    },
    {
      name: 'enemy4',
      startPoint: 138,
      speed: 750,
      position: 138,
      endPoint: 78,
      vision: 3,
      direction: 'up',
    },
  ];
  const level1Walls = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    23, 26, 27, 28, 40, 46, 47, 48, 50, 51, 52, 53, 55, 56, 59, 60, 66, 67, 68,
    70, 71, 72, 73, 75, 76, 79, 80, 83, 86, 87, 88, 95, 96, 99, 100, 103, 106,
    107, 108, 110, 111, 112, 113, 115, 116, 119, 120, 123, 126, 127, 128, 130,
    131, 132, 133, 135, 136, 139, 140, 143, 155, 156, 159, 160, 163, 175, 176,
    179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193,
    194, 195, 196, 197, 198, 199,
  ];
  // * assign them to their global equivalents
  playerPosition = level1StartPosition;
  walls = level1Walls;
  enemyArray = level1EnemyArray;
  exit = level1Exit;
  // * build the level using these assigned variables
  createGrid(walls, exit);
  addPlayer(playerPosition);
  for (let i = 0; i < enemyArray.length; i++) {
    addEnemy(enemyArray[i]);
    enemyMove(enemyArray[i], i);
  }
  if (timerArray.length >= 1) {
    for (let i = 0; i < timerArray.length; i++) {
      placeTimers(timerArray[i]);
    }
  }
  // * set running as true, then start the event listener for key inputs
  running = true;
  document.addEventListener('keyup', handleKeyUp);
}

function level2Tutorial() {
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.add('tutorial');
  grid.style.backgroundImage = "url('./assets/level2tutorial.png')";
  grid.innerHTML =
    '<button class="start-level" id="level2start">Start Level</button>';
  const startLevel = document.querySelector('#level2start');
  startLevel.style.marginBottom = '2%';
  currentLevelIndex++;
  startLevel.addEventListener('click', levels[currentLevelIndex]);
}

function level2() {
  // * clear anything leftover on screen
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.remove('tutorial');
  grid.style.backgroundImage = '';
  // * define level specific variables
  const level2StartPosition = 21;
  const level2Exit = 10;
  const level2EnemyArray = [
    {
      name: 'enemy1',
      startPoint: 63,
      speed: 200,
      position: 63,
      endPoint: 76,
      vision: 4,
      direction: 'right',
    },
    {
      name: 'enemy2',
      startPoint: 83,
      speed: 200,
      position: 96,
      endPoint: 96,
      vision: 4,
      direction: 'left',
    },
    {
      name: 'enemy3',
      startPoint: 163,
      speed: 750,
      position: 163,
      endPoint: 172,
      vision: 2,
      direction: 'right',
    },
  ];
  const level2Walls = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23,
    24, 25, 26, 27, 28, 29, 39, 40, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
    54, 55, 56, 57, 58, 59, 60, 79, 80, 99, 100, 101, 102, 104, 105, 107, 108,
    110, 111, 113, 114, 115, 117, 118, 119, 120, 121, 122, 124, 125, 126, 127,
    128, 129, 130, 131, 133, 139, 140, 141, 142, 144, 145, 146, 149, 150, 151,
    153, 159, 160, 161, 162, 173, 174, 175, 177, 178, 179, 180, 181, 182, 183,
    184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198,
    199,
  ];
  const level2Timers = [
    {
      name: 'timer1',
      position: 176,
      count: 25,
      unlock: function () {
        cells[56].classList.remove('wall');
        const index = walls.indexOf(56);
        walls.splice(index, 1);
      },
    },
  ];
  // * assign them to their global equivalents
  playerPosition = level2StartPosition;
  walls = level2Walls;
  enemyArray = level2EnemyArray;
  exit = level2Exit;
  currentLevel = level2;
  timerArray = level2Timers;
  // * build the level using these assigned variables
  createGrid(walls, exit);
  addPlayer(playerPosition);
  for (let i = 0; i < enemyArray.length; i++) {
    addEnemy(enemyArray[i]);
    enemyMove(enemyArray[i], i);
  }
  if (timerArray.length >= 1) {
    for (let i = 0; i < timerArray.length; i++) {
      placeTimers(timerArray[i]);
      timerStart(timerArray[i], i);
    }
  }
  cells[196].classList.add('server');
  // * set running as true, then start the event listener for key inputs
  running = true;
  document.addEventListener('keyup', handleKeyUp);
}

function level3Tutorial() {
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.add('tutorial');
  grid.style.backgroundImage = "url('./assets/level3tutorial.png')";
  grid.innerHTML =
    '<button class="start-level" id="level3start">Start Level</button>';
  const startLevel = document.querySelector('#level3start');
  startLevel.style.marginBottom = '2%';
  currentLevelIndex++;
  startLevel.addEventListener('click', levels[currentLevelIndex]);
}
function level3() {
  // * clear anything leftover on screen
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.remove('tutorial');
  grid.style.backgroundImage = '';
  // * define level specific variables
  const level3StartPosition = 170;
  const level3Exit = 59;
  const level3EnemyArray = [
    {
      name: 'enemy1',
      startPoint: 144,
      speed: 1000,
      position: 124,
      endPoint: 44,
      vision: 2,
      direction: 'up',
    },
    {
      name: 'enemy2',
      startPoint: 23,
      speed: 600,
      position: 29,
      endPoint: 29,
      vision: 3,
      direction: 'left',
    },
    {
      name: 'enemy3',
      startPoint: 34,
      speed: 200,
      position: 34,
      endPoint: 37,
      vision: 2,
      direction: 'right',
    },
    {
      name: 'enemy4',
      startPoint: 153,
      speed: 500,
      position: 53,
      endPoint: 53,
      vision: 2,
      direction: 'down',
    },
    {
      name: 'enemy5',
      startPoint: 174,
      speed: 750,
      position: 177,
      endPoint: 177,
      vision: 2,
      direction: 'left',
    },
    {
      name: 'enemy6',
      startPoint: 121,
      speed: 750,
      position: 121,
      endPoint: 41,
      vision: 2,
      direction: 'up',
    },
  ];
  const level3Walls = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    32, 39, 40, 42, 43, 46, 47, 52, 54, 60, 63, 65, 66, 67, 68, 72, 74, 75, 76,
    79, 80, 83, 85, 86, 87, 88, 92, 94, 95, 96, 97, 99, 100, 103, 105, 106, 107,
    108, 112, 114, 115, 116, 117, 119, 120, 123, 125, 126, 127, 128, 132, 135,
    136, 137, 139, 140, 142, 143, 146, 147, 152, 157, 159, 160, 172, 179, 180,
    181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195,
    196, 197, 198, 199,
  ];
  const level3Timers = [
    {
      name: 'timer1',
      position: 24,
      count: 50,
      unlock: function () {
        cells[112].classList.remove('wall');
        const index = walls.indexOf(112);
        walls.splice(index, 1);
      },
    },
  ];
  // * assign them to their global equivalents
  playerPosition = level3StartPosition;
  walls = level3Walls;
  enemyArray = level3EnemyArray;
  exit = level3Exit;
  currentLevel = level3;
  timerArray = level3Timers;
  // * build the level using these assigned variables

  createGrid(walls, exit);
  addPlayer(playerPosition);
  for (let i = 0; i < enemyArray.length; i++) {
    addEnemy(enemyArray[i]);
    enemyMove(enemyArray[i], i);
  }
  if (timerArray.length >= 1) {
    for (let i = 0; i < timerArray.length; i++) {
      placeTimers(timerArray[i]);
      timerStart(timerArray[i], i);
    }
  }
  cells[4].classList.add('safe');
  // * set running as true, then start the event listener for key inputs
  running = true;
  document.addEventListener('keyup', handleKeyUp);
}
function level4Tutorial() {
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.add('tutorial');
  grid.style.backgroundImage = "url('./assets/level4tutorial.png')";
  grid.innerHTML =
    '<button class="start-level" id="level4start">Start Level</button>';
  const startLevel = document.querySelector('#level4start');
  startLevel.style.marginBottom = '2%';
  currentLevelIndex++;
  startLevel.addEventListener('click', levels[currentLevelIndex]);
}
function level4() {
  // * clear anything leftover on screen
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.remove('tutorial');
  grid.style.backgroundImage = '';
  // * define level specific variables
  let bombsPlanted = 0;
  const level4StartPosition = 41;
  const level4Exit = 99;
  const level4EnemyArray = [
    {
      name: 'enemy1',
      startPoint: 142,
      speed: 500,
      position: 146,
      endPoint: 146,
      vision: 2,
      direction: 'left',
    },
    {
      name: 'enemy2',
      startPoint: 125,
      speed: 1000,
      position: 125,
      endPoint: 65,
      vision: 3,
      direction: 'up',
    },
    {
      name: 'enemy3',
      startPoint: 128,
      speed: 750,
      position: 68,
      endPoint: 68,
      vision: 3,
      direction: 'down',
    },
    {
      name: 'enemy4',
      startPoint: 131,
      speed: 900,
      position: 131,
      endPoint: 71,
      vision: 3,
      direction: 'up',
    },
    {
      name: 'enemy5',
      startPoint: 152,
      speed: 400,
      position: 152,
      endPoint: 156,
      vision: 3,
      direction: 'right',
    },
    {
      name: 'enemy6',
      startPoint: 52,
      speed: 750,
      position: 56,
      endPoint: 56,
      vision: 2,
      direction: 'left',
    },
  ];
  const level4Walls = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    23, 24, 29, 30, 37, 38, 39, 40, 43, 44, 49, 50, 57, 58, 59, 60, 63, 64, 69,
    70, 77, 78, 79, 80, 83, 84, 89, 90, 97, 100, 109, 110, 117, 118, 119, 120,
    129, 130, 137, 138, 139, 140, 149, 150, 157, 158, 159, 160, 177, 178, 179,
    180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194,
    195, 196, 197, 198, 199,
  ];
  const level4Timers = [
    {
      name: 'timer1',
      position: 25,
      count: 25,
      unlock: function () {
        bombsPlanted++;
        if (bombsPlanted === 4) {
          cells[97].classList.remove('wall');
          const index = walls.indexOf(97);
          walls.splice(index, 1);
        }
      },
    },
    {
      name: 'timer2',
      position: 168,
      count: 25,
      unlock: function () {
        bombsPlanted++;
        if (bombsPlanted === 4) {
          cells[97].classList.remove('wall');
          const index = walls.indexOf(97);
          walls.splice(index, 1);
        }
      },
    },
    {
      name: 'timer3',
      position: 31,
      count: 25,
      unlock: function () {
        bombsPlanted++;
        if (bombsPlanted === 4) {
          cells[97].classList.remove('wall');
          const index = walls.indexOf(97);
          walls.splice(index, 1);
        }
      },
    },
    {
      name: 'timer4',
      position: 174,
      count: 25,
      unlock: function () {
        bombsPlanted++;
        if (bombsPlanted === 4) {
          cells[97].classList.remove('wall');
          const index = walls.indexOf(97);
          walls.splice(index, 1);
        }
      },
    },
  ];
  // * assign them to their global equivalents
  playerPosition = level4StartPosition;
  walls = level4Walls;
  enemyArray = level4EnemyArray;
  exit = level4Exit;
  currentLevel = level4;
  timerArray = level4Timers;
  // * build the level using these assigned variables

  createGrid(walls, exit);
  addPlayer(playerPosition);
  for (let i = 0; i < enemyArray.length; i++) {
    addEnemy(enemyArray[i]);
    enemyMove(enemyArray[i], i);
  }
  if (timerArray.length >= 1) {
    for (let i = 0; i < timerArray.length; i++) {
      placeTimers(timerArray[i]);
      timerStart(timerArray[i], i);
    }
  }
  cells[5].classList.add('server');
  cells[11].classList.add('server');
  cells[188].classList.add('server');
  cells[194].classList.add('server');
  // * set running as true, then start the event listener for key inputs
  running = true;
  document.addEventListener('keyup', handleKeyUp);
}
function level5Tutorial() {
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.add('tutorial');
  grid.style.backgroundImage = "url('./assets/level5tutorial.png')";
  grid.innerHTML =
    '<button class="start-level" id="level5start">Start Level</button>';
  const startLevel = document.querySelector('#level5start');
  startLevel.style.marginBottom = '2%';
  currentLevelIndex++;
  startLevel.addEventListener('click', levels[currentLevelIndex]);
}
function level5() {
  // * clear anything leftover on screen
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.remove('tutorial');
  grid.style.backgroundImage = '';
  // * define level specific variables
  const level5StartPosition = 81;
  const level5Exit = 59;
  const level5EnemyArray = [
    {
      name: 'enemy1',
      startPoint: 125,
      speed: 500,
      position: 125,
      endPoint: 45,
      vision: 3,
      direction: 'up',
    },
    {
      name: 'enemy2',
      startPoint: 46,
      speed: 300,
      position: 46,
      endPoint: 53,
      vision: 3,
      direction: 'right',
    },
    {
      name: 'enemy3',
      startPoint: 26,
      speed: 300,
      position: 33,
      endPoint: 33,
      vision: 3,
      direction: 'left',
    },
    {
      name: 'enemy4',
      startPoint: 134,
      speed: 1000,
      position: 134,
      endPoint: 74,
      vision: 3,
      direction: 'up',
    },
    {
      name: 'enemy5',
      startPoint: 137,
      speed: 1000,
      position: 77,
      endPoint: 77,
      vision: 3,
      direction: 'down',
    },
  ];
  const level5Walls = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    23, 24, 36, 39, 40, 43, 44, 56, 60, 63, 64, 66, 67, 68, 69, 71, 72, 73, 76,
    79, 80, 83, 84, 86, 87, 88, 89, 91, 92, 93, 96, 99, 100, 103, 104, 111, 112,
    113, 116, 119, 120, 123, 124, 126, 127, 128, 129, 131, 132, 133, 139, 140,
    143, 144, 146, 147, 148, 149, 151, 152, 153, 159, 160, 171, 172, 173, 176,
    179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193,
    194, 195, 196, 197, 198, 199,
  ];
  // * assign them to their global equivalents
  playerPosition = level5StartPosition;
  walls = level5Walls;
  enemyArray = level5EnemyArray;
  exit = level5Exit;
  currentLevel = level5;
  // * build the level using these assigned variables

  createGrid(walls, exit);
  addPlayer(playerPosition);
  for (let i = 0; i < enemyArray.length; i++) {
    addEnemy(enemyArray[i]);
    enemyMove(enemyArray[i], i);
  }
  // * set running as true, then start the event listener for key inputs
  running = true;
  document.addEventListener('keyup', handleKeyUp);
}
function endGame() {
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  grid.classList.remove('tutorial');
  grid.classList.add('end-screen');
  grid.style.backgroundImage = "url('./assets/congratulations.png";
  grid.innerHTML = `<p>You were caught ${caught} times. Click the button below to start from the beginning<p><br><button class="start-level" id="restart">Return to Start</button>`;
  const restart = document.querySelector('#restart');
  restart.addEventListener('click', function () {
    window.location.reload();
  });
}

start.addEventListener('click', level1Tutorial);
