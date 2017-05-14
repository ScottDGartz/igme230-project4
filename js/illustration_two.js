var game = document.getElementById("game");
game.onmousemove = updateTarget;
var ctx = game.getContext("2d");

//class declarations
class Circle {
    //Radius num, location vector, velocity vector and fill color
    constructor(radius, loc, velocity, fill) {
        this.loc = loc;
        this.velo = velocity;
        this.radius = radius;
        this.fill = fill;
        //Sets the starting target to center of the canvas
        this.target = new Vector(game.width / 2, game.height / 2);
        this.acceleration;
        this.maxSpeed = 5;
    }
    //Calls all necessary functions in order
    loop() {
        this.update();
        this.wallCollision();
        this.draw();
    }
    update() {
        //Calculates steering force to the target
        //And applies it
        this.acceleration = vectorSub(this.loc,this.target);
        this.acceleration.normalize();
        this.acceleration.scaleUp(.1);
        this.velo.add(this.acceleration);
        this.velo.limit(this.maxSpeed);
        this.loc.add(this.velo);
    }
    //Draws the circle at it's location
    draw() {
        ctx.beginPath();
        ctx.arc(this.loc.x, this.loc.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
    }
    //Checks if the circle has hit a wall, if so, it bounces off
    wallCollision() {
        if (this.loc.y < this.radius || this.loc.y > game.height - this.radius) {
            this.velo.y = -this.velo.y;
        }
        if (this.loc.x < this.radius || this.loc.x > game.width - this.radius) {
            this.velo.x = -this.velo.x;
        }
    }
    //Sets the circle's target to a new point
    newTarget(vector) {
        this.target = vector;
    }

}

class Rectangle {
    //Takes a location vector, velocity vector,
    //width, height, and a fill color
    constructor(loc, velocity, w, h, fill) {
        this.loc = loc;
        this.velo = velocity;
        this.width = w;
        this.height = h;
        this.fill = fill;
        //Target is set to middle of canvas to start
        this.target = new Vector(game.width/2, game.height/2);
        this.maxSpeed = 5;
    }
    //Calls all necessary functions in correct order
    loop() {
        this.update();
        this.wallCollision();
        this.draw();
    }

    //Calculates the steering force on the rectangle
    //and applies it
    update() {
        this.accel = vectorSub(this.loc,this.target);
        this.accel.normalize();
        this.accel.scaleUp(.1);
        this.velo.add(this.accel);
        this.velo.limit(this.maxSpeed);
        this.loc.add(this.velo);
    }

    //Draws rectangle at the right location
    draw() {
        ctx.beginPath();
        ctx.rect(this.loc.x, this.loc.y, this.width, this.height);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();

    }

    //Checks if the rectangle has hit a wall, if so, wraps to the other side
    wallCollision() {

        if (this.loc.x > game.width) {
            this.loc.x = 0;
        } else if (this.loc.x < 0) {
            this.loc.x = game.width;
        }

        if (this.loc.y > game.height) {
            this.loc.y = 0;
        } else if (this.loc.y < 0) {
            this.loc.y = game.height;
        }
    }

    //Sets rectangle's target to a new spot
    newTarget(b) {
        this.target = b;
    }
}

class Node{
    constructor(point,color){
        this.loc = point;
        this.fill = color;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.loc.x, this.loc.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
    }
}
//Class to represent x and y coordinates
//Can be a point, a direction vector, velocity, acceleration, anything really.
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.calcMag();
    }

    //A bunch of helper functions for vector math
    subtract(b) {
        this.x = this.x - b.x;
        this.y = this.y - b.y;
        this.calcMag();
    }

    add(b) {
        this.x = this.x + b.x;
        this.y = this.y + b.y;
        this.calcMag();
    }

    scaleUp(n) {
        this.x = this.x * n;
        this.y = this.y * n;
        this.calcMag();
    }

    scaleDown(n) {
        this.x = this.x / n;
        this.y = this.y / n;
        this.calcMag();
    }

    calcMag() {
        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        if (this.magnitude != 0) {
            this.scaleDown(this.magnitude);
        }
    }

    limit(max) {
        if (this.magnitude > max) {
            this.normalize();
            this.scaleUp(max);
        }
    }

}
var dx = 2; //Delta x, or change in x position
var dy = -2;
var ball = new Circle(10, new Vector(240, 160), new Vector(2, 2), "#D22356");
var box = new Rectangle(new Vector(0, 0), new Vector(2, 3), 20, 20, "#3AC3D6")

function draw() {
    ctx.clearRect(0, 0, game.width, game.height);
    ball.loop();
    box.loop();
}

setInterval(draw, 10);

function updateTarget(event) {
    var rect = game.getBoundingClientRect();
    var point = new Vector(event.clientX - rect.left, event.clientY - rect.top);
    ball.newTarget(point);
    box.newTarget(point);
}

function vectorSub(e, f) {
    return new Vector(f.x - e.x, f.y - e.y)
}
