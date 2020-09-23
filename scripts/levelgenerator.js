/* level generator.js */

// Take values from text file OR randomly generate values
// Experiment with level design AND procedurally generated world

var vw = window.innerWidth;
var vh = window.innerHeight;

/*
  Parameters:
    level_data: dictionary of game objects and their attributes:
      width, w
      height, h
      top margin, top
      left margin, left
      color, clr
*/

// NOTE: ORDER IN WHICH DOM OBJECT CREATED MATTERS!!!
// LAYERS ARE AS FOLLOWS:
// Add platforms first before 'halo1', iter. ground, platform1, plat...
// Then add players before 'ground', iter. from player1-...
// Then add stainedglass before 'ground', ...

var level_data = [
  // LEVEL 0 - "DEMO/TUTORIAL"
  [{'id':'ground','w':2.5, 'h':.5, 'top':.895, 'left':-.8, 'clr':'#555555'},
  {'id':'platform1','w':.12, 'h':.02, 'top':.80, 'left':.10, 'clr':'#555555'},
  {'id':'platform2','w':.12, 'h':.02, 'top':.60, 'left':.30, 'clr':'#555555'},
  {'id':'platform3','w':.12, 'h':.02, 'top':.40, 'left':.50, 'clr':'#555555'},
  {'id':'platform4','w':.12, 'h':.02, 'top':.20, 'left':.70, 'clr':'#555555'},
  {'id':'platform5','w':.25, 'h':.02, 'top':.60, 'left':.60, 'clr':'#ffffff'},
  {'id':'platform6','w':.20, 'h':.02, 'top':.20, 'left':.15, 'clr':'#555555'},
  {'id':'platform7','w':.10, 'h':.02, 'top':.40, 'left':.22, 'clr':'#555555'},
  {'id':'platform8','w':.15, 'h':.02, 'top':.15, 'left':.75, 'clr':'#555555'},
  {'id':'platform9','w':.12, 'h':.02, 'top':.80, 'left':.10, 'clr':'#555555'},
  {'id':'player1','w':.05, 'h':.05, 'top':.50, 'left':.50, 'clr':'#ffffff'},
  {'id':'stainedglass1','w':.30, 'h':.20, 'top':.695, 'left':1.10, 'clr':'#ff3300'},
  {'id':'stainedglass2','w':.30, 'h':.20, 'top':.695, 'left':-0.35, 'clr':'#0033ff'}],
  // LEVEL 1
  [{'id':'ground','w':2.5, 'h':.5, 'top':.895, 'left':-.8, 'clr':'#555555'},
  {'id':'platform1','w':.12, 'h':.02, 'top':.80, 'left':.10, 'clr':'#555555'},
  {'id':'platform6','w':.20, 'h':.02, 'top':.20, 'left':.15, 'clr':'#555555'},
  {'id':'platform7','w':.10, 'h':.02, 'top':.40, 'left':.22, 'clr':'#555555'},
  {'id':'player1','w':.05, 'h':.05, 'top':.50, 'left':.50, 'clr':'#ffffff'}],
  // LEVEL 2
  []
];


function generateLevel(level) {
  let platforms = [];
  let players = [];
  let stainedglass = [];
  for (var i=0; i<level_data[level].length; i++) {
    // Create DOM object
    let id = level_data[level][i]['id'];
    createDOMObject(level_data[level][i]);
    // From DOM element, create instance of Player class
    if (id.includes('platform') || id === 'ground') {
      platforms.push(new Platform(id));
    }
    else if (id.includes('player')) {
      players.push(new Player(id));
    }
    else if (id.includes('stainedglass')) {
      stainedglass.push(new Stainedglass(id));
    }
  }
  return [platforms, players, stainedglass];
}


function createDOMObject(obj_vals) {
  var h_scale = vh;
  var new_obj = document.createElement('div');
  var class_name = obj_vals['id'].replace(/[0-9]/g, '');
  if (class_name === 'player') {
    h_scale = vw;
  }
  if (class_name === 'ground') {
    class_name = 'platform';
  }
  // GIVE OBJECT DEFINED ATTRIBUTES
  new_obj.id = obj_vals['id'];
  new_obj.classList.add(class_name);
  new_obj.style.backgroundColor = obj_vals['clr'];
  new_obj.style.width = obj_vals['w'] * vw + 'px';
  new_obj.style.height = obj_vals['h'] * h_scale + 'px';
  new_obj.style.marginTop = obj_vals['top'] * vh + 'px';
  new_obj.style.marginLeft = obj_vals['left'] * vw + 'px';
  // INSERT OBJECT IN APPROPRIATE LOCATION (BEFORE NAMED OBJECT)
  if (class_name === 'platform') {
    let halo = document.getElementById('halo1');
    halo.parentNode.insertBefore(new_obj, halo);
  }
  else if (class_name === 'player' || class_name === 'stainedglass') {
    let ground = document.getElementById('ground');
    ground.parentNode.insertBefore(new_obj, ground);
  }
}


function deloadLevel() {
  // Delete every game object from DOM
  for (let game_obj of game_objects) {
    document.getElementById(game_obj.id).remove();
  }
}


// INSERT NEW PLATFORM OBJECT IN DOM AFTER GROUND OBJECT
function insertAfter(prev_plat, new_plat) {
  prev_plat.parentNode.insertBefore(new_plat, prev_plat.nextSibling);
}
