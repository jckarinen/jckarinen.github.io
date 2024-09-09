const KEY_UP = 'w';
const KEY_LEFT = 'a';
const KEY_DOWN = 's';
const KEY_RIGHT = 'd';

const keysPressed = [];

const player = document.getElementById('player');
const playerStyle = window.getComputedStyle(player);

const moveSpeed = 3;
let xDir = 0;
let yDir = 0;
let playerVector = {x: 0, y: 0};

const playBtn = document.getElementById('play-btn');
const playControls = document.getElementById('play-controls');
const controlUp = document.getElementById('control-up'),
    controlLeft = document.getElementById('control-left'),
    controlDown = document.getElementById('control-down'),
    controlRight = document.getElementById('control-right');
const playScene = document.getElementById('play-scene');
const winner = document.getElementById('winner');
const sceneStyle = window.getComputedStyle(playScene);
const sceneWidth = parseFloat(sceneStyle.width);
const sceneHeight = parseFloat(sceneStyle.height);

const playerStartSize = 19;
const playerStartX = sceneWidth / 2;
const playerStartY = sceneHeight / 2;
let allPellets = [];
let allEnemies = [];
const maxEnemySize = 100;
const minEnemySpeed = 1;
const maxEnemySpeed = 5;
const enemyColors = ['var(--ylw)', 'var(--red)', 'var(--grn)']

// Controls
function simulateKeyDown(key) {
    document.dispatchEvent(new KeyboardEvent('keydown', {'key': key}));
}

function simulateKeyUp(key) {
    document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}));
}

document.addEventListener('mousedown', (event) => {
    const target = event.target;
    if (target === controlUp) {
        simulateKeyDown(KEY_UP);
    }
    else if (target === controlLeft) {
        simulateKeyDown(KEY_LEFT);
    }
    else if (target === controlDown) {
        simulateKeyDown(KEY_DOWN);
    }
    else if (target === controlRight) {
        simulateKeyDown(KEY_RIGHT);
    }
});

document.addEventListener('mouseup', (event) => {
    const target = event.target;
    if (target === controlUp) {
        simulateKeyUp(KEY_UP);
    }
    else if (target === controlLeft) {
        simulateKeyUp(KEY_LEFT);
    }
    else if (target === controlDown) {
        simulateKeyUp(KEY_DOWN);
    }
    else if (target === controlRight) {
        simulateKeyUp(KEY_RIGHT);
    }
});

document.addEventListener('mouseleave', (event) => {
    const target = event.target;
    if (target === controlUp) {
        simulateKeyUp(KEY_UP);
    }
    else if (target === controlLeft) {
        simulateKeyUp(KEY_LEFT);
    }
    else if (target === controlDown) {
        simulateKeyUp(KEY_DOWN);
    }
    else if (target === controlRight) {
        simulateKeyUp(KEY_RIGHT);
    }
});



document.addEventListener('keydown', function(event) {

    if (!event.repeat) {
        // Key down, it's now being pressed
        keysPressed[event.key] = true;
        if (keysPressed[KEY_UP]) {

            yDir = -1;
        }
        if (keysPressed[KEY_LEFT]) {
            xDir = -1;
            flipPlayerLeft();
        }
        if (keysPressed[KEY_DOWN]) {
            yDir = 1;
        }
        if (keysPressed[KEY_RIGHT]) {
            xDir = 1;
            flipPlayerRight();
        }
        if (keysPressed[KEY_UP] && keysPressed[KEY_DOWN]) {
            yDir = 0;
        }
        if (keysPressed[KEY_LEFT] && keysPressed[KEY_RIGHT]) {
            xDir = 0;
        }
        playerVector = normalizeVector(xDir, yDir, moveSpeed);
    }
});

document.addEventListener('keyup', function(event) {
    if (!event.repeat) {
        // Key released, it's no longer being pressed
        delete keysPressed[event.key];

        if (event.key === KEY_UP) {
            yDir = 0;
        }
        else if (event.key === KEY_LEFT) {
            xDir = 0;
        }
        else if (event.key === KEY_DOWN) {
            yDir = 0;
        }
        else if (event.key === KEY_RIGHT) {
            xDir = 0;
        }
        playerVector = normalizeVector(xDir, yDir, moveSpeed);
    }
});

