import Car from "./car.js";
import Vec2 from "./utils.js";

export default class CarPool extends Konva.Group{
    cars = [];

    constructor( n, track, x, y, direction ){
        super({ x: 0, y:0})

        this.start = new Vec2( x, y );
        this.direction = direction;
        this.best ;
        this.track = track

        for( let i = 0; i < n; i++){
            const car = new Car( x, y, direction );
            this.cars.push( car );
            this.add( car )
            // car.debug( true );
        }
        this.generation = 0 ;
        this.running = n ;
    }

    thinkAndMove( speed ){
        this.running = 0 ;
        this.cars.forEach( car => {
            if( car.crashed ) return;
            car.thinkAndMove( speed, [this.track.rightLine.points(), this.track.leftLine.points()] );
            this.running ++
        })
    }

    calculateFitness(){
        let sum = 0 ;
        this.cars.forEach( car => {
            sum += car.score
            if( !this.best || car.score > this.best.score ) this.best = car ;
        } );
        this.cars.forEach( car => car.fitness = car.score / sum );
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
        const wildCardCount = this.cars.length / 5 ;
        for( let i = 0; i < this.cars.length-wildCardCount; i++ ){
            const child = Car.crossover( this.pickOne(), this.pickOne() );
            child.mutate( 0.02 )
            child.x( this.start.x );
            child.y( this.start.y );
            newGeneration.push(child);
            this.add( child );
        }
        for( let i = 0; i < wildCardCount; i++ ){
            const wCar = new Car( this.start.x, this.start.y, this.direction );
            newGeneration.push(wCar);
            this.add( wCar );
        }
        this.cars.forEach( car => car.destroy() );
        this.cars = newGeneration ;
        this.running = newGeneration.length
        this.generation++;
    }
}

