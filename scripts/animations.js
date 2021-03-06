// player and platform animations

/* TODO: partition script into:
 playermotion.js
 playerabilities.js
 worldmotion.js
 challengemode.js
 ...
 */

 /* ---------------------------- GAME OBJECT MOTION ------------------------- */

 /* Side-scrolling Movement logic:
    if (speed > 0 (i.e. moving to right) and x>max) moveWorld(), else movePlayer()
    if (speed < 0 and x<xmin) moveWorld(), else movePlayer()
    repeat for y (?)
    NOTE: if y does same then need to caculate new top of platforms for collisions
    NOTE2: once threshold is crossed
 */
function updatePosition() {
  // X - position
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
  // Y - position
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
  for (let npo of non_players) {
    if (axis === 'x') {
      document.getElementById(npo.id).style.marginLeft = npo.left-(player1.x-ref_point) + 'px';
    }
    else if (axis === 'y') {
      document.getElementById(npo.id).style.marginTop = npo.top-(player1.y-ref_point) + 'px';
    }
    else {
      throw "input is not an axis ('x' or 'y')"
    }
  }
}



/* -------------------------------- ABILITIES ------------------------------ */

function moveHalo() {
  // CENTER HALO AROUND PLAYER
  let halo = document.getElementById('halo1');
  halo.style.marginLeft = player1.x - player1.x_offset - player1.halo_diameter/2 + player1.w/2 + 'px';
  halo.style.marginTop = player1.y - player1.y_offset - player1.halo_diameter/2 - player1.h/2 + 'px';
}

function readyHalo() {
  let halo = document.getElementById('halo1');
  halo.style.width = player1.halo_diameter + 'px';
  halo.style.height = player1.halo_diameter + 'px';
  halo.classList.remove('hidden');
}

function updatePulse() {
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

/* TODO: implement below, not yet called */
function animateSquish() {
  let squish_factor = .4*player1.h;
  $('#'+player1.id).animate({
    'height': player1.h-squish_factor+'px'
  }, 200).animate({
    'height': player1.h+'px'
  },400);
}

/* TODO: implement below, not yet called */
function animateStretch() {
  let stretch_factor = .4*player1.h;
  $('#'+player1.id).animate({
    'height': player1.h+stretch_factor+'px'
  }, 200).animate({
    'height': player1.h+'px'
  },400);
}




/* ------------------ FUNCTIONS FOR 'CLASSIC' MODE ---------------------- */
function checkPlayerFilter() {
  for (let glass of stainedglass) {
    if (player1.isInside(glass) && glass.isReady) {
      // If player1 is not already color shifted...
      if (player1.colorFilter !== glass) {
        let blend = avgColor(player1.color, glass.color);
        // Change player color
        document.getElementById('player1').style.backgroundColor = blend;
        player1.color = blend;
        // Change layer order so player is in front of filter
        document.getElementById('player1').style.zIndex = "2";
        document.getElementById(glass.id).style.zIndex = "1";
        // Set active filters
        player1.colorFilter = glass;
        console.log(blend)
      }
      // Else, revert to white (TODO: save last color before effects of this filter
      // OR calculate new color without current filter and set it)
      else {
        let last_color = '#ffffff';
        // Change player color back
        document.getElementById('player1').style.backgroundColor = last_color;
        player1.color = last_color;
        // Change layer order so player is in front of filter
        document.getElementById('player1').style.zIndex = "1";
        document.getElementById(glass.id).style.zIndex = "2";
        // Set active filters
        player1.colorFilter = undefined;
        console.log(last_color)
      }
      glass.isReady = false;
    }
    // Reset staineglass readiness to true if player moves out of region.
    if (player1.isOutside(glass) && !glass.isReady) {
      glass.isReady = true;
    }
  }
}

function rgbToHex(rgb) {
  // Return input if already in correct format.
  if (rgb.indexOf('#') > -1) {
    return rgb;
  }
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);

  if (r.length == 1) {r = "0" + r;}
  if (g.length == 1) {g = "0" + g;}
  if (b.length == 1) {b = "0" + b;}

  return "#" + r + g + b;
}

// Take arbitrary number of hex color strings and compute their average or 'combination'
function avgColor(hex1, hex2) {
  // Turn '#rgb' to ['r', 'g', 'b']
  let clr1 = hex1.substring(1,7).match(/.{2}/g),
      clr2 = hex2.substring(1,7).match(/.{2}/g);
  // Take averages
  let r = Math.round((parseInt(clr1[0],16) + parseInt(clr2[0],16))/2).toString(16),
      g = Math.round((parseInt(clr1[1],16) + parseInt(clr2[1],16))/2).toString(16),
      b = Math.round((parseInt(clr1[2],16) + parseInt(clr2[2],16))/2).toString(16);
  // Add padding if needed
  if (r.length == 1) {r = "0" + r;}
  if (g.length == 1) {g = "0" + g;}
  if (b.length == 1) {b = "0" + b;}

  return '#' + r + g + b;
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

/* */
