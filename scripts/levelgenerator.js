/* level generator.js */

// Take values from text file OR randomly generate values

/*
  Parameters:

    number of platforms
    platform widths
    platform heights (?)
    platform margins

    colors (same as number of platforms?)

  Create platform divs
  Create platform objects
  Update 'platforms' array and 'active_platforms' set
*/


// Level 1 (Test example)
var vw = window.innerWidth;
var vh = window.innerHeight;
var ids = ['platform1', 'platform2', 'platform3', 'platform4', 'platform5',
           'platform6', 'platform7', 'platform8', 'platform9'];
var platform_data = {
'platform1':{'w':.12, 'h':.02, 'top':.80, 'left':.10},
'platform2':{'w':.12, 'h':.02, 'top':.60, 'left':.30},
'platform3':{'w':.12, 'h':.02, 'top':.40, 'left':.50},
'platform4':{'w':.12, 'h':.02, 'top':.20, 'left':.70},
'platform5':{'w':.25, 'h':.02, 'top':.60, 'left':.60},
'platform6':{'w':.20, 'h':.02, 'top':.20, 'left':.15},
'platform7':{'w':.10, 'h':.02, 'top':.40, 'left':.22},
'platform8':{'w':.15, 'h':.02, 'top':.15, 'left':.75},
'platform9':{'w':.12, 'h':.02, 'top':.80, 'left':.10}};





// SET GROUND CHARACTERISTICS, MAKE Platform() object
var ground_plat = document.getElementById('ground');
ground_plat.style.width = 2.5 * vw + 'px';
ground_plat.style.height = .5 * vh + 'px';
ground_plat.style.topMargin = .895 * vh + 'px';
ground_plat.style.leftMargin =  -.8 * vw + 'px';


// CREATE NEW HTML PLATFORM OBJECTS, INSERT AFTER GROUND, AND CREATE
// CORRESPONDING Platform() OBJECTS.
function generatePlatforms() {
  let ground = new Platform('ground');
  var platforms = [ground]; // add global platform 'ground', first
  for (var i=0; i<ids.length; i++) {
    // Div object that comes before new div
    var prev_plat = document.getElementById(platforms[platforms.length-1].id);
    // New platform div
    var new_plat = document.createElement('div');
    new_plat.id = ids[i];
    new_plat.classList.add('platform');
    new_plat.style.backgroundColor = init_color;
    new_plat.style.width = platform_data[ids[i]]['w'] * vw + 'px';
    new_plat.style.height = platform_data[ids[i]]['h'] * vh + 'px';
    new_plat.style.topMargin = platform_data[ids[i]]['top'] * vh + 'px';
    new_plat.style.leftMargin = platform_data[ids[i]]['left'] * vw + 'px';
    insertAfter(prev_plat, new_plat);
    // New Platform() object
    let new_platform = new Platform(ids[i]);
    platforms.push(new_platform);
  }
  return platforms;
}


// INSERT NEW PLATFORM OBJECT IN DOM AFTER GROUND OBJECT
function insertAfter(prev_plat, new_plat) {
  prev_plat.parentNode.insertBefore(new_plat, prev_plat.nextSibling);
}
