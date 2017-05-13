var game = document.getElementById("game");
var ctx = game.getContext("2d");
class Circle{
    constructor(radius,x,y){
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}

var dx = 2; //Delta x, or change in x position
var dy = -2;
var ball = new Circle(10,240,160);
function draw() {
    ball.draw();
}
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function wallCollision(){
    if(y + dy < radius || y + dy > game.height - radius)
    {
        dy = -dy;
    }
    if(x + dx < radius || x + dx > game.width - radius)
    {
        dx = -dx;
    }
}
setInterval(draw, 10);
