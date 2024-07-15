import Bird from "./bird.js";
import Matrix from "./matrix.js";
import NeuralNet from "./nn.js";

export default class Population {
  constructor( n, x, y ) {
    this.generation = 0;
    this.count = n;
    this.alive = 0;
    this.birds = [];
    this.x = x;
    this.y = y;
    this.bestBird;
    this.bestScore = 0;
	
    for (var i = 0; i < n; i++) {
    	this.birds.push( new Bird( x, y ) );
    }
  }

  show( ctx ) {
    this.birds.forEach( bird => {
      if ( bird.alive ) bird.show( ctx );
    })
  }

  aliveCount(){
    this.alive = 0;
    this.birds.forEach( bird => this.alive += bird.alive );
    return this.alive ;
  }

  update( nearest, g, height ) {
    this.birds.forEach( bird => {
      if ( bird.alive ){
        bird.update( g, height);
        if( bird.collide( nearest ) ) bird.alive = false
      }
    })
  }

  think( nearest, WIDTH, HEIGHT ) {
    this.birds.forEach( bird => {
      if ( bird.alive) bird.think( nearest, WIDTH, HEIGHT );
    })
  }

  calcFitness() {
    var sum = 0;
    for (var i = 0; i < this.birds.length; i++) {
      sum += this.birds[i].score;
      if (this.birds[i].score > this.bestScore) {
        this.bestBird = this.birds[i];
        this.bestScore = this.birds[i].score;
      }
    }
    for (var i = 0; i < this.birds.length; i++) {
      this.birds[i].fitness = this.birds[i].score / sum;
    }
  }

  newGen() {
    var nxtGen = [];
    const newCount = 20

    for (var i = 0; i < this.count-newCount; i++) {
      var parentA = this.pickOne();
      var parentB = this.pickOne();
      var child = new Bird( this.x, this.y );
      child.brain = NeuralNet.crossover(parentA.brain, parentB.brain);
      child.brain.mutate(0.05);
      nxtGen.push(child);
    }
    for (var i = 0; i < newCount; i++) {
      nxtGen.push( new Bird( this.x, this.y ) );
    }
    this.birds = nxtGen;
    this.birds.push(this.bestBird);
    this.generation++;
  }

  pickOne() {
    var r = Math.random();
    var index = 0;
    while (r > 0) {
      r -= this.birds[index].fitness;
      index++;
    }
    index--;
    return this.birds[index];
  }
}
