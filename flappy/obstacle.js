import { map } from "./utils.js";

export default class Obstacle{
	constructor( x, height, w=118, range=250, gap=80) {
		this.x = x;
		this.w = w;
		this.y = Math.random()*range + (height- range)/2;
		this.gap = gap;

		this.img = new Image();
		this.img.src = "imgs/pipes.png";

		this.passed = false;
		this.offScreen = false;
		this.alpha = 1;
	}
	show( ctx ) {
		ctx.globalAlpha = this.alpha ;
		ctx.drawImage(this.img, this.x - this.w / 2, this.y + this.gap);
		ctx.save();
		ctx.translate(this.x + this.w, this.y - this.gap);
		ctx.rotate(Math.PI);
		ctx.drawImage(this.img, 0, 0);
		ctx.restore();
		ctx.globalAlpha = 1 ;
	};
	
	move(m) {
		this.x += m;
		this.offScreen = this.x + this.w < 0
	};
}
