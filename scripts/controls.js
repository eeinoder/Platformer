/* CONTROL HANDLERS */
function engageInput(e) {
  if (!is_timer_start) {
    is_timer_start = true;
  }
  if (!is_game_start) {
    return;
  }

  /* MOVE RIGHT */
  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    player1.x_accel_right = init_x_accel;
  }

  /* MOVE LEFT */
  else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    player1.x_accel_left = -init_x_accel;
  }

  /* JUMP */
  else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    if (!player1.is_space_down && player1.canJump()) {
      //animateStretch();
      if (player1.is_on_wall) {
        player1.has_wall_jumped = true;
      }
      player1.y_speed = init_y_speed;
      if (!player1.is_grounded) {
        //animateSquish();
      } // Player was just in the air
    }
    player1.is_grounded = false;
    player1.is_space_down = true;
  }

  /* USE PULSE */
  else if (e.code === 'ShiftRight' || e.code === 'KeyE') {
    if (!player1.using_pulse) { // multiple pulses?
      readyPulse();
    }
  }
}



function releaseInput(e) {
  if (!is_game_start) {
    return;
  }
  /* STOP MOVING RIGHT */
  if (e.code === 'ArrowRight' || e.code === 'KeyD') {
    player1.x_accel_right = 0;
  }

  /* STOP MOVING LEFT */
  else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
    player1.x_accel_left = 0;
  }

  /* STOP HOLDING JUMP */
  else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
    if (!player1.is_grounded) {
      player1.y_speed += gravity * low_jump_multiplier;
    }
    player1.is_space_down = false;
  }
}
