var game = document.getElementById("game");
game.onmousemove = updateTarget;
game.onclick = nodeManage;
game.onmousedown = down;
game.onmouseup = up;
var ctx = game.getContext("2d");

//class declarations
class Circle {

    //Radius num, location vector, velocity vector and fill color
    constructor(radius, loc, fill, maxSpeed) {
        this.loc = loc;
        this.velo = new Vector(0, 0);
        this.radius = radius;
        this.fill = fill;
        //Sets the starting target to center of the canvas
        this.target = new Vector(game.width / 2, game.height / 2);
        this.acceleration;
        this.maxSpeed = maxSpeed;

        //Just to make sure the circle's colour isn't black or white
        while (this.fill == "#ffffff" || this.fill == "#000000") {
            this.fill = randomColor();
        }
    }

    //Calls all necessary functions in order
    loop() {
        this.update();
        this.wallCollision();
        this.draw();
    }

    //Calculates steering force to the target
    //And applies it
    update() {
        this.acceleration = vectorSub(this.loc, this.target);
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
    constructor(loc, w, h, fill, maxSpeed) {
        this.loc = loc;
        this.i = 0;
        this.velo = new Vector(0, 0);
        this.width = w;
        this.height = h;
        this.fill = fill;

        //Just makes sure the rectangles colour isn't black or white
        while (this.fill == "#ffffff" || this.fill == "#000000") {
            this.fill = randomColor();
        }

        //Target is set to middle of canvas to start
        this.target = new Vector(game.width / 2, game.height / 2);
        this.maxSpeed = maxSpeed;
    }

    //Calls all necessary functions in correct order
    loop() {
        this.update();
        this.wallCollision();
        if (nodes.length > 0) {
            this.checkNodes();
        }
        this.draw();
    }

    //Calculates the steering force on the rectangle
    //and applies it
    update() {
        this.accel = vectorSub(this.loc, this.target);
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

    //Checks for collision between this rectangle and the current node it is seeking. If there's a collision, it's target gets updated to the next node
    checkNodes() {
        if(this.i >= nodes.length){
            this.i = 0;
        }
        if (this.loc.x < nodes[this.i].loc.x + nodes[this.i].radius && this.loc.x > nodes[this.i].loc.x - nodes[this.i].radius &&
            this.loc.y < nodes[this.i].loc.y + nodes[this.i].radius &&
            this.loc.y > nodes[this.i].loc.y - nodes[this.i].radius) {
            this.i++;
            if (this.i < nodes.length) {
                this.target = nodes[this.i].loc;
            } else {
                this.i = 0;
                this.target = nodes[this.i].loc;
            }
        }
    }

    //Sets rectangle's target to a new spot
    newTarget(b) {
        if (nodes.length == 0) {
            this.target = b;
        } else {
            this.target = nodes[this.i].loc;
        }
    }
}

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
    click(event){
        var rect = game.getBoundingClientRect();
        var mouse =  new Vector(event.clientX - rect.left,event.clientY - rect.top);
        if(Math.sqrt((mouse.x - this.loc.x)*(mouse.x - this.loc.x) + (mouse.y - this.loc.y)*(mouse.y - this.loc.y)) < this.radius){
            nodes.splice(nodes.indexOf(this),1);
            removed = true;
        }
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
var nodes = [];
var d;
var objCount = 0;
var mouseD = null;
var starCount = 100;
var removed = false;
//Creates specified number of "stars"
for (d = 0; d < starCount; d++) {
    objects.push(new Triangle(new Vector(Math.random() * 1000, Math.random() * 1000), 10, "#ffffff", Math.random() * 4));
}
//Creates specified number of objects at start
for (d = 0; d < objCount; d++) {
    create();
}

//Loops all functions and draws all nodes
function draw() {
    ctx.clearRect(0, 0, game.width, game.height);

    for (i = 0; i < objects.length; i++) {
        objects[i].loop();
    }
    for (i = 0; i < nodes.length; i++) {
        nodes[i].draw();
    }
    ctx.beginPath();
    ctx.font = "30px Serif";
    ctx.fillText("Objects: " + (objects.length - 100),10,30);
    ctx.fillText("Nodes: "+ nodes.length,10,65);
    ctx.closePath();
}


function randomColor() {

    //I found this function after I tried to figure out how to do it myself.
    //Source is https://www.paulirish.com/2009/random-hex-color-code-snippets/
    //This will also be included in a notes page
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
setInterval(draw, 10);

//Called whenever the mouse moves to change the target for shapes
function updateTarget(event) {
    var rect = game.getBoundingClientRect();
    var point = new Vector(event.clientX - rect.left, event.clientY - rect.top);

    var j;
    for (j = 0; j < objects.length; j++) {
        objects[j].newTarget(point);
    }
}

//Helped function for vector subtraction that returns a vector
function vectorSub(e, f) {
    return new Vector(f.x - e.x, f.y - e.y)
}

//Called when mouse clicks, creates a node
function createNode(event) {
    var rect = game.getBoundingClientRect();
    var point = new Vector(event.clientX - rect.left, event.clientY - rect.top)
    nodes.push(new Node(point));
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

//Called on mousedown, creates an interval to spawn new objects
function down() {
    if (mouseD === null) {
        mouseD = setInterval(create, 100);
    }
}

//Gets rid of the interval created by down(), so that it doesn't spawn infinitely
function up() {
    if (mouseD != null) {
        clearInterval(mouseD);
        mouseD = null;
    }
}

//Creates a rectangle or circle based on the current number d
function create() {
    d++;
    removed = true;
    if (d % 2 == 0) {
        objects.push(new Circle(10, new Vector(Math.random() * 1000, Math.random() * 1000), randomColor(), Math.random() * 3));
    } else {
        objects.push(new Rectangle(new Vector(Math.random() * 1000, Math.random() * 1000), 20, 20, randomColor(), Math.random() * 3));
    }
}

function nodeManage(event){
    var m;
    for(m = 0; m < nodes.length; m++){
        nodes[m].click(event);
    }
    if(removed == true){
        removed = false;
    }
    else{
        createNode(event);
    }
}
