/* transitions.js */

/* ZOOM OBJECTS ABOUT CENTER OF SCREEN */
// TODO: FIX IF POSSIBLE!!! I gather that floating point weirdness causes growing deviations from
// expected size and distance from center with repeated iterations of zooming in/out.
// Suppose 'scale' paramter = 1.25. We scale all object dimensions up by param 'scale'.
// If an object's center,  is right of window center, to zoom in we move this object more right
// by increasing distance from center, dfc = marginLeftCenter - 0.5*window.outerWidth, by 1.25.
// So new marginLeft = marginLeft + (scale - 1) * dfc =
function zoom(scale) { // marginLeft - center
  let game_objects = non_players.concat(player1);
  for (let game_object of game_objects) {
    let obj = document.getElementById(game_object.id);
    let obj_style = window.getComputedStyle(obj);
    let offset = Math.round(100*(scale-1))/100; //
    //console.log(offset)
    let dfc_left = parseFloat(obj_style.getPropertyValue('margin-left'))
                 + parseFloat(obj_style.getPropertyValue('width'))/2 - window.innerWidth/2;
    let dfc_top =  parseFloat(obj_style.getPropertyValue('margin-top'))
                 + parseFloat(obj_style.getPropertyValue('height'))/2 - window.innerHeight/2;
    obj.style.width = scale * parseFloat(obj_style.getPropertyValue('width')) + 'px';
    obj.style.height = scale * parseFloat(obj_style.getPropertyValue('height')) + 'px';
    obj.style.marginLeft = offset * dfc_left + parseFloat(obj_style.getPropertyValue('margin-left')) + 'px';
    obj.style.marginTop = offset * dfc_top + parseFloat(obj_style.getPropertyValue('margin-top')) + 'px';
  }
}

/*  */
function enableFade() {
  document.getElementById('fade').style.opacity = '1.0';
  document.getElementById('fade').classList.remove('hidden');
}

function disableFade() {
  document.getElementById('fade').classList.add('hidden');
  // TODO: add checks in functions so they can only be called if fade is enabled.
}

/* FADE IN/OUT HELPERS. "FADING" BY CHANGING 'FADE' OPACITY HANDLED IN updateFrame() IN physics.js. */
// NOTE: more elegant might be to use await/promise...
function requestFade(buffer) {
  if (buffer === null || buffer === undefined) {
    buffer = 0; // NOTE: based on buffer definition this makes default fade a fade-IN w/ 0 ms buffer.
  }
  // Enqueue if fade_queue is empty or if last is opposite sign, i.e. fade_in follows _out and v.v.
  // TODO: to protect from doing two fade-ins/-outs in a row only allow enqueue of fade-in if
  // 'fade' DOM object opacity >= 1, and likewise of fade-out only if opacity <= 0.
  if (fade_queue.isEmpty() || fade_queue.last() * buffer < 0) {
    fade_queue.enqueue(buffer);
  }
}

// Dequeue next fade request, store to global 'buffer', set fading_ to true, set current tick/time to start_time.
function readyNextFade() {
  let buffer = fade_queue.dequeue();
  fade_start_time = tick + Math.abs(buffer);
  //document.getElementById('fade').classList.remove('hidden');
  if (buffer >= 0) {fading_in = true;}
  else {fading_out = true;}
}

// Wrappers for requestFade()
function fadeIn(buffer) {
  if (buffer < 0) {throw 'Paramater must be non-negative.'}
  requestFade(buffer);
}
function fadeOut(buffer) {
  if (buffer < 0) {throw 'Paramater must be non-negative.'}
  requestFade(-1*buffer);
}

// From next fade buffer, updateFrame() calls this every frame.
// TODO: (BUG) when fade is requested after starting new game, time to execute may
// record using last game's clock instead of desired new game clock's 0 point. FIX THIS.
function fadeHandler() {
  if (fading_in) { // Process current fade-in
    var new_opacity =  1 - (tick-fade_start_time)/fade_duration;
    if (tick > fade_start_time && tick-fade_start_time <= fade_duration) {
      document.getElementById('fade').style.opacity = new_opacity + '';
    }
    if (new_opacity <= 0) {
      fading_in = false;
    }
  }
  else if (fading_out) { // Process current fade-out
    if (tick > fade_start_time && tick-fade_start_time <= fade_duration) {
      var new_opacity = (tick-fade_start_time)/fade_duration;
      document.getElementById('fade').style.opacity = new_opacity + '';
    }
    if (new_opacity >= 1) {
      fading_out = false;
    }
  }
  else if (!fade_queue.isEmpty()) {
    //console.log('Start time: ' + fade_start_time)
    readyNextFade();
  }
}
