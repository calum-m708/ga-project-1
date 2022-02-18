// * Dom Elements
const grid = document.querySelector('.grid');
const cells = [];

// * grid variables
const width = 20;
const height = 10;
const cellCount = height * width;

// * game variables
let playerPosition = 161;
const walls = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23,
  40, 46, 47, 48, 50, 51, 52, 53, 55, 56, 59, 60, 66, 67, 68, 70, 71, 72, 73,
  75, 76, 79, 80, 83, 86, 87, 88, 95, 96, 99, 100, 103, 106, 107, 108, 110, 111,
  112, 113, 115, 116, 119, 120, 123, 126, 127, 128, 130, 131, 132, 133, 135,
  136, 139, 140, 143, 155, 156, 159, 160, 163, 175, 176, 179, 180, 181, 182,
  183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197,
  198, 199,
];
const exit = 39;

let enemy1Start = 90;
let enemy2Start = 145;
let enemy3Start = 157;
let enemy4Start = 58;

function addPlayer() {
  cells[playerPosition].classList.add('player');
}

function removePlayer() {
  cells[playerPosition].classList.remove('player');
}

function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div');
    cell.textContent = i;
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
}
function collideWithWall(direction) {
  return walls.includes(direction);
}
createGrid();

function handleKeyUp(event) {
  removePlayer(playerPosition); // * remove pikachu from the current position

  const x = playerPosition % width;
  const y = Math.floor(playerPosition / width);

  switch (
    event.keyCode // * calculate the next position and update it
  ) {
    // RIGHT
    case 39:
      if (!collideWithWall(playerPosition + 1)) playerPosition++;
      break;
    // LEFT
    case 37:
      if (!collideWithWall(playerPosition - 1)) playerPosition--;
      break;
    // UP
    case 38:
      if (!collideWithWall(playerPosition - width)) playerPosition -= width;
      break;
    // DOWN
    case 40:
      if (!collideWithWall(playerPosition + width)) playerPosition += width;
      break;
    default:
      console.log('invalid key do nothing');
  }

  addPlayer(playerPosition); // * add pikachu back at the new position
}

document.addEventListener('keyup', handleKeyUp);
