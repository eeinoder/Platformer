// Simple 2D platformer / side-scroller
// NOTE: should ONLY set is_game_start to true once, when game starts updating position
/* DEFINE CONSTANTS and GAME VARIABLES */

// Game
let game_modes = ['classic', 'challenge'];
let selected_mode = '';
let is_game_start = false;
let is_game_pause = false;
let is_timer_start = false;
let init_color = '#555'; // '#2eb2ff'

// Time
let frame_time = 10; // duration of frame in ms. 1/fps.
let default_time = 10; // CONSTANT. Do not change.
let tick = 0; // elapsed frame count
let time_scale = frame_time/default_time;
let time_scale_sq = Math.pow(frame_time/default_time, 2);

// X-direction
let x_scale = window.outerWidth / 1160;
let x_min = -2 * window.outerWidth; // -0.008
let x_max = 2 * window.outerWidth; // .991
let x_min_player = 0.4 * window.outerWidth; // min of player motion before side-scrolling starts
let x_max_player = 0.6 * window.outerWidth; // max of ...
let wall_jump_err = 0; // tolerance in px
let max_speed = 12 * time_scale * x_scale;
let init_x_accel = .75 * time_scale_sq * x_scale; // Forces defined like .75 px / (10 ms)^2. Adjusted for actual frame time.
let friction = .5 * time_scale_sq * x_scale;

// Y-direction
let y_scale = window.outerHeight / 967;
let y_min_player = .3 * window.outerHeight;
let y_max_player = .7 * window.outerHeight;
let init_y_speed = -12 * time_scale * y_scale;
let fall_multiplier = 2; // * 1/time_scale ?;
let low_jump_multiplier = 25; // * 1/time_scale ?;
//let jump_err = 5; // tolerance in px
let gravity = .2 * time_scale_sq * y_scale;
let wall_friction = 2.2 * time_scale_sq * y_scale;


// Game objects
let player1 = new Player('P1');
//let players = [player1];                      // NOTE:
let platforms = generatePlatforms();            // platforms:          all defined platforms
let active_platforms = new Set(platforms);      // active_platforms:   all unhidden, interactable platforms
                                                // player1.zones:      platforms that are beneath the player
let colors = ['#2eb2ff', '#fa931e', '#bd56fc', '#ffa6e9'];
let color_dict = {blue:'#2eb2ff', orange:'#fa931e', purple:'#bd56fc', pink:'#ffa6e9'}


/* -------------------------------------------------------------------------- */

/* ADD EVENT LISTENERS */
// Menu selections
for (let game_mode of document.getElementsByClassName('menu_button')) {
  game_mode.addEventListener('mouseover', mouseOver);
  game_mode.addEventListener('mouseout', mouseOut);
  game_mode.addEventListener('click', click);
}
document.addEventListener('keypress', press);

// Game inputs
document.addEventListener('keydown', engageInput);
document.addEventListener('keyup', releaseInput);


/* ----------------------------- GAME HANDLERS ----------------------------- */

function startGame() {
  if (!is_game_start) {
    is_game_pause = false;
    initGame();
    is_game_start = true;
    updatePosition(frame_time);
  }
}

function endGame() {
  // TODO: load new level if succeeded. reload current level if failed.
  is_game_start = false;
  startGame();
}

function initGame() {
  // Reset clock
  tick = 0;
  is_timer_start = false;
  document.getElementById('clock').innerHTML = '0.00'
  // DO NOT INITIALIZE NEW GAME IF ALREADY IN PROGRESS
  if (is_game_start) {
    return;
  }
  // RESET PLAYER COORDINATES, VELOCITIES, ACCELERATION
  resetPlayer();
  resetPlatforms();
  hidePulse();

  // ACTIVATE PLATFORMS AND MAKE THEM VISIBLE
  document.getElementsByClassName('game')[0].classList.remove('hidden');

  if (selected_mode === 'classic') {
    for (let platform of platforms) {
      document.getElementById(platform.id).style.backgroundColor = init_color;
      document.getElementById(platform.id).classList.remove('hidden');
    }
    active_platforms = new Set(platforms);
    document.getElementById('clock').classList.add('hidden');
  }

  else if (selected_mode === 'challenge') {
    for (let platform of platforms) {
      if (platform.id === 'ground' || platform.id === 'platform1') {
        document.getElementById(platform.id).classList.remove('hidden');
        active_platforms.add(platform);
      }
      else {
        document.getElementById(platform.id).classList.add('hidden');
        active_platforms.delete(platform);
      }
    }
    document.getElementById('clock').classList.remove('hidden');
  }

  // RESET COLORS
  document.body.style.backgroundColor = colors[0];
  document.getElementById('ground').style.backgroundColor = '#555';

  // MAKE TITLE SCREEN AND MENU HIDDEN
  document.getElementsByClassName('title')[0].classList.add('hidden');
  hideMenu();
}



/* --------------------------------- HELPERS ------------------------------- */

function resetPlayer() {
  // RESET PLAYER POSITION
  player1.x = player1.x_init;
  player1.y = player1.y_init;
  player1.x_offset = 0;
  player1.y_offset = 0;
  player1.x_speed = 0;
  player1.y_speed = 0;
  player1.x_accel_left = 0;
  player1.x_accel_right = 0;
  player1.y_accel = 0;
  // RESET PLAYER OBJECT
  document.getElementById('P1').style.marginLeft = player1.left();
  document.getElementById('P1').style.marginTop = player1.top();
}

function resetPlatforms() {
  for (let platform of platforms) {
    document.getElementById(platform.id).style.marginLeft = platform.left+'px';
    document.getElementById(platform.id).style.marginTop = platform.top+'px';
  }
}

function hidePulse() {
  player1.using_pulse = false;
  document.getElementById('outerPulse').classList.add('hidden');
  document.getElementById('innerPulse').classList.add('hidden');
}


/* */
