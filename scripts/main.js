// Simple 2D platformer / side-scroller
// NOTE: should ONLY set is_game_start to true once, when game starts updating position
/* DEFINE CONSTANTS and GAME VARIABLES */

// Game
let game_modes = ['classic', 'challenge'];
let current_mode = '';
let selected_mode = '';
let current_level = 0;
let next_level = current_level;
let level_cleared = false;
let is_game_start = false;
let is_game_pause = false;
let is_timer_start = false;
let is_mouse_down = false;
let init_platform_color = '#555555'; // '#2eb2ff'
let init_player_color = '#ffffff';
let zoom_factor = 1.25; // E.g. Zoom in by zf=1.25, zoom out by 1/zf=0.8

// Time
let default_time = 10; // CONSTANT. Do not change.
let frame_time = 10; // duration of frame in ms. 1/fps.
let tick = 0; // elapsed frame count
let time_scale = frame_time/default_time;
let time_scale_sq = Math.pow(frame_time/default_time, 2);
let is_dark = true; // TODO: CHANGE TO FALSE AFTER TESING !!!

// X-direction
let x_scale = window.outerWidth / 1160;
let x_min = -2 * window.outerWidth; // -0.008 "Edge of map left"
let x_max = 2 * window.outerWidth; // .991 "Edge of map right"
let scroll_left_boundary = 0.4 * window.outerWidth; // min of player motion before side-scrolling starts
let scroll_right_boundary = 0.6 * window.outerWidth; // max of ...
let wall_jump_err = 0; // tolerance in px
let max_speed = 12 * time_scale * x_scale;
let init_x_accel = .75 * time_scale_sq * x_scale; // Forces defined like .75 px / (10 ms)^2. Adjusted for actual frame time.
let friction = .5 * time_scale_sq * x_scale;

// Y-direction
let y_scale = window.outerHeight / 967;
let scroll_up_boundary = .3 * window.outerHeight;
let scroll_down_boundary = .7 * window.outerHeight;
let init_y_speed = -12 * time_scale * y_scale;
let fall_multiplier = 2; // * 1/time_scale ?;
let low_jump_multiplier = 25; // * 1/time_scale ?;
//let jump_err = 5; // tolerance in px
let gravity = .2 * time_scale_sq * y_scale;
let wall_friction = 2.2 * time_scale_sq * y_scale;


// Game objects
let platforms, players, stainedglass;
[platforms, players, stainedglass] = generateLevel(current_level);
let player1 = players[0]; // Defined like this because most of code still references 'player1'.
let non_players = platforms.concat(stainedglass); // Platforms, walls, stainedglass, other filters, i.e. anything player can interact with.
let game_objects = non_players.concat(players);
let all_objects;
// TODO: define background, foreground, midground that move with world at different rates, i.e. PARALLAX
// and include them in all_objects array
// TODO: figure out issue with ground collision on stainedglass
let active_platforms = new Set(platforms);
let colors = ['#2eb2ff', '#fa931e', '#bd56fc', '#ffa6e9'];
let color_dict = {blue:'#2eb2ff', orange:'#fa931e', purple:'#bd56fc', pink:'#ffa6e9'}
// active_platforms:
// all unhidden, interactable platforms, mainly used in Challenge mode, where collision not dependant on color
// NOTE: IDEA!!: challenge mode unlocked at (or near) end when player unlocks 'rainbow' mode where player can
// 'hold' onto all pigments at once or cycle through them very fast, and so can interact with all platform colors.
// player1.zones:
// active platforms that are beneath the player


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

// Virtual buttons
// (enables touch screen controls. may not be compatible with Android devices.)
document.addEventListener('mousedown', function(){
  is_mouse_down = true;
  engageInput(event);
});
document.addEventListener('mouseup', function(){
  is_mouse_down = false;
  releaseInput(event);
});
document.addEventListener('mouseover', engageInput);
document.addEventListener('mouseout', releaseInput);



/* ----------------------------- GAME HANDLERS ----------------------------- */

