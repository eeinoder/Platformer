/* script for title card */

// TODO: implement random color palette on start up

/* -------------- HANDLERS ------------- */
// TODO: wait for complete fade in (EVERYTIME) before giving player controls
// NOTE: this function is like a patch to levelgenerator in order to make the player
// and platform stay fixed relative the title card rather than the window itself..
// This is kind of ugly and inefficient but it works.
function setupTitle() {
  // Initial params: disable side-scrolling.
  current_mode = 'classic';
  load_level = 0;
  enableFade();
  showTitle();
  startGame();
  disableSidescrolling();
  alignPlayer();
  fadeIn(1000);  // Enqueue fade-in request. Fade in after 1s of 'request' being dequeued.
}

function startFromTitle() {
  // TODO: Define verticalPlayerCorrection in physics.js - if applied, within first frame,
  // if player has not hit ground, set y to ground top so theres no falling at start of level.
  // Enqueue fade-out request. Fade out after 0.5s of 'request' being dequeued.
  fadeOut(500);
  // Change platform color to let player square clip through and fall down.
  platforms[1].color = '#2eb2ff'; //blue
  // Start game from level 1
  setTimeout(function(){
    hideTitle();
    // Reset parameters like side scrolling boundaries, start new game...
    enableSidescrolling();
    load_level = 1;
    is_game_start = false; // updateFrame() automatically ends game, starts new.
    // TODO: Just remove black out 'filter' for now. Later add different cards before
    // proper game start like 'Loading' or 'New/load game'...
    document.getElementById('fade').classList.add('hidden');
  }, 3000);
}


/* -------------- HELPERS ------------- */

function hideTitle() {
  document.getElementsByClassName('title_screen')[0].classList.add('hidden');
  document.getElementsByClassName('game')[0].classList.remove('hidden');
}

// NOTE: This should only get called if quitting game to go to title screen.
function showTitle() {
  if (!is_game_start) {
    document.getElementsByClassName('game')[0].classList.add('hidden');
    document.getElementsByClassName('title_screen')[0].classList.remove('hidden');
  }
}

// Align player and platform1 with title card.
function alignPlayer() {
  let platform1_dom = document.getElementById('platform1');
  // Make plaform hidden. NOTE: Ground is outside window dimensions so cannot be seen.
  platform1_dom.classList.add('hidden');
  // First left margin...
  let title_style = window.getComputedStyle(document.getElementsByClassName('title_screen')[0]);
  let title_left = parseFloat(title_style.getPropertyValue('margin-left'));
  let title_width = parseFloat(title_style.getPropertyValue('width'));
  let player_left =  title_left + title_width - player1.w - 0.1 * title_width;
  player1.x = player_left; // DOM object updated from this in updateFrame().
  platforms[1].left = player_left;
  platforms[1].right = player_left+platforms[1].w;
  platform1_dom.style.marginLeft = player_left + 'px';
  // ...Then top margin.
  let title_top = parseFloat(title_style.getPropertyValue('margin-top'));
  let player_top = title_top + title_width - 0.1 * title_width;
  player1.y = player_top + player1.h;
  platforms[1].top = player_top;
  platform1_dom.style.marginTop = player_top + 'px';
}
