// get the canvas element
let canvas = document.getElementById('game_area');

// canvas variables
canvas.width = 500;
canvas.height = 600;

// ctx
const ctx = canvas.getContext('2d');

// object variables
let object = {x: 150, y: 150, radius: 15, color: '#eb495a'};

// gravity
const gravity = 0.6;
let velocity = 0;
const lift = -16;

// obstacle
let obstacle = {speed: 2, width: 50, x: canvas.width, gap: 150, color: '#1a1a1a', difficulty: 0.1, bottom: 0, top: 0};

// game over
let gameOver = false;

// score
let score = {actual: 0, best: 0};
let animationRequestID = 0;


// call the (loop) functions
setup();
main();

// cookie check for popup visibility
try {
  if (window.hasOwnProperty('localStorage')){
    if (window.localStorage.getItem("cookieConsent") === "true") {
      document.getElementById('popup').style.display = 'none';
    }
  }
} catch(e) {
  console.error(e);
}



function main() {
  // frames / repeats
  animationRequestID = window.requestAnimationFrame(main);

  if (!gameOver) {
    // clears the game board
    clearArea();

    // update obstacle position
    updateObstacle();
    // draw the obstacle to new position
    drawObstacle();

    // update the game object position
    updateObject();
    // draw the object to new position
    drawObject();
  } else {
    reset();
  }
}

function setup() {
  // obstacle setup
  setupObstacle();

  // object setup
  // first object frame
  drawObject();

  // new event listener check key status
  if (!isTouchDevice()) {
    window.addEventListener('keydown', () => keyPress(false));
    canvas.addEventListener("click", () => keyPress(true));
  } else {
    canvas.addEventListener("touchstart", () => keyPress(true));
  }
}

function reset() {
  // global game reset
  // object variables
  // position
  object.x = 150;
  object.y = 150;

  // movement
  velocity = 0;

  // obstacles variables
  obstacle.speed = 2;
  obstacle.x = canvas.width;

  // game over ?
  gameOver = false;

  // update best score
  // if (score > best_score){
  //  score.best = score.actual;
  //  updateBestScore(score.best);
  // }

  // reset score
  score.actual = 0;
  updateScore(score.actual);
}

function keyPress(clickMode) {
  if (clickMode) return velocity += (lift * 1.25);
  // lift up (the object)
  velocity += lift;
}

function setupObstacle() {
  // setup the obstacle
  // top bar
  obstacle.top = Math.floor(Math.random() * (canvas.height - obstacle.gap));
  // bottom bar
  obstacle.bottom = canvas.height - obstacle.top;
}

function drawObject() {
  // start a path
  ctx.beginPath();
  ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2, false);
  // color it red
  ctx.strokeStyle = object.color;
  ctx.fillStyle = object.color;
  // finish / stroke
  ctx.fill();
  ctx.stroke();
}

function drawObstacle() {
  // use obstacle color
  ctx.fillStyle = obstacle.color;
  // fill the top bar
  ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.top);
  // fill the bottom bar
  ctx.fillRect(obstacle.x, (obstacle.top + obstacle.gap), obstacle.width, obstacle.bottom);
}

function updateObject() {
  // new position
  velocity += gravity;
  velocity *= 0.9;
  object.y += velocity;

  // if object hits bottom
  if (object.y + object.radius > canvas.height) {
    onGameOver();
  }

  // constants for object tracking / obstacle detection
  const radiusIncludedX = (object.x + object.radius);
  const radiusIncludedY = (object.y + object.radius)

  // if object hits obstacle && object.x <= (obstacle.x + obstacle.width)
  if (object.x + object.radius >= obstacle.x && (object.x - object.radius) <= (obstacle.x+ obstacle.width) ) {
    if (object.y <= obstacle.top) {
      onGameOver();
    } else if (radiusIncludedY >= (obstacle.top + obstacle.gap)) {
      onGameOver();
    }
  }
}

function updateObstacle() {
  // new obstacle position
  obstacle.x -= obstacle.speed;

  // obstacle is invisible / out of the canvas element
  if (obstacle.x <= (0 - obstacle.width)) {
    // update score
    score.actual++;
    updateScore(score.actual);

    // update the best score too
    if (score.actual > score.best) {
      score.best = score.actual;
      updateBestScore(score.best);
    }

    // reset obstacle
    obstacle.x = canvas.width;

    // make the game faster
    obstacle.speed += obstacle.difficulty;

    // generate new obstacle
    setupObstacle();
  }
}

function onGameOver() {
  // cancel animation frame (for faster game restart)
  window.cancelAnimationFrame(animationRequestID);
  gameOver = true;
  
  // new game setup
  reset();
  main();
}

function clearArea() {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateScore(value) {
  // write text to scoreboard
  document.getElementById('score').innerHTML = value;
}

function updateBestScore(value) {
  // write text to scoreboard
  document.getElementById('best_score').innerHTML = value;
}

function isTouchDevice() {
    return 'ontouchstart' in window        // works on most browsers
        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
}

function consentToCookies() {
  document.getElementById('popup').style.visibility = 'hidden';
  if (window.hasOwnProperty('localStorage')) window.localStorage.setItem('cookieConsent', 'true');
}
