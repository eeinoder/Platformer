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

    // SOLUTION: keep track of offset but don't add offset to each comparison between player1.y and y_max_player
    //
    if (selected_mode !== 'challenge') {
      // X
      if (player1.x-player1.x_offset > x_max_player && player1.x_speed >= 0) {
        player1.x_offset = player1.x - x_max_player;
        moveWorld('x', x_max_player);
      }
      else if (player1.x-player1.x_offset < x_min_player && player1.x_speed <= 0) {
        player1.x_offset = player1.x - x_min_player;
        moveWorld('x', x_min_player);
      }
      else {
        movePlayer('x');
      }
      // Y
      if (player1.y-player1.y_offset > y_max_player && player1.y_speed >= 0) {
        player1.y_offset = player1.y - y_max_player;
        moveWorld('y', y_max_player);
      }
      else if (player1.y-player1.y_offset < y_min_player && player1.y_speed <= 0) {
        player1.y_offset = player1.y - y_min_player;
        moveWorld('y', y_min_player);
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
    // TODO: put this at beginning of loop
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


/* CALCULATE NEW Y POSITION */
// NOTE: we don't have to update platform.top(s) after scrolling because distance between player.y
// and platform.top(s) is preserved (i.e. .y and .top are offset by the same amount)
function updateY() {
  var directly_beneath = null;
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
  // FIND ALL PLATFORMS UNDERNEATH PLAYER
  for (let platform of platforms) {
    if (!active_platforms.has(platform)) {
      player1.zones.delete(platform);
    }
    else {
      if (player1.x+player1.w > platform.left && player1.x < platform.right) {
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
  if (directly_beneath !== null) { // Note: if this is false, player can fall to death
    if (player1.y >= player1.floor.top) {
      player1.y = player1.floor.top;
      player1.y_speed = 0;
      player1.is_grounded = true;
      player1.has_wall_jumped = false; // reload wall jump
      if (selected_mode === 'challenge') {
        togglePlatforms();
      }
    }
  }
  // CHECK FOR DEATH
  if (player1.y + player1.h > window.outerHeight) {
    alert("You died.")
    is_game_start = false;
  }
}
