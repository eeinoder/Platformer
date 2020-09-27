/* CONTROL HANDLERS */
// TODO: enable controls only once completely faded in,
// i.e. when fade filter is hidden (?)

function engageInput(e) {
  // Initialize timer on first user input.
  if (!is_timer_start) {
    is_timer_start = true;
  }
  // Prohibit input if game is not started or if game in transition.
  if (!is_game_start) {
    return;
  }
  if (fading_in || fading_out) {
    return;
  }
  // Start game from title screen with any key and have player jump.
  if (onTitleScreen()) {
    player1.y_speed = init_y_speed + gravity * low_jump_multiplier;;
    startFromTitle();
    return;
  }

  /* MOVE RIGHT */
  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    if (!player1.on_right_wall) {
      // Virtual button condition: || (e.target.id === 'right_button' && is_mouse_down)
      player1.x_accel_right = init_x_accel;
    }
  }

  /* MOVE LEFT */
  else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    if (!player1.on_left_wall) {
      // Virtual button condition: || (e.target.id === 'left_button' && is_mouse_down)
      player1.x_accel_left = -init_x_accel;
    }
  }

  /* JUMP */
  else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    // Virtual button condition: || (e.target.id === 'jump_button' && is_mouse_down)
    // NOTE: final condition onTitleScreen() makes it so player will jump on any key stroke while on title card.
    if (!player1.is_space_down && player1.canJump()) {
      // PLAYER ANIMATION: STRETCH
      //animateStretch();
      if (player1.is_on_wall) {
        player1.has_wall_jumped = true;
      }
      // ADD INITIAL Y VELOCITY
      player1.y_speed = init_y_speed;
      // PLAYER ANIMATION: SQUISH
      if (!player1.is_grounded) {
        //animateSquish();
      } // Player was just in the air
    }
    player1.is_grounded = false;
    player1.is_space_down = true;
  }

  /* USE PULSE */
  else if (e.code === 'ShiftRight' || e.code === 'KeyE') {
    if (!player1.using_pulse && player1.unlocked_pulse) { // multiple pulses?
      readyPulse();
    }
  }

  /* ZOOM IN */
  else if (e.code === 'Equal') {
    //zoom(zoom_factor); // Default is zoom_factor = 1.25;
  }

  /* ZOOM OUT */
  else if (e.code === 'Minus') {
    //zoom(1/zoom_factor);
  }

  // TODO: REMOVE AFTER TESTING !!!!
  else if (e.code === 'KeyN') {
    if (is_dark && !player1.using_torch) {
      player1.using_torch = true;
      readyHalo();
    }
    else {
      player1.using_torch = false;
      hideHalo();
    }
  }
}



function releaseInput(e) {
  // Same control statements.
  if (!is_game_start) {
    return;
  }
  if (fading_in || fading_out) {
    return;
  }

  /* STOP MOVING RIGHT */
  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    // Virtual button condition: || e.target.id === 'right_button'
    player1.x_accel_right = 0;
  }

  /* STOP MOVING LEFT */
  else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    // Virtual button condition: || e.target.id === 'left_button'
    player1.x_accel_left = 0;
  }

  /* STOP HOLDING JUMP */
  else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    // Virtual button condition: || e.target.id === 'jump_button'
    if (!player1.is_grounded) {
      player1.y_speed += gravity * low_jump_multiplier;
    }
    player1.is_space_down = false;
  }
}
