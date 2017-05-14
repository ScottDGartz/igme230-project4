var game = document.getElementById("game");
game.onclick = updateTarget;
var ctx = game.getContext("2d");

//class declarations
class Circle {
    constructor(radius, loc, velocity, fill) {
        this.loc = loc;
        this.velo = velocity;
        this.radius = radius;
        this.fill = fill;
        this.targetX;
        this.targetY;

    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.loc.x, this.loc.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
        this.wallCollision();
        this.loc.add(this.velo);
    }
    wallCollision() {
        if (this.loc.y < this.radius || this.loc.y > game.height - this.radius) {
            this.velo.y = -this.velo.y;
        }
        if (this.loc.x < this.radius || this.loc.x > game.width - this.radius) {
            this.velo.x = -this.velo.x;
        }
    }
    newTarget(vector) {
        this.loc.x = vector.x;
        this.loc.y = vector.y;

    }

}

class Rectangle {
    constructor(loc, velocity, w, h, fill) {
        this.loc = loc;
        this.velo = velocity;
        this.width = w;
        this.height = h;
        this.fill = fill;
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.loc.x, this.loc.y, this.width, this.height);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
        this.wallCollision();
        this.loc.add(this.velo);
    }
    wallCollision() {
        if (this.loc.x < 0 || this.loc.x + this.width > game.width) {
            this.velo.x = -this.velo.x;
        }
        if (this.loc.y < 0 || this.loc.y + this.height > game.height) {
            this.velo.y = -this.velo.y;
        }
    }
    newTarget(b) {

    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.calcMag();
    }
    subtract(b){
        this.x = this.x - b.x;
        this.y = this.y - b.y;
        this.calcMag();
    }
    add(b){
        this.x = this.x + b.x;
        this.y = this.y + b.y;
        this.calcMag();
    }
    scaleUp(n){
        this.x = this.x * n;
        this.y = this.y * n;
        this.calcMag();
    }
    scaleDown(n){
        this.x = this.x * n;
        this.y = this.y * n;
        this.calcMag();
    }
    calcMag(){
        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize(){
        this.scaleDown(this.magnitude);
    }
}
var dx = 2; //Delta x, or change in x position
var dy = -2;
var ball = new Circle(10, new Vector(240, 160), new Vector(2,2), "#D22356");
var rect = new Rectangle(new Vector(0,0),new Vector(2,3),20,20,"#3AC3D6")
function draw() {
    ctx.clearRect(0, 0, game.width, game.height);
    ball.draw();
    rect.draw();
}

setInterval(draw, 10);

function updateTarget(event) {
    var rect = game.getBoundingClientRect();
    var point = new Vector(event.clientX - rect.left, event.clientY - rect.top);
    ball.newTarget(point);
}
