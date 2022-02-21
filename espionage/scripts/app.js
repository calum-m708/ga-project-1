// * Dom Elements
const grid = document.querySelector('.grid');
const cells = [];
const start = document.querySelector('#start-button');
const exit = document.querySelector('#exit');

// * grid variables
const width = 20;
const height = 10;
const cellCount = height * width;
let movementID;

function objectiveAchieved() {
  clearInterval(movementID);
  console.log('Player has reached the end of the level');
}
function level1() {
  // * clear the welcome screen
  grid.innerHTML = '';
  grid.classList.remove('welcome-screen');
  grid.classList.remove('game-over');

  function gameOver() {
    console.log('game over has been called');
    for (let i = 0; i < enemyArray.length; i++) {
      clearInterval(movementID);
    }
    clearInterval(movementID);
    for (let i = 0; i < enemyArray.length; i++) {
      removeEnemy(enemyArray[i]);
    }
    removePlayer();
    grid.innerHTML = '';
    grid.classList.add('game-over');
    grid.innerHTML =
      '<button class="game-over-button" id="exit">Exit to Menu</button><button class="game-over-button" id="continue">Retry Level</button>';
    const retry = document.querySelector('#continue');
    retry.addEventListener('click', level1);
  }

  // * game variables
  const defaultPlayerPosition = 161;
  let playerPosition = defaultPlayerPosition;
  const walls = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    23, 26, 27, 28, 40, 46, 47, 48, 50, 51, 52, 53, 55, 56, 59, 60, 66, 67, 68,
    70, 71, 72, 73, 75, 76, 79, 80, 83, 86, 87, 88, 95, 96, 99, 100, 103, 106,
    107, 108, 110, 111, 112, 113, 115, 116, 119, 120, 123, 126, 127, 128, 130,
    131, 132, 133, 135, 136, 139, 140, 143, 155, 156, 159, 160, 163, 175, 176,
    179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193,
    194, 195, 196, 197, 198, 199,
  ];
  const exit = 39;

  function handleKeyUp(event) {
    removePlayer(playerPosition); // * remove pikachu from the current position

    const x = playerPosition % width;
    const y = Math.floor(playerPosition / width);

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

    addPlayer(playerPosition); // * add pikachu back at the new position
    if (cells[playerPosition].classList.contains('enemy')) {
      gameOver();
      console.log('player has run into enemy');
    }
    if (cells[playerPosition].classList.contains('vision')) {
      gameOver();
      console.log('player was seen by the enemy');
    }
    if (cells[playerPosition].classList.contains('exit')) {
      objectiveAchieved();
    }
  }

  const enemyArray = [
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

  function addPlayer() {
    cells[playerPosition].classList.add('player');
  }

  function removePlayer() {
    cells[playerPosition].classList.remove('player');
  }

  function addEnemy(enemyObject) {
    cells[enemyObject.position].classList.add('enemy');
    if (enemyObject.direction === 'left') {
      cells[enemyObject.position - 1].classList.add('vision', 'left');
      cells[enemyObject.position - 2].classList.add('vision', 'left');
      cells[enemyObject.position - 3].classList.add('vision', 'left');
      if (
        cells[enemyObject.position - 1].classList.contains('player') ||
        cells[enemyObject.position - 2].classList.contains('player') ||
        cells[enemyObject.position - 3].classList.contains('player')
      ) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
    if (enemyObject.direction === 'right') {
      cells[enemyObject.position + 1].classList.add('vision', 'right');
      cells[enemyObject.position + 2].classList.add('vision', 'right');
      cells[enemyObject.position + 3].classList.add('vision', 'right');
      if (
        cells[enemyObject.position + 1].classList.contains('player') ||
        cells[enemyObject.position + 2].classList.contains('player') ||
        cells[enemyObject.position + 3].classList.contains('player')
      ) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
    if (enemyObject.direction === 'up') {
      cells[enemyObject.position - width].classList.add('vision', 'up');
      cells[enemyObject.position - width * 2].classList.add('vision', 'up');
      cells[enemyObject.position - width * 3].classList.add('vision', 'up');
      if (
        cells[enemyObject.position - width].classList.contains('player') ||
        cells[enemyObject.position - width * 2].classList.contains('player') ||
        cells[enemyObject.position - width * 3].classList.contains('player')
      ) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
    if (enemyObject.direction === 'down') {
      cells[enemyObject.position + width].classList.add('vision', 'down');
      cells[enemyObject.position + width * 2].classList.add('vision', 'down');
      cells[enemyObject.position + width * 3].classList.add('vision', 'down');
      if (
        cells[enemyObject.position + width].classList.contains('player') ||
        cells[enemyObject.position + width * 2].classList.contains('player') ||
        cells[enemyObject.position + width * 3].classList.contains('player')
      ) {
        gameOver();
        console.log('enemy spotted the player');
      }
    }
  }
  function removeEnemy(enemyObject) {
    cells[enemyObject.position].classList.remove('enemy');
    if (enemyObject.direction === 'left') {
      cells[enemyObject.position - 1].classList.remove('vision', 'left');
      cells[enemyObject.position - 2].classList.remove('vision', 'left');
      cells[enemyObject.position - 3].classList.remove('vision', 'left');
    }
    if (enemyObject.direction === 'right') {
      cells[enemyObject.position + 1].classList.remove('vision', 'right');
      cells[enemyObject.position + 2].classList.remove('vision', 'right');
      cells[enemyObject.position + 3].classList.remove('vision', 'right');
    }
    if (enemyObject.direction === 'up') {
      cells[enemyObject.position - width].classList.remove('vision', 'up');
      cells[enemyObject.position - width * 2].classList.remove('vision', 'up');
      cells[enemyObject.position - width * 3].classList.remove('vision', 'up');
    }
    if (enemyObject.direction === 'down') {
      cells[enemyObject.position + width].classList.remove('vision', 'down');
      cells[enemyObject.position + width * 2].classList.remove(
        'vision',
        'down'
      );
      cells[enemyObject.position + width * 3].classList.remove(
        'vision',
        'down'
      );
    }
  }

  function createGrid() {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div');
      //cell.textContent = i;
      if (walls.includes(i)) {
        cell.classList.add('wall');
      }
      if (i === exit) {
        cell.classList.add('exit');
      }
      grid.appendChild(cell);
      cells.push(cell);
    }
    addPlayer();
    addEnemy(enemyArray[0]);
    addEnemy(enemyArray[1]);
    addEnemy(enemyArray[2]);
    addEnemy(enemyArray[3]);
  }
  function enemyMove(enemy) {
    movementID = setInterval(() => {
      removeEnemy(enemy);
      if (enemy.direction === 'right' && enemy.position < enemy.endPoint) {
        enemy.position++;
      } else if (
        enemy.direction === 'right' &&
        enemy.position === enemy.endPoint
      ) {
        enemy.direction = 'left';
      }
      if (enemy.direction === 'left' && enemy.position > enemy.startPoint) {
        enemy.position--;
      } else if (
        enemy.direction === 'left' &&
        enemy.position === enemy.startPoint
      ) {
        enemy.direction = 'right';
      }
      if (enemy.direction === 'up' && enemy.position > enemy.endPoint) {
        enemy.position -= width;
      } else if (
        enemy.direction === 'up' &&
        enemy.position === enemy.endPoint
      ) {
        enemy.direction = 'down';
      }
      if (enemy.direction === 'down' && enemy.position < enemy.startPoint) {
        enemy.position += width;
      } else if (
        enemy.direction === 'down' &&
        enemy.position === enemy.startPoint
      ) {
        enemy.direction = 'up';
      }
      addEnemy(enemy);
      if (cells[enemy.position].classList.contains('player')) {
        console.log('enemy has run into player');
        gameOver();
      }
      console.log(enemy.position);
    }, enemy.speed);
  }
  function collideWithWall(direction) {
    return walls.includes(direction);
  }

  createGrid();

  enemyMove(enemyArray[0]);
  enemyMove(enemyArray[1]);
  enemyMove(enemyArray[2]);
  enemyMove(enemyArray[3]);

  document.addEventListener('keyup', handleKeyUp);
}

start.addEventListener('click', level1);
//exit.addEventListener('click' )
