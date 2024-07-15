import Obstacle from "./obstacle.js";
import Population from "./population.js";

const speed = document.getElementById("speed");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

var WIDTH, HEIGHT;
// HEIGHT = 720 ;

const g = 0.7;

var obstacles ;
var population ;

var bgImage ;
var frameCount = 0;
var time = 0;
var nearest, dist;

function setWindow(){
	WIDTH = canvas.width = window.innerWidth;
	HEIGHT = canvas.height = window.innerHeight;
} 
window.addEventListener('resize', setWindow )

function drawBg( image, x ){
	ctx.drawImage( image, x, 0, WIDTH, HEIGHT);
	ctx.drawImage( image, x + WIDTH, 0, WIDTH, HEIGHT);

	ctx.fillStyle = ctx.strokeStyle = "black";
	ctx.font = "20px Sans-serif";
}

function debug(){
	const gap = WIDTH /3
	ctx.textAlign="left"
	ctx.fillText( `Time : ${ (time/1000).toFixed(3) }`, 10, 30);
	ctx.fillText( `Generation : ${ population.generation }`, gap*1, 30);
	ctx.fillText( `Alive : ${ population.alive }`, gap*2, 30);
	ctx.textAlign="right"
	ctx.fillText( `Best : ${ population.bestScore }`, WIDTH-10, 30);
}

function updateObstacles(){
	let nearest ;
	dist = 10000;
	
	for (let i = obstacles.length - 1; i >= 0; i--) {
		obstacles[i].move(-5);
		
		if ( !obstacles[i].passed && obstacles[i].x + obstacles[i].w/2 < population.x) obstacles[i].passed = true; 
		
		if (!obstacles[i].passed && Math.abs(population.x - obstacles[i].x) < dist) {
			dist = Math.abs(population.x - obstacles[i].x);
			nearest = obstacles[i];
		}
		if ( obstacles[i].offScreen ) obstacles.splice(i, 1);
		
	}
	return nearest ;
}

function setup() {
	setWindow()

	obstacles = [];
	population = new Population( 100, WIDTH /3, HEIGHT /2 );

	bgImage = new Image();
	bgImage.src = "imgs/bg2.png"
}
// const fps = 10;
// const fpsInterval = 1000/fps

function loop(current) {
	requestAnimationFrame(loop);

	// const elapsed = current - time
	// if( elapsed < fpsInterval ) return ;  
	time = current;
	
	ctx.clearRect(0, 0, WIDTH, HEIGHT);

	let bg_x = ((frameCount * 2) % WIDTH) * -1;
	drawBg( bgImage, bg_x )
 

	for (let i = 0; i < speed.value; i++) {
		frameCount++;
		if (frameCount % 80 == 0) {
			obstacles.push( new Obstacle(WIDTH+200, HEIGHT, 80 ) );
		}
		nearest = updateObstacles();
		
		if ( !nearest ) {
			nearest = { x: WIDTH, y: HEIGHT/2, gap: 100 };
		}

		population.update( nearest, g, HEIGHT );
		population.think( nearest, WIDTH, HEIGHT );

		const alive = population.aliveCount()
		if( ! alive ){
			population.calcFitness();
			population.newGen();
			
			frameCount = 0;
			obstacles = [];
		}
	}

	obstacles.forEach( obstacle => obstacle.show(ctx) );
	population.show( ctx );
	
	debug();
}


setup();
loop();
