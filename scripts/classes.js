/* classes.js */
// TODO: change .top, etc. to .init_top, etc.

/* PLAYER CLASS */
class Player {
  constructor(id) {
    this.id = id;
    // Useful properties (in unit px)
    this.w = parseFloat(window.getComputedStyle(document.getElementById(id)).width);
    this.h = parseFloat(window.getComputedStyle(document.getElementById(id)).height);
    this.x_init = parseFloat(window.getComputedStyle(document.getElementById(id)).marginLeft);
    this.y_init = parseFloat(window.getComputedStyle(document.getElementById(id)).marginTop)+this.h;
    this.x_offset = 0; // total scroll distance after player goes to left or right edge
    this.y_offset = 0; // same as x_offset in y direction
    this.is_space_down = false;
    this.is_grounded = true;
    this.is_on_wall = false;
    this.has_wall_jumped = false;
    this.zones = new Set();
    this.floor; // platform directly beneath
    // Kinematics
    this.x = this.x_init;
    this.y = this.y_init;
    this.x_speed = 0;
    this.y_speed = 0;
    this.x_accel_right = 0; // NOTE: this is accel w/o friction, due only to right movement input
    this.x_accel_left = 0;  // same but for left movement input
    this.y_accel = 0;
    // Pulse values
    this.pulse_color = '#bbb';
    this.pulse_diameter = 0;
    this.pulse_speed = 20; // in px
    this.pulse_width = 300; // in px
    this.using_pulse = false;
  }
  // Helpers
  left() {return this.x + 'px';} // get left margin from current x val
  top() {return this.y - this.h + 'px';} // get top margin from current y val
  //canJump() {return ((player1.y > player1.floor.top - jump_err) && player1.y <= player1.floor.top) || (player1.is_on_wall && !player1.has_wall_jumped);}
  canJump() {return player1.is_grounded || (player1.is_on_wall && !player1.has_wall_jumped);}
}


/* PLATFORM CLASS */
class Platform {
  constructor(id) {
    this.id = id;
    this.w = parseFloat(document.getElementById(id).style.width);
    this.h = parseFloat(document.getElementById(id).style.height);
    this.left = parseFloat(document.getElementById(id).style.leftMargin); // NOTE: these are all inital values
    this.right = this.left + this.w
    this.top = parseFloat(document.getElementById(id).style.topMargin);
    this.bottom = this.top + this.h;
  }
  getTop() {return parseFloat(document.getElementById(this.id).style.topMargin);}
}
