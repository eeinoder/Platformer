/* physics.js */
function updatePosition(interval) {
  // CHECK THAT GAME IS NOT PAUSED
  updateX();
  updateY();
  // RECURSIVELY UPDATE POSITION
  setTimeout(function () {
    // UPDATE ClOCK
    if (is_timer_start) {
      tick += interval;
      document.getElementById('clock').innerHTML = tick/1000;
    }
    // UPDATE POSITION
    player1.x += player1.x_speed;
    player1.y += player1.y_speed;

    /* Movement algorithm:
       if (speed > 0 (i.e. moving to right) and x>max) moveWorld(), else movePlayer()
       if (speed < 0 and x<xmin) moveWorld(), else movePlayer()
       repeat for y (?)
       NOTE: if y does same then need to caculate new top of platforms for collisionz
       NOTE2: once threshold is crossed
    */

    if (current_mode !== 'challenge') {
      // X
      if (player1.x-player1.x_offset > scroll_right_boundary && player1.x_speed >= 0) {
        player1.x_offset = player1.x - scroll_right_boundary;
        moveWorld('x', scroll_right_boundary);
      }
      else if (player1.x-player1.x_offset < scroll_left_boundary && player1.x_speed <= 0) {
        player1.x_offset = player1.x - scroll_left_boundary;
        moveWorld('x', scroll_left_boundary);
      }
      else {
        movePlayer('x');
      }
      // Y
      if (player1.y-player1.y_offset > scroll_down_boundary && player1.y_speed >= 0) {
        player1.y_offset = player1.y - scroll_down_boundary;
        moveWorld('y', scroll_down_boundary);
      }
      else if (player1.y-player1.y_offset < scroll_up_boundary && player1.y_speed <= 0) {
        player1.y_offset = player1.y - scroll_up_boundary;
        moveWorld('y', scroll_up_boundary);
      }
      else {
        movePlayer('y');
      }
    }

    else {
      movePlayer('x');
      movePlayer('y');
    }

    // CHECK FOR PLAYER PULSE. MOVE PULSE OUTWARD RADIALLY ABOUT PLAYER.
    if (player1.using_pulse) {
      var inner_radius = player1.pulse_diameter/2 - player1.pulse_width;
      // IF INNER RADIUS IS BIGGER THAN VIEWPORT DIMS STOP UPDATING PULSE AND HIDE IT.
      if (inner_radius > 1.05 * window.outerWidth && inner_radius > 1.05 * window.outerHeight) {
        hidePulse();
      }
      else {
        // UPDATE PULSE POSITION
        player1.pulse_diameter += player1.pulse_speed;
        // MOVE PULSE
        movePulse();
      }
    }

    // CHECK FOR PLAYER LUMINANCE
    if (is_dark && player1.using_torch) {
      moveHalo();
    }

    // RECURSE IF GAME IS STILL IN PROGRESS
    if (!is_game_pause) {
      if (is_game_start) {
        updatePosition(interval);
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
function checkWallCollision() {
  if (player1.x < x_min+wall_jump_err || player1.x+player1.w > x_max-wall_jump_err) {
    if (player1.x < x_min) {
      player1.x = x_min;
      player1.x_speed = 0;
    }
    else if (player1.x > x_max - player1.w) {
      player1.x = x_max - player1.w;
      player1.x_speed = 0;
    }
    player1.is_on_wall = true;
  }
  else {
    player1.is_on_wall = false;
  }
}

function checkGroundCollision() {
  var directly_beneath = null;
  // FIND ALL PLATFORMS UNDERNEATH PLAYER
  for (let platform of non_players) { // TODO: 'non_players' back to 'platforms'
    var has_clr_collision = platform.color === init_platform_color || platform.color === player1.color;
    if (!active_platforms.has(platform)) {
      if (platform.id.includes('platform')) { // TODO: remove this
      }
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
  if (player1.y + player1.h > window.outerHeight) {
    alert("You died.")
    is_game_start = false;
  }
}
