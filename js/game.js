'use strict';

var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');

// Ball object
function Ball(){
  this.radius = 25;

  /******************************************************************
  *                 BALL RESET
  *         resets position and velocity
  ******************************************************************/
  this.reset = function(){
    this.x = (canvas.width / 2) + (this.radius);
    this.y = (canvas.height / 2) + (this.radius);

    // ranX is a random number between 4 and 8
    var ranX = Math.random() * (5 - 8) + 5;
    // we then create another random number and
    // use it to determine if this number should be negative.
    this.velX = Math.random() > 0.5 ? ranX : -ranX;

    // same thing we did to ranX
    var ranY = Math.random() * (1 - 3) + 1;
    this.velY = Math.random() > 0.5 ? ranY : -ranY;
  };

  /******************************************************************
  *            BALL UPDATE METHOD
  *     updates coordinates and velocity
  *     as well as bounds checking / paddle checking
  *
  *     takes arguments paddle1 and paddle2 
  *     for bounds checking
  ******************************************************************/
  this.update = function(paddle1, paddle2){
    
    // Left/Right Boundry detection
    if(this.x + this.velX + this.radius >= canvas.width){
      // give a  point to player 1 and reset the ball.
      paddle1.score++;
      this.reset();
    } else if(this.x + this.velX - this.radius <= 0){
      paddle2.score++;
      this.reset();
    } else {
      this.x += this.velX;
    }
    // UP/DOWN Boundry Detection
    if(this.y + this.velY + this.radius >= canvas.height){
      this.y = canvas.height - this.radius;
      this.velY = -this.velY;
    } else if(this.y + this.velY - this.radius <= 0){
      this.y = this.radius;
      this.velY = -this.velY;
    } else {
      this.y += this.velY;
    }

    // Left Paddle detection
    if(this.x - this.radius <= paddle1.x + paddle1.width && this.y > paddle1.y && this.y < paddle1.y + paddle1.height){
      console.log('COLLISION');
      this.x = paddle1.x + paddle1.width + this.radius;
      this.velX = -this.velX;
      this.velY = this.velY + paddle1.velY * 0.6;
    }
    // Right Paddle detection
    if(this.x + this.radius >= paddle2.x && this.y > paddle2.y && this.y < paddle2.y + paddle2.height){
      console.log('COLLISION');
      this.x = paddle2.x - this.radius;
      this.velX = -this.velX;
      this.velY = this.velY + paddle1.velY * 0.6;
    }
  };
  
  /******************************************************************
  *            BALL DRAW METHOD
  ******************************************************************/
  this.draw = function(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
  };

  // since this is the first run through
  // go ahead and setup a ball using the reset method
  this.reset();
}

// Paddle object
function Paddle(side){
  // Initialize variables with arguments if used or defaults.
  if(typeof side === 'undefined'){
    return 'FAIL! - MUST use side argument (\'left\') or (\'right\')';
  }
  // paddles must have a side!('left' or 'right')
  this.side = side;

  this.width = 25;
  this.height = 100;

  this.score = 0;

  // Paddles only move up and down
  this.velY = 0;
  this.speed = 4;
  this.maxVelocity = 12;

  if(side === 'left'){
    // Set up the left side paddle
    this.x = 0;
    this.color = '#ff0000';
  } else {
    // Set up the right side paddle.
    this.x = canvas.width - this.width;
    this.color = '#0000ff';
  }

  /******************************************************************
  *                     PADDLE UPDATE METHOD
  ******************************************************************/
  this.update = function(){
    //console.log('Updating ' + this.side + ' velY: ' + this.velY);
    console.log(this.velY);

    // Check for screen boundries
    if(this.y + this.velY <= 0){
      this.y = 0;
    } else if (this.y + this.velY + this.height >= canvas.height){
      this.y = canvas.height - this.height;
    } else {
      this.y += this.velY;
    }
  };
  
  /******************************************************************
  *                       PADDLE DRAW METHOD
  ******************************************************************/
  this.draw = function(){
    var offset = 10;
    ctx.fillStyle = this.color;
    if(side === 'left'){
      ctx.fillRect(this.x + offset, this.y, this.width, this.height);
    } else {
      ctx.fillRect(canvas.width-this.width-offset, this.y, this.width, this.height);
    }
  };
  /******************************************************************
  *                       PADDLE RESET METHOD
  ******************************************************************/
  this.reset = function(){
    // Put the paddle right in the middle of the y-axis
    this.y = (canvas.height / 2) - (this.height / 2);
  };

  this.reset();
}