function startGame() {
  if (!is_game_start) {
    is_game_pause = false;
    initGame(current_level);
    is_game_start = true;
    updatePosition(frame_time);
  }
}

function endGame() {
  is_game_start = false;
  if (level_cleared) {
    // next_level = current_level + 1;
    // display 'Level Cleared' screen, player can choose to advance to
    // next level by default or go to previously cleared level.
  }
  else {
    // display 'You DIED' screen, player can restart by default or
    // go to previously cleared level.
  }
  // TODO: delete this and integrate into screens depicted above
  // REPLACE ALL 'ALERT' MESSAGES WITH THESE
  startGame();
}

function initGame() {
  // DO NOT INITIALIZE NEW GAME IF ALREADY IN PROGRESS
  if (is_game_start) {
    return;
  }
  // LOAD NEXT LEVEL OR RESET CONDITIONS IF LEVEL RESTARTED
  if (next_level !== current_level || selected_mode !== current_mode) {
    // First remove all DOM objects present from last level if there was one.
    deloadLevel();
    // Instantiate all game objects and arrays of objects.
    [platforms, players, stainedglass] = generateLevel(current_level); // TODO: current level should
    player1 = players[0];                                 // include what game mode ... load different level.
    active_platforms = new Set(platforms);
    non_players = platforms.concat(stainedglass);
    game_objects = non_players.concat(players);
    current_mode = selected_mode;
  }
  else {
    resetPlayer();
    resetNonplayers();
  }
  // RESET OTHER PARAMETERS THAT ARE MORE STATIC LEVEL TO LEVEL
  if (selected_mode === 'challenge') {
    hidePlatforms();
  }
  resetClock();
  hidePulse();
  hideHalo();

  // REVEAL GAME BOARD
  document.getElementsByClassName('game')[0].classList.remove('hidden');

  // RESET BACKGROUND COLOR // TODO: AFTER ADDING BACKGROUND 'OBJECTS' THAT MAY CHANGE
  // BETWEEN LEVEL ("DYANMIC BG, IN SOME SENSE") DEFINE HANDLER TO LOAD BACKGROUNDS
  document.body.style.backgroundColor = colors[0];

  // MAKE TITLE SCREEN AND MENU HIDDEN
  document.getElementsByClassName('title')[0].classList.add('hidden');
  hideMenu();

  // TODO: if selected in menu, make virtual_button's visbile
  document.getElementsByClassName('virtual_button_container')[0].classList.remove('hidden');
  //document.getElementById('jump_button').innerHTML = '';
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
  player1.color = '#ffffff'
  player1.colorFilter = undefined;
  // RESET PLAYER OBJECT
  document.getElementById('player1').style.marginLeft = player1.left();
  document.getElementById('player1').style.marginTop = player1.top();
  document.getElementById('player1').style.backgroundColor = player1.color;
  document.getElementById('player1').style.zIndex = '1';
}

function resetNonplayers() {
  for (let npo of non_players) {
    document.getElementById(npo.id).style.marginLeft = npo.left+'px';
    document.getElementById(npo.id).style.marginTop = npo.top+'px';
    document.getElementById(npo.id).style.backgroundColor = npo.color;
    //if (npo.id.includes('platform') || npo.id === 'ground') {}
    if (npo.id.includes('stainedglass')) {
      document.getElementById(npo.id).style.zIndex = '0';
    }
  }
}

function resetClock() {
  tick = 0;
  is_timer_start = false;
  document.getElementById('clock').innerHTML = '0.00'
}

function hidePlatforms() {
  for (let platform of platforms) {
    if (platform.id === 'ground' || platform.id === 'platform1') {
      revealPlatform(platform);
    }
    else {
      hidePlatform(platform);
    }
  }
}

function hidePulse() {
  player1.using_pulse = false;
  document.getElementById('outerPulse').classList.add('hidden');
  document.getElementById('innerPulse').classList.add('hidden');
  // TODO:
}

function hideHalo() {
  player1.using_torch = false;
  document.getElementById('halo1').classList.add('hidden');
}


/* */
