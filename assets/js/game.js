// get the canvas element
var canvas = document.getElementById("game_area");

// canvas variables
var canvas_width = 500;
var canvas_height = 600;

// ctx
var ctx = canvas.getContext("2d");

// object variables
// position
var obj_x = 150;
var obj_y = 150;
var obj_radius = 15;
// color
var obj_color = "#eb495a";
// gravity
var gravity = 0.6;
// movement
var velocity = 0;
var lift = -16;

// obstacles variables
var obs_speed = 2;
var obs_width = 50;
var obs_x = canvas_width;
var obs_gap = 150;
// obstacle color
var obs_color = "#1a1a1a";
// the added speed
var obs_difficulity = 0.1;

// game over ?
var game_over = false;

// score
var score = 0;
var best_score = 0;

// call the (loop) functions
setup();
main();

function main(){
  // frames / repeats
  window.requestAnimationFrame(main);

  if (game_over == false){
    // clears the game board
    clearArea();

    // update the game object position
    updateObject();
    // draw the object to new position
    drawObject();

    // update obstacle position
    updateObstacle();
    // draw the obstacle to new position
    drawObstacle();
  }
  else {
    reset();
  }
}

function setup(){
  // canvas setup
  canvas.width = canvas_width;
  canvas.height = canvas_height;

  // obstacle setup
  setupObstacle();

  // object setup
  // first object frame
  drawObject();

  // new event listener check key status
  window.addEventListener("keydown", keyPress);
}

function reset(){
  // global game reset
  // object variables
  // position
  obj_x = 150;
  obj_y = 150;

  // movement
  velocity = 0;

  // obstacles variables
  obs_speed = 2;
  obs_x = canvas_width;

  // game over ?
  game_over = false;

  // update best score
  //if (score > best_score){
  //  best_score = score;
  //  updateBestScore(best_score);
  //}

  // reset score
  score = 0;
  updateScore(score);
}

function keyPress(){
  velocity += lift;
}

function setupObstacle(){
  // setup the obstacle
  // top bar
  obs_top = Math.floor(Math.random() * (canvas_height - obs_gap));
  // bottom bar
  obs_bot = canvas_height - obs_top + 50;
}

function drawObject(){
  // start a path
  ctx.beginPath();
  ctx.arc(obj_x, obj_y, obj_radius, 0, Math.PI * 2, false);
  // color it red
  ctx.strokeStyle = obj_color;
  ctx.fillStyle = obj_color;
  // finish / stroke
  ctx.fill();
  ctx.stroke();
}

function drawObstacle(){
  // use obstacle color
  ctx.fillStyle = obs_color;
  // fill the top bar
  ctx.fillRect(obs_x, 0, obs_width, obs_top);
  // fill the bottom bar
  ctx.fillRect(obs_x, (obs_top + obs_gap), obs_width, obs_bot);
}

function updateObject(){
  // new position
  velocity += gravity;
  velocity *= 0.9;
  obj_y += velocity;

  // if object hits bottom
  if (obj_y + obj_radius > canvas_height){
    gameOver();
  }

  // if object hits obstacle
  if (obj_x >= obs_x && obj_x <= (obs_x + obs_width)){
    if (obj_y <= obs_top){
      gameOver();
    }
    else if (obj_y >= (obs_top + obs_gap)){
      gameOver();
    }
  }
}

function updateObstacle(){
  // new obstacle position
  obs_x -= obs_speed;

  // obstacle is invisible
  if (obs_x <= (0 - obs_width)){
    // update score
    score++;
    updateScore(score);

    // update the best score too
    if (score > best_score){
      best_score = score;
      updateBestScore(best_score);
    }

    // reset obstacle
    obs_x = canvas_width;

    // make the game faster
    obs_speed += obs_difficulity;

    // generate new obstacle
    setupObstacle();
  }
}

function gameOver(){
  game_over = true;
}

function clearArea(){
  // clear the canvas
  ctx.clearRect(0, 0, canvas_width, canvas_height);
}

function updateScore(value){
  // write text to scoreboard
  document.getElementById("score").innerHTML = value;
}

function updateBestScore(value){
  // write text to scoreboard
  document.getElementById("best_score").innerHTML = value;
}