// Create our game object
function Game(){
  // Make sure we can get a context from the canvas object passed in
  if(!canvas.getContext){
    console.log('Error. Unable to get Canvas - Exiting.');
    // TODO better error checking/reporting here? 
  } else {
    // Good to go!
    console.log('Loading game.....');

    // Init variables 
    var running = true;
    var paused = false;
    var fps = 60;

    // Create the player paddles
    var paddle1 = new Paddle('left');
    this.paddle1 = function(){
      return paddle1;
    };
    var paddle2 = new Paddle('right');
    this.paddle2 = function(){
      return paddle2;
    };
    
    // herp derp?
    var ball = new Ball();

    /******************************************************************
    *                     GAME UPDATE METHOD
    ******************************************************************/
    var update = function(){
      paddle1.update();
      paddle2.update();
      ball.update(paddle1, paddle2);
    };

    /******************************************************************
    *                     GAME DRAW METHOD
    ******************************************************************/
    var draw = function(){
      // clear the screen
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw any background stuff

      // Draw player paddles
      paddle1.draw();
      paddle2.draw();
      ball.draw();

      // Draw any HUD items here
      ctx.font='18px Georgia';
      ctx.fillStyle='green';
      ctx.fillText('Player1: ' + paddle1.score ,10,30); 
      
      ctx.fillText('Player2: ' + paddle2.score , canvas.width -  100,30); 

    };


    /////////////////////////
    // PUBLIC METHODS
    /////////////////////////
    
    // return the fps setting
    // Notice the parens + the outer()
    // that says hey.. launch run this immediatlely
    // that seems to be the key to handing this 
    // internal variable to the outside world via
    // a "public interface" blah blah bblah
    this.fps = (function(){
      return fps;
    })();
   

    // the main game loop.
    this.run = function(){
      //console.log('In Run ' + running);
      if(running){
        update();
        draw();
      }
    };

  /*********************************************************
  *                KEYBOARD EVENT HANDLERS
  ********************************************************/
  this.onKeyDownEvent = function(event){
    var chCode = ('which' in event) ? event.which : event.keyCode;
    switch(chCode){
      case 87:
        console.log('w pressed');
        if (Math.abs(paddle1.velY) < paddle1.maxVelocity){
          paddle1.velY -= paddle1.speed;
        }
        break;
      case 83:
        console.log('s pressed');
        if (Math.abs(paddle1.velY) < paddle1.maxVelocity){
          paddle1.velY += paddle1.speed;
        }
        break;
      case 38:
        console.log('Up arrow pressed');
        if (Math.abs(paddle2.velY) < paddle2.maxVelocity){
          paddle2.velY -= paddle2.speed;
        }
        break;
      case 40:
        console.log('Down arrow pressed');
        if (Math.abs(paddle2.velY) < paddle2.maxVelocity){
          paddle2.velY += paddle2.speed;
        }
        break;
      case 32:
        console.log('Space pressed');
      default:
        console.log('Unhandled Key: ' + chCode);
    }
  }
  this.onKeyUpEvent = function(event){
    var chCode = ('which' in event) ? event.which : event.keyCode;
    switch(chCode){
      case 87:
        console.log('w released');
        paddle1.velY = 0; 
        break;
      case 83:
        console.log('s released');
        paddle1.velY = 0; 
        break;
      case 38:
        console.log('Up arrow released');
        paddle2.velY = 0; 
        break;
      case 40:
        console.log('Down arrow released');
        paddle2.velY = 0; 
        break;
      case 32:
        console.log('Space released');
        break;
      default:
        console.log('Unhandled Key: ' + chCode);
    }
  }
  }
}


// respond to window size changes
function resizeCanvas(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

// Event listener for window resize
window.addEventListener('resize', function(){
  resizeCanvas();
}, false);

// Go ahead and do an initial canvas resize.
resizeCanvas();

//  Create a new game 
var game = new Game();
document.querySelector('body').onkeyup = game.onKeyUpEvent;
document.querySelector('body').onkeydown = game.onKeyDownEvent;

if(typeof game.fps === 'undefined'){
  console.log('giDid not get a proper game object');
} else {
  game._intervalId = setInterval(game.run, 1000 / game.fps);
}

