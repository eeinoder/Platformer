/* menu animation script */
let last_clicked = '';


/* ------------------------------ EVENT HANDLERS --------------------------- */

function mouseOver(e) {
  // If this button is not selected
  if (selected_mode !== e.target.id) {
    if (e.target.style.fontWeight !== 'bold') {
      e.target.style.color = 'red';
    }
  }
}

function mouseOut(e) {
  // If this button is not selected
  e.target.style.color = 'black';
}

function click(e) {
  if (e.target.classList.contains('mode')) {
    last_clicked = e.target.id;
    e.target.style.color = 'black';
    document.getElementById('start_button').classList.remove('hidden');
    // Set selected fontWeight to bold. Set others to normal fontWeight.
    e.target.style.fontWeight = 'bold';
    for (var mode of game_modes) {
      if (mode !== last_clicked) {
        document.getElementById(mode).style.fontWeight = 'normal';
      }
    }

  }
  else if (e.target.id === 'start_button') {
    // Update seledted_mode.
    selected_mode = last_clicked;
    // Start game if valid game mode selected
    if (game_modes.includes(selected_mode)) {
      is_game_start = false;
      startGame();
    }
    else {
      alert("Select a game mode.");
    }
  }
}

function press(e) {
  if (e.code === 'KeyP' || e.code === 'Escape') {
    if (!is_game_pause) {
      pause();
    }
    else {
      unpause();
    }
  }
}


/* ----------------------------------- HELPERS ----------------------------- */

function pause() {
  is_game_pause = true;
  showMenu();
}

function unpause() {
  is_game_pause = false;
  hideMenu();
  updatePosition(frame_time);
}

function showMenu() {
  // SHOW PAUSE MENU, ADD GRAY FILTER TO GAME
  document.getElementsByClassName('title')[0].classList.remove('hidden');
  document.getElementsByClassName('game')[0].style.filter = "grayscale(100%) brightness(80%)";
}

function hideMenu() {
  // HIDE PAUSE MENU
  document.getElementsByClassName('title')[0].classList.add('hidden');
  document.getElementsByClassName('game')[0].style.filter = "none";
  // REVERT SOME PAUSE VISUAL SETTINGS
  if (last_clicked !== selected_mode) {
    document.getElementById(selected_mode).style.fontWeight = 'bold';
    document.getElementById(last_clicked).style.fontWeight = 'normal';
  }
}
