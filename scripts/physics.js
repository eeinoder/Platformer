/* physics.js */

/*
New system to work with title, card, level transitions:
Once player touches ground for first time, remove black screen,
otherwise it ruins the momentum if need to fade in every time restart level.

*/

function updateFrame(interval) {
  // CHECK THAT GAME IS NOT PAUSED
  updateX();
  updateY();

  // RECURSIVELY UPDATE POSITION, OBJECT ANIMATION
  setTimeout(function () {
    // UPDATE ClOCK
    tick += interval;
    if (is_timer_start) {
      document.getElementById('clock').innerHTML = tick/1000;
    }

    // PROCESS NEXT FADE IN/OUT REQUEST IF ANY
    fadeHandler();

    // UPDATE POSITION
    player1.x += player1.x_speed;
    player1.y += player1.y_speed;
    updatePosition();

    // CHECK FOR PLAYER PULSE. MOVE PULSE OUTWARD RADIALLY ABOUT PLAYER.
    if (player1.using_pulse) {
      updatePulse();
    }

    // CHECK FOR PLAYER LUMINANCE
    if (is_dark && player1.using_torch) {
      moveHalo();
    }

    // RECURSE IF GAME IS STILL IN PROGRESS
    if (!is_game_pause) {
      if (is_game_start) {
        updateFrame(interval);
      }
      else {
        endGame();
      }
    }
  }, interval);
}


/* CALCULATE NEXT X POSITION */
function updateX() {
  var net_accel = player1.x_accel_left + player1.x_accel_right - Math.sign(player1.x_speed)*friction;
  // UPDATE X SPEED
  player1.x_speed += net_accel;
  // LIMIT MAX SPEED
  if (player1.x_speed > max_speed) {
    player1.x_speed = max_speed;
  }
  else if (player1.x_speed < -max_speed) {
    player1.x_speed = -max_speed;
  }
  // IF NO EXTERNAL FORCE, HALT TO STOP
  if (player1.x_accel_left === 0 && player1.x_accel_right === 0) {
    if (net_accel * player1.x_speed > 0) {
      player1.x_speed = 0;
      player1.x_accel_left = 0;
      player1.x_accel_right = 0;
    }
  }
  // WALL COLLISION
  checkWallCollision();
  // IS PLAYER INSIDE/PASSING THROUGH STAINED GLASS. TODO: generalize this to more glass sections.
  checkPlayerFilter();
}


/* CALCULATE NEW Y POSITION */
function updateY() {
  // UPDATE Y SPEED
  player1.y_speed += gravity
  // ADD WALL FRICTION IF ON WALL: subtract speed in opposite direction proportional to gravity
  if (player1.is_on_wall) {
    player1.y_speed -= Math.sign(player1.y_speed)*gravity*wall_friction;
  }
  // ADD MULTPLIER TO MAKE FALL MORE SATISFYING, AND UPDATE GROUNDED BOOL
  if (player1.speed !== 0) { // Player shouldnt jump if he's falling (idea: make this true to enable late jump off platforms)
    player1.is_grounded = false;
    if (player1.y_speed > 0) {
      player1.y_speed += gravity * fall_multiplier;
    }
  }
  // GROUND COLLISION
  checkGroundCollision();
  // DEATH
  checkDeath();
}




/* ---------------------------------- HANDLERS --------------------------------*/
// TODO: AFTER ADDING WALL OBJECTS CHECK ALL WALLS LIKE DO FOR ALL PLATFORMS IN GROUND COLLISION !!!
// MUST CHECK IF IN WALL 'ZONE', i.e. THAT PLAYER TOP < WALL TOP && PLAYER BOTTOM > WALL BOTTOM.
function checkWallCollision() {
  //console.log(player1.on_right_wall)
  if (player1.x <= x_min || player1.x+player1.w >= x_max) { // TODO: add wall_jump_err
    if (player1.x < x_min) { // Collision with left wall.
      player1.x = x_min;
      player1.x_speed = 0;
      //player1.x_accel_left = 0;
    }
    else if (player1.x > x_max - player1.w) { // Collision with right wall.
      player1.x = x_max - player1.w;
      player1.x_speed = 0;
      //player1.x_accel_right = 0;
    }
    // If object was, or is now, at either wall...
    if (player1.x === x_min) {
      player1.on_left_wall = true;
    }
    else if (player1.x === x_max - player1.w) {
      player1.on_right_wall = true;
    }
  }
  else {
    player1.on_left_wall = false;
    player1.on_right_wall = false;
  }
  player1.is_on_wall = player1.on_left_wall || player1.on_right_wall;
}

function checkGroundCollision() {
  var directly_beneath = null;
  // FIND ALL PLATFORMS UNDERNEATH PLAYER
  for (let platform of non_players) { // TODO: 'non_players' back to 'platforms'
    var has_clr_collision = platform.color === init_platform_color || platform.color === player1.color;
    if (!active_platforms.has(platform)) {
      player1.zones.delete(platform);
    }
    else {
      if (player1.x+player1.w > platform.left && player1.x < platform.right && has_clr_collision) {
        if (player1.y < platform.top) {
          player1.zones.add(platform);
        }
      }
      else {
        player1.zones.delete(platform);
      }
    }
  }
  // FIND PLATFORM DIRECTLY BENEATH
  for (let zone of player1.zones) {
    if (directly_beneath === null) {
      directly_beneath = zone;
    }
    else {
      directly_beneath = zone.top < directly_beneath.top ? zone : directly_beneath;
    }
  }
  player1.floor = directly_beneath;
  // CHECK FOR GROUND ('FLOOR') COLLISION
  if (player1.floor !== null) { // Note: if this is false, player can fall to death
    if (player1.y >= player1.floor.top) {
      player1.y = player1.floor.top;
      player1.y_speed = 0;
      player1.is_grounded = true;
      player1.has_wall_jumped = false; // reload wall jump
      if (current_mode === 'challenge') {
        togglePlatforms();
      }
    }
  }
}

function checkDeath() {
  // NOTE: if sidescrolling disabled, you can fall and not die and not be able to
  // see character with this condition. THAT IS BAD.
  if (player1.floor === null && player1.y + player1.h > window.outerHeight) {
    alert("You died.")
    is_game_start = false;
  }
}
