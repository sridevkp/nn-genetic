import Car from "./car.js";

export default class CarPool extends Konva.Group{
    cars = [];

    constructor( n, track, x, y, direction ){
        super({ x: 0, y:0})

        this.startX = x;
        this.startY = y;
        this.direction = direction;
        this.best ;
        this.track = track

        for( let i = 0; i < n; i++){
            const car = new Car( x, y, direction );
            this.cars.push( car );
            this.add( car )
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
        this.cars.forEach( car => sum += car.score );
        this.cars.forEach( car => car.fitness = car.score / sum );
    }

    nextGeneration(){
        const newGeneration = []
        const wildCardCount = this.cars.length / 5 ;
        for( let i = 0; i < this.cars.length-wildCardCount; i++ ){
            const child = Car.sex( this.pickOne(), this.pickOne() );
            newGeneration.push(child);
            this.add( child );
        }
        for( let i = 0; i < wildCardCount; i++ ){
            const wCar = new Car( this.startX, this.startY );
            newGeneration.push(wCar);
            this.add( wCar );
        }
        this.cars.forEach( car => car.remove() );
        this.cars = newGeneration ;
    }
}

