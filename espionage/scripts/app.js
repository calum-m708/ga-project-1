// * Dom Elements
const grid = document.querySelector('.grid');
const start = document.querySelector('#start-button');
const exit = document.querySelector('#exit');

// * grid variables
const width = 20;
const height = 10;
const cellCount = height * width;
let movementID = [];
let playerPosition;
let cells = [];
let walls = [];
let enemyArray = [];
let running = true;
const LEFT = -3;
const RIGHT = 3;
const UP = -60;
const DOWN = 60;

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
  removePlayer(playerPosition); // * remove pikachu from the current position
  switch (
    event.keyCode // * calculate the next position and update it
  ) {
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

  addPlayer(); // * add pikachu back at the new position
  // if (cells[playerPosition].classList.contains('enemy')) {
  //   console.log('player has run into enemy');

  //   gameOver();
  // } else if (cells[playerPosition].classList.contains('vision')) {
  //   console.log('player was seen by the enemy');
  //   gameOver();
  // } else if (cells[playerPosition].classList.contains('exit')) {
  //   objectiveAchieved();
  // }
}

function objectiveAchieved() {
  clearInterval(movementID);
  //running = false;
  console.log('Player has reached the end of the level');
}

function gameOver() {
  running = false;
  document.removeEventListener('keyup', handleKeyUp);
  //Wait for everything else to finish executing
  for (let i = 0; i < movementID.length; i++) {
    clearInterval(movementID[i]);
  }
  console.log('Array at time of Game Over: ');
  console.log(enemyArray);
  // enemyArray = [];
  enemyArray.length = 0;
  // cells = [];
  cells.length = 0;
  console.log('Array after clearing during Game Over');
  console.log(enemyArray);
  grid.innerHTML = '';
  grid.classList.add('game-over');
  grid.innerHTML =
    '<button class="game-over-button" id="exit">Exit to Menu</button><button class="game-over-button" id="continue">Retry Level</button>';
  const retry = document.querySelector('#continue');
  retry.addEventListener('click', level1);
}

function addPlayer() {
  cells[playerPosition].classList.add('player');
}

function removePlayer() {
  cells[playerPosition].classList.remove('player');
}

function addVision(position, direction) {
  if (direction === 'left') {
    for (i = 1; i <= 3; i++) {
      cells[position - i].classList.add('vision', 'left');
      if (cells[position - i].classList.contains('player')) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
  } else if (direction === 'right') {
    for (i = 1; i <= 3; i++) {
      cells[position + i].classList.add('vision', 'right');
      if (cells[position + i].classList.contains('player')) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
  } else if (direction === 'up') {
    for (i = 1; i <= 3; i++) {
      cells[position - width * i].classList.add('vision', 'up');
      if (cells[position - width * i].classList.contains('player')) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
  } else if (direction === 'down') {
    for (i = 1; i <= 3; i++) {
      cells[position + width * i].classList.add('vision', 'down');
      if (cells[position + width * i].classList.contains('player')) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
  }
}
function removeVision(position, direction) {
  if (direction === 'left') {
    for (let i = 1; i <= 3; i++) {
      cells[position - i].classList.remove('vision', 'left');
    }
  }
  if (direction === 'right') {
    for (let i = 1; i <= 3; i++) {
      cells[position + i].classList.remove('vision', 'right');
    }
  }
  if (direction === 'up') {
    for (let i = 1; i <= 3; i++) {
      cells[position - width * i].classList.remove('vision', 'up');
    }
  }
  if (direction === 'down') {
    for (let i = 1; i <= 3; i++) {
      cells[position + width * i].classList.remove('vision', 'down');
    }
  }
}

function addEnemy(enemyObject) {
  cells[enemyObject.position].classList.add('enemy');
  addVision(enemyObject.position, enemyObject.direction);
  if (cells[enemyObject.position].classList.contains('player')) {
    console.log('enemy has run into player');

    gameOver();
  }
}

function removeEnemy(enemyObject) {
  cells[enemyObject.position].classList.remove('enemy');
  removeVision(enemyObject.position, enemyObject.direction);
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

function level1() {
  console.log('Enemy array at beginning of Level1');
  console.log(enemyArray);
  // * clear the welcome screen
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');
  // * game variables
  const defaultPlayerPosition = 161;
  playerPosition = defaultPlayerPosition;
  walls = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    23, 26, 27, 28, 40, 46, 47, 48, 50, 51, 52, 53, 55, 56, 59, 60, 66, 67, 68,
    70, 71, 72, 73, 75, 76, 79, 80, 83, 86, 87, 88, 95, 96, 99, 100, 103, 106,
    107, 108, 110, 111, 112, 113, 115, 116, 119, 120, 123, 126, 127, 128, 130,
    131, 132, 133, 135, 136, 139, 140, 143, 155, 156, 159, 160, 163, 175, 176,
    179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193,
    194, 195, 196, 197, 198, 199,
  ];
  const exit = 39;

  const level1EnemyArray = [
    {
      name: 'enemy1',
      startPoint: 90,
      speed: 1000,
      position: 90,
      endPoint: 93,
      direction: 'right',
    },
    {
      name: 'enemy2',
      startPoint: 146,
      speed: 500,
      position: 153,
      endPoint: 153,
      direction: 'left',
    },
    {
      name: 'enemy3',
      startPoint: 137,
      speed: 750,
      position: 77,
      endPoint: 77,
      direction: 'down',
    },
    {
      name: 'enemy4',
      startPoint: 138,
      speed: 750,
      position: 138,
      endPoint: 78,
      direction: 'up',
    },
  ];
  enemyArray = level1EnemyArray;
  console.log('Enemy array after being set');
  console.log(enemyArray);
  createGrid(walls, exit);

  addPlayer(playerPosition);
  for (let i = 0; i < enemyArray.length; i++) {
    addEnemy(enemyArray[i]);
    enemyMove(enemyArray[i], i);
  }
  running = true;
  document.addEventListener('keyup', handleKeyUp);
}

start.addEventListener('click', level1);
// exit.addEventListener('click', function(){document.reload} )
