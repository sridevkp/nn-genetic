import Car from "./car.js";
import Vec2 from "./utils.js";

export default class CarPool extends Konva.Group{
    cars = [];

    constructor( n, track, x, y, direction ){
        super({ x: 0, y:0})

        this.start = new Vec2( x, y );
        this.direction = direction;
        this.best ;
        this.bestScore;
        this.track = track;


        for( let i = 0; i < n; i++){
            const car = new Car( x, y, direction );
            this.cars.push( car );
            this.add( car )
        }
        this.generation = 0 ;
        this.running = n ;
    }

    debug( debug ){
        this.cars.forEach( car => car.debug(debug) )
    }

    thinkAndMove( speed ){
        this.running = 0 ;
        this.cars.forEach( car => {
            if( car.crashed ) return car.hide() ;
            car.thinkAndMove( speed, [this.track.rightLine.points(), this.track.leftLine.points()] );
            this.running ++
        })
    }

    calculateFitness(){
        let sum = 0;
        this.cars.forEach(car => {
            sum += car.score;
            if (!this.best || car.score > this.best.score) this.best = car;
        });
        this.cars.forEach(car => car.fitness = car.score / sum);
        this.bestScore = this.best.score;
    }

    pickOne() {
        let r = Math.random();
        let index = 0;
        while (r > 0) {
          r -= this.cars[index].fitness;
          index++;
        }
        index--;
        return this.cars[index];
    }

    nextGeneration(){
        const newGeneration = []
        const wildCardCount = this.cars.length / 10 ;
        for( let i = 0; i < this.cars.length-wildCardCount; i++ ){
            const child = Car.crossover( this.pickOne(), this.pickOne() );
            // i > 10 && child.visible(false)
            child.mutate( 0.01 );
            child.reset( this.start.x, this.start.y, this.direction );
            newGeneration.push(child);
            this.add( child );
        }
        for( let i = 0; i < wildCardCount-1; i++ ){
            const wCar = new Car( this.start.x, this.start.y, this.direction );
            // wCar.visible(false)
            newGeneration.push(wCar);
            this.add( wCar );
        }

        newGeneration.push( this.best )
        this.best.reset( this.start.x, this.start.y, this.direction  )
        this.best.mutate( 0.01 );

        this.cars.forEach( car => car != this.best && car.destroy() );
        this.cars = newGeneration ;
        this.running = newGeneration.length
        this.generation++;
    }
}

