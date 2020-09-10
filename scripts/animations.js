// player and platform animations

function movePlayer(axis) {
  if (axis === 'x') {
    //document.getElementById(player1.id).style.marginLeft = player1.left();
    document.getElementById(player1.id).style.marginLeft = player1.x - player1.x_offset + 'px';
  }
  else if (axis === 'y') {
    document.getElementById(player1.id).style.marginTop = player1.y - player1.h - player1.y_offset + 'px';
  }
  else {
     throw "input is not an axis ('x' or 'y')"
  }
}

function moveWorld(axis, ref_point) {
  for (let platform of platforms) {
    if (axis === 'x') {
      document.getElementById(platform.id).style.marginLeft = platform.left-(player1.x-ref_point) + 'px';
    }
    else if (axis === 'y') {
      document.getElementById(platform.id).style.marginTop = platform.top-(player1.y-ref_point) + 'px';
    }
    else {
      throw "input is not an axis ('x' or 'y')"
    }
  }
}

function movePulse() {
  let outer_pulse = document.getElementById('outerPulse');
  let inner_pulse = document.getElementById('innerPulse');

  // DRAW NEW PULSE FRAME
  outer_pulse.style.width = player1.pulse_diameter + 'px';
  outer_pulse.style.height = player1.pulse_diameter + 'px';
  outer_pulse.style.marginLeft = player1.x - player1.x_offset - player1.pulse_diameter/2 + player1.w/2 + 'px';
  outer_pulse.style.marginTop = player1.y - player1.y_offset - player1.pulse_diameter/2 - player1.h/2 + 'px';

  inner_pulse.style.width = player1.pulse_diameter - player1.pulse_width + 'px';
  inner_pulse.style.height = player1.pulse_diameter - player1.pulse_width + 'px';
  inner_pulse.style.marginLeft = player1.x - player1.x_offset - (player1.pulse_diameter/2 - player1.pulse_width/2) + player1.w/2 + 'px';
  inner_pulse.style.marginTop = player1.y - player1.y_offset - (player1.pulse_diameter/2 - player1.pulse_width/2) - player1.h/2 + 'px';

  inner_pulse.style.backgroundColor = window.getComputedStyle(document.body).getPropertyValue('background-color');
}

function readyPulse() {
  // make pulse (outer and inner pulse) visible (set inner pulse color current body backgroundColor)
  // grow width and height by constant pulse speed centered about player
  let outer_pulse = document.getElementById('outerPulse');
  let inner_pulse = document.getElementById('innerPulse');

  // UPDATE PULSE DIAMETER
  player1.pulse_diameter = 0;

  // DRAW FIRST PULSE FRAME
  outer_pulse.style.backgroundColor = player1.pulse_color;
  inner_pulse.style.backgroundColor = document.body.backgroundColor;
  movePulse();

  // MAKE PULSE VISIBLE
  outer_pulse.classList.remove('hidden');
  inner_pulse.classList.remove('hidden');

  player1.using_pulse = true;
}

function animateSquish() {
  let squish_factor = .4*player1.h;
  $('#'+player1.id).animate({
    'height': player1.h-squish_factor+'px'
  }, 200).animate({
    'height': player1.h+'px'
  },400);
}

function animateStretch() {
  let stretch_factor = .4*player1.h;
  $('#'+player1.id).animate({
    'height': player1.h+stretch_factor+'px'
  }, 200).animate({
    'height': player1.h+'px'
  },400);
}



/* ------------------ FUNCTIONS FOR 'CHALLENGE' MODE ---------------------- */

function togglePlatforms() {
  // Algorithm:
  // (Upon jump onto platform) ...
  var curr_platform = player1.floor;
  var platform_id = platforms.indexOf(curr_platform);
  if (curr_platform.id !== 'ground') {
    let curr_color = colors[(platform_id-1)%colors.length];
    let next_color = colors[platform_id%colors.length];
    let last_platform = platforms[platform_id-1];
    let next_platform = platforms[(platform_id+1)%platforms.length];
    // Change background color to next color in sequence
    document.body.style.backgroundColor = next_color;
    // Make next platform visible and set color to last background color
    document.getElementById(next_platform.id).style.backgroundColor = curr_color;
    revealPlatform(next_platform);
    // Make last platform hidden
    hidePlatform(last_platform);
  }
  else { // TODO: make this win condition better...
    if (!active_platforms.has(platforms[1]) && is_game_start) {
      alert("You win!")
      is_game_start = false;
    }
  }
}

function hidePlatform(platform) {
  // Add class to hidden
  document.getElementById(platform.id).classList.add('hidden');
  // Remove from list of findable platforms
  active_platforms.delete(platform);
}

function revealPlatform(platform) {
  // Remove from hidden class
  document.getElementById(platform.id).classList.remove('hidden');
  // Add to platforms list
  active_platforms.add(platform);
}


// TODO: REMOVE BELOW AFTER TESTING !!!
function makeInvisible(platform) {
  document.getElementById(next_platform.id).style.backgroundColor = '#2eb2ff';
}

function makeVisible(platform) {
  document.getElementById(next_platform.id).style.backgroundColor = '#555';
}


/* */