function movePlayer() {
    // Move player
    const curX = parseFloat(playerStyle.left);
    const curY = parseFloat(playerStyle.top);
    let destX = curX + playerVector['x'];
    let destY = curY + playerVector['y'];

    if (destX < -10) { destX = -10 }
    if (destX > sceneWidth + 10) {destX = sceneWidth + 10}
    if (destY < -10) { destY = -10 }
    if (destY > sceneHeight + 10) {destY = sceneHeight + 10}

    player.style.left = `${destX}px`;
    player.style.top = `${destY}px`;
}

function normalizeVector(x, y, speed) {
    const mag = Math.sqrt(x*x + y*y);
    if (mag === 0) {
        return {x: 0, y:0};
    }
    const normX = x / mag;
    const normY = y / mag;
    return {
        x: normX * speed,
        y: normY * speed
    }
}

function flipPlayerLeft() {
    player.classList.add('flipLeft');
    player.classList.remove('flipRight');
}

function flipPlayerRight() {
    player.classList.add('flipRight');
    player.classList.remove('flipLeft');
}

function grow(growthAmount) {
    const curSize = parseInt(playerStyle.fontSize);
    // Increment size
    const newSize = curSize + growthAmount;
    player.style.fontSize = newSize + 'px';
}

function calculateGrowth(enemy) {
    const enemyStyle = window.getComputedStyle(enemy);
    return parseFloat(enemyStyle.fontSize) / 7;
}

function spawnPellet() {
    // Create pellet
    const pellet = document.createElement('div');
    pellet.classList.add('pellet');
    // Randomize coordinates
    const randX = Math.random() * sceneWidth;
    const randY = Math.random() * sceneHeight;
    // Set pellet to live at new coordinates
    pellet.style.left = randX + 'px';
    pellet.style.top = randY + 'px';

    // Append to scene
    playScene.appendChild(pellet);

    // Keep track of all pellets
    allPellets.push(pellet);
}

function destroyPellet(pelletToDestroy) {
    // Remove from list
    allPellets = allPellets.filter((pellet) => !(pellet.isEqualNode(pelletToDestroy)));
    // Remove from DOM
    pelletToDestroy.remove();
}

function spawnEnemy() {
    // Create enemy
    const enemy = document.createElement('div')
    enemy.innerText = '><>'
    enemy.classList.add('enemy');
    // Randomize size
    let randSize = Math.random() * maxEnemySize;
    if (randSize < 10) { randSize = 10; }
    // Randomize speed
    let randSpeed = randomFrom(-maxEnemySpeed, maxEnemySpeed);
    // Randomize color
    enemy.style.color = enemyColors[Math.floor(Math.random() * enemyColors.length)];
    // console.log(randSpeed);
    if (Math.abs(randSpeed) < minEnemySpeed) {
        randSpeed = Math.sign(randSpeed) * minEnemySpeed;
    }
    // Set orientation of enemy depending on their speed
    if (randSpeed >= 0) { enemy.classList.add('flipRight') } else { enemy.classList.add('flipLeft')}
    enemy.setAttribute('speed', randSpeed)
    enemy.style.fontSize = randSize + 'px';
    // Randomize Y position, but keep enemy on the left side just off the screen.
    const randY = Math.random() * sceneHeight;
    // Set enemy to live at new coordinates
    // If enemy going left, then put them at right side, and vice versa
    enemy.style.left = Math.sign(randSpeed) >= 0 ? '-100px' : (sceneWidth + 100) + 'px';
    enemy.style.top = randY + 'px';
    // Add enemy to list
    allEnemies.push(enemy);
    // Add enemy to DOM
    playScene.appendChild(enemy);
}

function destroyEnemy(enemyToDestroy) {
    allEnemies = allEnemies.filter((enemy) => !(enemy.isEqualNode(enemyToDestroy)));
    playScene.removeChild(enemyToDestroy);
}

function moveEnemy(enemy) {
    moveElement(enemy, parseFloat(enemy.getAttribute('speed')), 0)
}

function clearAll(elements) {
    elements.forEach((element) => {
        element.remove();
    });
    elements = [];
}

function moveElement(element, moveX, moveY) {
    // Get element style
    const coords = getCoords(element);
    const xNew = coords.x + moveX;
    const yNew = coords.y + moveY;
    // Set coordinates
    element.style.left = xNew + 'px';
    element.style.top = yNew + 'px';
}

