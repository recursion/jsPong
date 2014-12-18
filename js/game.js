'use strict';

var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');

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

  // Paddles only move up and down
  this.velY = 0;
  this.speed = 4;
  this.maxVelocity = 12;

  // Put the paddle right in the middle of the y-axis
  this.y = (canvas.height / 2) - (this.height / 2);

  if(side === 'left'){
    // Set up the left side paddle
    this.x = 0;
    this.color = '#ff0000';
  } else {
    // Set up the right side paddle.
    this.x = canvas.width - this.width;
    this.color = '#0000ff';
  }

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

  this.draw = function(){
    ctx.fillStyle = this.color;
    if(side === 'left'){
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.fillRect(canvas.width-this.width, this.y, this.width, this.height);
    }
  };
}

// Create our game object
function Game(){
  // Make sure we can get a context from the canvas object passed in
  if(!canvas.getContext){
    console.log('Error. Unable to get Canvas - Exiting.');
    // TODO something like this?   =>  throw new Error('giNo canvas given.');
    // or should it we create an empty object since we have to return something?
    // like so => this = {};
  } else {

    console.log('Starting game!');

    // Init variables since we have a canvas
    var running = true;
    var paused = false;
    var fps = 60;
    
    var player1 = new Paddle('left');
    this.player1 = function(){
      return player1;
    };
    var player2 = new Paddle('right');
    this.player2 = function(){
      return player2;
    };

    var update = function(){
      player1.update();
      player2.update();
    };
    var draw = function(){
      //console.log('giDrawing');

      // clear the screen
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw any background stuff

      // Draw player paddles
      player1.draw();
      player2.draw();

      // Draw any HUD items here
  
    };
    
    /////////////////////////
    // PUBLIC METHODS
    /////////////////////////
    
    // return the fps setting
    this.fps = (function(){
      return fps;
    })();
   

    // the main game loop.
    // this is really the only public method (for now)
    this.run = function(){
      //console.log('In Run ' + running);
      if(running){
        update();
        draw();
      }
    };

   /*********************************************************
   *
   *                KEYBOARD EVENT HANDLERS
   *
   * The following two functions handle onkeydown and onkeyup events
   * we grab the keycode and respond to it if needed.
   * keycodes are unicode 
   ********************************************************/
  // For smoother input it makes sense to capture keydown and keyup events
  // and set movement accordingly.
  this.onKeyDownEvent = function(event){
    var chCode = ('which' in event) ? event.which : event.keyCode;
    switch(chCode){
      case 87:
        console.log('w pressed');
        if (Math.abs(player1.velY) < player1.maxVelocity){
          player1.velY -= player1.speed;
        }
        break;
      case 83:
        console.log('s pressed');
        if (Math.abs(player1.velY) < player1.maxVelocity){
          player1.velY += player1.speed;
        }
        break;
      case 38:
        console.log('Up arrow pressed');
        if (Math.abs(player2.velY) < player2.maxVelocity){
          player2.velY -= player2.speed;
        }
        break;
      case 40:
        console.log('Down arrow pressed');
        if (Math.abs(player2.velY) < player2.maxVelocity){
          player2.velY += player2.speed;
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
        player1.velY = 0; 
        break;

      case 83:
        console.log('s released');
        player1.velY = 0; 
        break;
      
      case 38:
        console.log('Up arrow released');
        player2.velY = 0; 
        break;

      case 40:
        console.log('Down arrow released');
        player2.velY = 0; 
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

