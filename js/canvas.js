var game = document.getElementById("game");
var ctx = game.getContext("2d");

//class declarations
class Circle{
    constructor(radius,x,y,dx,dy,fill){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.fill = fill;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
        this.wallCollision();
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }
    wallCollision(){
    if(this.y + this.dy < this.radius || this.y + this.dy > game.height - this.radius)
    {
        this.dy = -this.dy;
    }
    if(this.x + this.dx < this.radius || this.x + this.dx > game.width - this.radius)
    {
        this.dx = -this.dx;
    }
}
}

class Rectangle{
    constructor(x,y,w,h,fill){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.fill = fill;
    }
    draw(){
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.closePath();
    }
    wallCollision(){

    }
}

var dx = 2; //Delta x, or change in x position
var dy = -2;
var ball = new Circle(10,240,160,2,2,"#002321");
var rect = new Rectangle(20,20,30,30,"#00000E")
function draw() {
    ctx.clearRect(0,0,game.width,game.height);
    ball.draw();
    rect.draw();
}
setInterval(draw, 10);
