var game = document.getElementById("game");
game.onclick = updateTarget;
var ctx = game.getContext("2d");

//class declarations
class Circle {
    constructor(radius, x, y, dx, dy, fill) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.fill = fill;
        this.targetX;
        this.targetY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
        this.wallCollision();
//        this.x = this.x + this.dx;
//        this.y = this.y + this.dy;
    }
    wallCollision() {
        if (this.y + this.dy < this.radius || this.y + this.dy > game.height - this.radius) {
            this.dy = -this.dy;
        }
        if (this.x + this.dx < this.radius || this.x + this.dx > game.width - this.radius) {
            this.dx = -this.dx;
        }
    }
    newTarget(x,y){
        this.x = x;
        this.y = y;

    }
}

class Rectangle {
    constructor(x, y, w, h, fill, dx, dy) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.fill = fill;
        this.dx = dx;
        this.dy = dy;
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
        this.wallCollision();
        this.x += this.dx;
        this.y += this.dy;
    }
    wallCollision() {
        if (this.x < 0 || this.x + this.width > game.width) {
            this.dx = -this.dx;
        }
        if (this.y < 0 || this.y + this.height > game.height) {
            this.dy = -this.dy;
        }
    }
    newTarget(x,y){

    }
}

var dx = 2; //Delta x, or change in x position
var dy = -2;
var ball = new Circle(10, 240, 160, 2, 2, "#002321");
var rect = new Rectangle(20, 20, 30, 30, "#00000E", 2, 2)

function draw() {
    ctx.clearRect(0, 0, game.width, game.height);
    ball.draw();
    rect.draw();
}
setInterval(draw, 10);
function updateTarget(event){
    var rect = game.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    ball.newTarget(x,y);
    rect.newTarget(x,y);
}
