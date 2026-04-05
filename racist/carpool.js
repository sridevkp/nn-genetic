import Car from "./car.js";
import Vec2 from "./utils.js";

export default class CarPool extends Konva.Group{
    cars = [];
    eliteSize = 5;
    generationStats = [];
    stagnationCount = 0;
    mutationRate = 0.1;

    constructor( n, track, x, y, direction ){
        super({ x: 0, y:0})

        this.start = new Vec2( x, y );
        this.direction = direction;
        this.best = null;
        this.bestScore = 0;
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

    thinkAndMove( speed, time ){
        this.running = 0 ;
        this.cars.forEach( (car, idx) => {
            if( car.crashed ) return car.hide() ;
            // idx > 5 ? car.hide() : car.show();
            car.thinkAndMove( speed, [this.track.rightLine.points(), this.track.leftLine.points()], time );
            this.running ++
        })
    }

    calculateFitness(){
        let sum = 0;
        this.cars.forEach(car => {
            sum += car.score;
            if (!this.best || car.score > this.best.score) this.best = car;
        });
        if (sum === 0) {
            const uniformFitness = 1 / this.cars.length;
            this.cars.forEach(car => car.fitness = uniformFitness);
        } else {
            this.cars.forEach(car => car.fitness = car.score / sum);
        }
        this.bestScore = this.best.score;
    }

    pickOne() {
        let r = Math.random();
        let index = 0;
                while (r > 0 && index < this.cars.length) {
          r -= this.cars[index].fitness;
          index++;
        }
                index = Math.max(0, index - 1);
        return this.cars[index];
    }

    nextGeneration(mutationRate = 0.05) {
        this.cars.sort((a, b) => b.score - a.score);
        
        const newGeneration = [];
        const eliteCount = Math.max(2, Math.floor(this.cars.length * 0.1)); // top 10% elite
        const wildCardCount = Math.floor(this.cars.length * 0.1); // 10% wild cards 
        
        // Elite
        for(let i = 0; i < eliteCount; i++) {
            const eliteCar = this.cars[i];
            eliteCar.reset(this.start.x, this.start.y, this.direction);
            eliteCar.mutate(mutationRate); 
            newGeneration.push(eliteCar);
        }
        
        // Sex
        for(let i = 0; i < this.cars.length - eliteCount - wildCardCount; i++) {
            const child = Car.crossover(this.pickOne(), this.pickOne());
            child.mutate(mutationRate);
            child.reset(this.start.x, this.start.y, this.direction);
            newGeneration.push(child);
            this.add(child);
        }
        
        // Wildcard 
        for(let i = 0; i < wildCardCount; i++) {
            const wCar = new Car(this.start.x, this.start.y, this.direction);
            wCar.mutate(mutationRate);
            newGeneration.push(wCar);
            this.add(wCar);
        }

        if (!this.best || this.cars[0].score > this.best.score) {
            this.best = this.cars[0];
            this.bestScore = this.best.score;
        }
        
        this.cars.forEach((car, index) => {
            if (index >= eliteCount) car.destroy();
        });
        
        this.cars = newGeneration;
        this.running = newGeneration.length;
        this.generation++;
    }
}

