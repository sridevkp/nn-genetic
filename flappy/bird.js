import NeuralNet from "./nn.js";

export default class Bird {
  constructor( x, y ) {
    this.x = x,
    this.y = y,
    this.velo = 0,
    this.radius = 15,
    this.alive = true;

    this.img = new Image();
    this.img.src = "imgs/flappy.png";

    this.rot = 0;
    this.score = 0;
    this.fitness = 0;
    this.brain = new NeuralNet(5, 6, 2);
  }

  show( ctx ) {
    const w = this.radius + 10;
    ctx.save();
    ctx.globalAlpha = .6;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.drawImage(this.img, -w, -w, w * 2, w * 1.5);
    ctx.restore();
  }

  update( g, height ) {
    this.velo = Math.min(this.velo, 10);
    this.y += this.velo;
    this.velo += g;

    if (this.y + this.radius > height || this.y - this.radius < 0) return this.alive = false;
    this.rot = ((this.velo * 2) / 180) * Math.PI;
    this.score++;
  }

  fly(amt = -8) {
    this.velo = amt;
  }

  collide(wall) {
    var y1 = wall.y - wall.gap;
    var y2 = wall.y + wall.gap;
    var x1 = wall.x - wall.w / 2;
    var x2 = wall.x + wall.w / 2;
    
    return (
      this.x + this.radius > x1 &&
      this.x - this.radius < x2 &&
      (this.y + this.radius > y2 || this.y - this.radius < y1)
    );
  }

  think( nearest, WIDTH, HEIGHT ) {
    var input = new Array(5);
    input[0] = this.y / HEIGHT;
    input[1] = this.velo / 10;
    input[2] = Math.abs(this.x - nearest.x) / WIDTH;
    input[3] = (nearest.y + nearest.gap - this.y) / HEIGHT;
    input[4] = (nearest.y - nearest.gap - this.y) / HEIGHT;

    const choice = this.brain.predict(input);
    if (choice[0] < choice[1]) {
      this.fly();
    }
  }
}
