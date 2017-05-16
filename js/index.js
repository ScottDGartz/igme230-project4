var game = document.getElementById("menu");
var ctx = game.getContext("2d");

//class declarations
class Triangle {
    constructor(loc, size, fill, maxSpeed) {
        this.p1 = loc;
        this.p2 = new Vector(loc.x, loc.y + size);
        this.p3 = new Vector(this.p2.x + size, this.p2.y);
        this.velocity = new Vector(1, -1);
        this.size = size;
        this.fill = fill;
        this.maxSpeed = maxSpeed;
        this.center;
        this.calcCenter();
    }

    //Moves all points
    //Rotates the points after moving.
    update() {
        this.p1.add(this.velocity);
        this.p2.add(this.velocity);
        this.p3.add(this.velocity);
        this.p1 = rotatePoint(this.p1, 1, this.center);
        this.p2 = rotatePoint(this.p2, 1, this.center);
        this.p3 = rotatePoint(this.p3, 1, this.center);
        this.calcCenter();
    }

    //Calls all needed functions
    loop() {
        this.update();
        this.wallCollision();
        this.draw();
    }

    //Draws the triangle
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.lineTo(this.p3.x, this.p3.y);
        ctx.closePath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#666666"
        ctx.stroke;
        ctx.fillStyle = this.fill;
        ctx.fill();
    }

    //Checks if all points of a triangle are past the walls, and wraps
    wallCollision() {
        var p2change = new Vector(this.p1.x, this.p1.y);
        var p3change = new Vector(this.p1.x, this.p1.y);
        p2change.subtract(this.p2);
        p3change.subtract(this.p3);
        if (this.p1.x > game.width && this.p2.x > game.width && this.p3.x > game.width) {
            this.p1.x = 0;
            this.p2 = new Vector(this.p1.x, this.p1.y);
            this.p2.add(p2change);
            this.p3 = new Vector(this.p1.x, this.p1.y);
            this.p3.add(p3change);
        } else if (this.p1.x < 0 && this.p2.x < 0 && this.p3.x < 0) {
            this.p1.x = game.width;

            this.p2 = new Vector(this.p1.x, this.p1.y);
            this.p2.add(p2change);
            this.p3 = new Vector(this.p1.x, this.p1.y);
            this.p3.add(p3change);
        }
        if (this.p1.y > game.height && this.p2.y > game.height && this.p3.y > game.height) {
            this.p1.y = 0;

            this.p2 = new Vector(this.p1.x, this.p1.y);
            this.p2.add(p2change);
            this.p3 = new Vector(this.p1.x, this.p1.y);
            this.p3.add(p3change);
        } else if (this.p1.y < 0 && this.p2.y < 0 && this.p3.y < 0) {
            this.p1.y = game.height;

            this.p2 = new Vector(this.p1.x, this.p1.y);
            this.p2.add(p2change);
            this.p3 = new Vector(this.p1.x, this.p1.y);
            this.p3.add(p3change);
        }
    }

    //Calculates the center of the triangle
    calcCenter() {
        this.center = new Vector((this.p1.x + this.p2.x + this.p3.x) / 3, (this.p1.y + this.p2.y + this.p3.y) / 3);
    }

    //Useless function so no errors are thrown
    newTarget() {
        //This is literally so it doesn't throw an error...
    }
}
class Node {
    constructor(point) {
        this.loc = point;
        this.fill = "#99ffdd";
        this.stroke = "#275c8d";
        this.radius = 15;
    }

    //Draws the node
    draw() {
        ctx.beginPath();
        ctx.arc(this.loc.x, this.loc.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.stroke();
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



var objects = [];
var i;
var objCount = 200;


for (i = 0; i < objCount; i++) {

    objects.push(new Triangle(new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight), 10, "#ffffff", Math.random() * 4));

}
//Loops all functions and draws all nodes
function draw() {

  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, game.width, game.height);
    for (i = 0; i < objects.length; i++) {
        objects[i].loop();
    }
}

setInterval(draw, 10);

//Helped function for vector subtraction that returns a vector
function vectorSub(e, f) {
    return new Vector(f.x - e.x, f.y - e.y)
}

//Converts degrees to radians
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

//Function to rotate a point a certain angle, around the provided center point
function rotatePoint(point, angle, center) {
    var xprime = ((point.x - center.x) * Math.cos(toRadians(angle))) - ((point.y - center.y) * Math.sin(toRadians(angle)));
    var yprime = ((point.y - center.y) * Math.cos(toRadians(angle))) + ((point.x - center.x) * Math.sin(toRadians(angle)));
    return new Vector(xprime + center.x, yprime + center.y);
}