function isTouching(e1, e2) {
    // Returns true if collision.
    const e1Coords = getCoords(e1);
    const e1x = e1Coords['x'];
    const e1y = e1Coords['y'];
    const e1Dimensions = getDimensions(e1);
    const e1w = e1Dimensions['width'];
    const e1l = e1Dimensions['height'];

    const e2Coords = getCoords(e2);
    const e2x = e2Coords['x'];
    const e2y = e2Coords['y'];
    const e2Dimensions = getDimensions(e2);
    const e2w = e2Dimensions['width'];
    const e2l = e2Dimensions['height'];

    // I don't know how this works at the moment but got it from the internet
    return !((e1x + e1w < e2x) || (e2x + e2w < e1x) || (e1y + e1l < e2y) || (e2y + e2l < e1y));

}

function getCoords(element) {
    // Get coordinates of element (x,y) pair
    const elementStyle = window.getComputedStyle(element);
    const elementX = parseFloat(elementStyle.left);
    const elementY = parseFloat((elementStyle.top));
    return {
        'x': elementX,
        'y': elementY
    }
}

function getDimensions(element) {
    // Get width and height of element
    const elementStyle = window.getComputedStyle(element);
    const elementWidth = parseFloat(elementStyle.width);
    const elementHeight = parseFloat(elementStyle.height);
    return {
        'width': elementWidth,
        'height': elementHeight
    }
}

function isPlayerBiggerThanEnemy(enemy) {
    const playerStyle = window.getComputedStyle(player);
    const enemyStyle = window.getComputedStyle(enemy);
    const playerSize = parseFloat(playerStyle.fontSize);
    const enemySize = parseFloat(enemyStyle.fontSize);
    return (playerSize >= enemySize);
}

function randomFrom(x, y) {
    // Returns random number from x to y
    return (Math.random() * (y - x) + x);
}



function resetGame() {
    // Reset player
    playScene.appendChild(player);


    // Reset pellets
    clearAll(allPellets);
    // Reset enemies
    clearAll(allEnemies);
    // Reset play button
    playBtn.style.display = 'revert';
    // Hide controls
    playControls.style.display = 'none';
}

function play() {
    allEnemies = [];
    player.style.left = playerStartX + 'px';
    player.style.top = playerStartY + 'px';
    player.style.fontSize = playerStartSize + 'px';
    playBtn.style.display = 'none';
    playControls.style.display = 'flex';
    player.style.display = 'block';
    winner.style.display = 'none';
    let intervalID = setInterval(function() {
        // Move the player if they need to move.
        if ( ! (playerVector['x'] === 0 && playerVector['y'] === 0) ) {
            // Move
            movePlayer();
        }
        else {
        }

        // Move each enemy according to its speed
        let done = false;
        allEnemies.some((enemy) => {
            if (!done) {
                moveEnemy(enemy);
                // Check if enemy is off screen. If so, destroy it.
                const coords = getCoords(enemy);
                if (coords.x < -150 || coords.x - 150 > sceneWidth || coords.y < -50 || coords.y > sceneWidth + 50) {
                    destroyEnemy(enemy);
                } else {
                    // If enemy touching player, compare sizes. If enemy bigger, player destroyed
                    if (isTouching(enemy, player)) {
                        if (isPlayerBiggerThanEnemy(enemy)) {
                            grow(calculateGrowth(enemy));
                            destroyEnemy(enemy);
                            const curSize = parseFloat(window.getComputedStyle(player).fontSize);
                            if (curSize > sceneHeight) {
                                done = true;
                                winner.style.display = 'revert';
                                resetGame();
                            }
                        }
                        else {
                            done = true;
                            player.style.display = 'none';
                            resetGame();
                            clearInterval(intervalID);
                        }
                    }
                }
            }
            else {
                return;
            }

        });
        // Every so often, spawn a pellet or an enemy;
        const intervalSeed = Math.random();
        if (intervalSeed < 0.012) {
            spawnPellet();
        }
        if (intervalSeed > 0.985) {
            spawnEnemy();
        }

        // If player touching pellet, make player eat pellet and grow
        allPellets.forEach((pellet) => {
            if (isTouching(player, pellet)) {
                // Destroy pellet
                destroyPellet(pellet);
                // // Make player grow
                grow(1.0);
            }
        });

    }, 20);
}



