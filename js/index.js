var game = document.getElementById("menu");
var ctx = game.getContext("2d");
window.onresize = loopLoc;
window.onclick = checkClick;

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

class Button {
    constructor(buttonNum, text) {
        this.buttonNum = buttonNum;
        this.path = path(buttonNum);
        this.updateLoc();
        this.text = text;
        this.fill = "rgba(211,211,211,.8)";
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(this.loc.x + 10, this.loc.y);
        ctx.lineTo(this.loc2.x - 10, this.loc.y);
        ctx.arc(this.loc2.x - 10, this.loc.y + 10, 10, 1.5 * Math.PI, 0);
        ctx.lineTo(this.loc2.x, this.loc2.y - 10);
        ctx.arc(this.loc2.x - 10, this.loc2.y - 10, 10, 0, Math.PI * .5);
        ctx.lineTo(this.loc.x + 10, this.loc2.y);
        ctx.arc(this.loc.x + 10, this.loc2.y - 10, 10, Math.PI * .5, Math.PI);
        ctx.lineTo(this.loc.x, this.loc.y + 10);
        ctx.arc(this.loc.x + 10, this.loc.y + 10, 10, Math.PI, Math.PI * 1.5);
        ctx.strokeStyle = "rgb(211,211,211)";
        ctx.stroke();
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.font = font;
        ctx.fillStyle = "#000000";
        ctx.fillText(this.text, this.loc.x + (this.loc2.x - this.loc.x) / 4, this.loc.y + (this.loc2.y - this.loc.y) / 1.5);
        ctx.closePath();
    }
    updateLoc() {
        var vects = newLoc(this.buttonNum);
        this.loc = vects[0];
        this.loc2 = vects[1];
    }
    click(mouse){
        if(mouse.x < this.loc2.x && mouse.x > this.loc.x && mouse.y < this.loc2.y && mouse.y > this.loc.y){
            window.location.assign(this.path);
        }
    }

}

var objects = [];
var i;
var objCount = 200;
var buttons = [];
var fontString = "px Serif";
var fontNum;
var font;
updateFont();
var currentWidth = window.innerWidth;
buttons.push(new Button(1, "Illust. 1"));
buttons.push(new Button(2, "Illust. 2"));
buttons.push(new Button(3, "Illust. 3"));
buttons.push(new Button(4,"Documentation"))

for (i = 0; i < objCount; i++) {

    objects.push(new Triangle(new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight), 10, "#ffffff", Math.random() * 4));

}
//Loops all functions and draws all nodes
function draw() {

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, game.width, game.height);
    for (i = 0; i < objects.length; i++) {
        objects[i].loop();
    }
    for (i = 0; i < buttons.length; i++) {
        buttons[i].draw();
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

function newLoc(num) {
    var height = window.innerHeight;
    var width = window.innerWidth;
    var vects = [];
    switch (num) {
        case 1:
            vects.push(new Vector(width - (width * .75), height - height * .8));
            vects.push(new Vector(width - (width * .25), height - height * .65));
            return vects;
            break;
        case 2:
            vects.push(new Vector(width - (width * .75), height - height * .6));
            vects.push(new Vector(width - (width * .25), height - height * .45));
            return vects;
            break;
        case 3:
            vects.push(new Vector(width - (width * .75), height - height * .4));
            vects.push(new Vector(width - (width * .25), height - height * .25));
            return vects;
            break;
        case 4:
            vects.push(new Vector(width - (width * .75), height- height * .2));
            vects.push(new Vector(width - (width * .25), height - height*.05));
            return vects;
        default:
            break;
    }

}

function loopLoc() {
    var i;
    updateFont();
    for (i = 0; i < buttons.length; i++) {
        buttons[i].updateLoc();
    }
}
function updateFont(){
    fontNum = .05 * window.innerHeight;
    font = fontNum.toString() + fontString;
}
function checkClick(event){
    var rect = game.getBoundingClientRect();

    var mouseX = event.clientX;
    var mouseY = event.clientY;

    for(i = 0; i<buttons.length; i++){
        buttons[i].click(new Vector(mouseX - rect.left,mouseY - rect.top));
    }
}
function path(buttonNum){
    if(buttonNum != 4){
        return "illustration_"+buttonNum.toString()+".html";
    }
    else{
        return "documentation.html";
    }
}
