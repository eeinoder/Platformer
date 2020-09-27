/* classes.js */
// Logic:
// After DOM objects for player and platforms are defined, creating instance of object below
// will have identical starting paramters defined in levelgenerator.js and/or leveldata.txt
// Then, all calculations are done using Js objects and then the DOM/game objects are updated
// and things happen on screen.

/* ---------------------------- GAME OBJECTS----------------------------- */

/* PLAYER CLASS */
class Player {
  // TODO: create HTML player object with script, then remove '.getComputedStyle' below
  constructor(id) {
    this.id = id;
    // Useful properties (in unit px)
    this.w = parseFloat(document.getElementById(id).style.width);
    this.h = parseFloat(document.getElementById(id).style.height);
    this.x_init = parseFloat(document.getElementById(id).style.marginLeft);
    this.y_init = parseFloat(document.getElementById(id).style.marginTop)+this.h;
    this.x_offset = 0; // total scroll distance after player goes to left or right edge
    this.y_offset = 0; // same as x_offset in y direction
    this.is_space_down = false;
    this.is_grounded = true;
    this.is_on_wall = false;
    this.on_left_wall = false; // TODO: replace these with wall objects that are in collision... like w/ platforms
    this.on_right_wall = false;
    this.has_wall_jumped = false;
    this.zones = new Set();
    this.floor; // platform directly beneath
    this.color = rgbToHex(document.getElementById(id).style.backgroundColor);
    this.colorFilter = []; // stainedglass that changed the player color (TODO: make this array of filters)
    // Kinematics
    this.x = this.x_init;
    this.y = this.y_init;
    this.x_speed = 0;
    this.y_speed = 0;
    this.x_accel_right = 0; // NOTE: this is accel w/o friction, due only to right movement input
    this.x_accel_left = 0;  // same but for left movement input
    this.y_accel = 0;
    // Pulse values
    this.pulse_color_init = '#bbb';
    this.pulse_color = '#bbb';
    this.pulse_diameter = 0;
    this.pulse_speed = 20 * x_scale; // in px
    this.pulse_width = 300 * x_scale; // in px
    this.using_pulse = false;
    this.unlocked_pulse = false;
    // Halo values
    this.halo_diameter = 7 * this.w; // default halo diameter is 5 times player width
    this.using_torch = false;
  }
  // Helpers
  left() {return this.x + 'px';} // get left margin from current x val
  top() {return this.y - this.h + 'px';} // get top margin from current y val
  //canJump() {return ((player1.y > player1.floor.top - jump_err) && player1.y <= player1.floor.top) || (player1.is_on_wall && !player1.has_wall_jumped);}
  canJump() {return this.is_grounded || (this.is_on_wall && !this.has_wall_jumped);}
  isInside(obj) {return this.x >= obj.left && this.x+this.w <= obj.right && this.y <= obj.bottom && this.y-this.h >= obj.top;}
  isLeftOf(obj) {return this.x + this.w < obj.left;}
  isRightOf(obj) {return this.x > obj.right;}
  isAbove(obj) {return this.y < obj.top;}
  isBelow(obj) {return this.y - this.h > obj.bottom;}
  isOutside(obj) {return this.isLeftOf(obj) || this.isRightOf(obj) || this.isAbove(obj) || this.isBelow(obj);}
  //isInside(obj) {return !this.isOutside(obj);}
}


/* PLATFORM CLASS */
class Platform {
  constructor(id) {
    this.id = id; // id will be like 'PlatformN' where N is an integer >= 1
    this.w = parseFloat(document.getElementById(id).style.width);
    this.h = parseFloat(document.getElementById(id).style.height);
    this.left = parseFloat(document.getElementById(id).style.marginLeft); // NOTE: these are all inital values
    this.right = this.left + this.w
    this.top = parseFloat(document.getElementById(id).style.marginTop);
    this.bottom = this.top + this.h;
    this.color = rgbToHex(document.getElementById(id).style.backgroundColor);
  }
}


/* STAINED GLASS CLASS */
class Stainedglass extends Platform {
  constructor(id) {
    super(id);
    this.isReady = true; // True if player has left stainedglass region, Then player can interact again
  }
}


/* COLLECTIBLE / "DOTS" CLASS */
class Collectible {
  constructor(id) {
    // 
  }
}


/* ---------------------------- DATASTRUCTURES----------------------------- */

class Queue {
  constructor() {
    this.elements = [];
  }
  enqueue(element) {
    this.elements.push(element);
  }
  dequeue() {
    return this.elements.shift();
  }
  peek() {
    return !this.isEmpty() ? this.elements[0] : undefined;
  }
  last() {
    return !this.isEmpty() ? this.elements[this.elements.length-1] : undefined;
  }
  length() {
    return this.elements.length;
  }
  isEmpty() {
    return this.elements.length === 0;
  }
}
