import NN from "./nn.js"

export default class Car extends Konva.Group{
    rays = [];
    indicators = []

    constructor( x, y, w=25, h=65, rays=8, fov=Math.PI/2 ){
        super({x, y, draggable:true})
        this.brain = new NN( 8, 16, 3 );
        this.crashed = false ;
        this.rayLength = 140
        this.score = 0 ;
        this.constructRays( rays, fov );
        this.constructBody( w, h )
    }

    constructBody( w, h ){
        this.shape = new Konva.Rect({ x:0, y:0, w, h, fill:"green" });
        this.add( this.shape );
    }

    constructRays( noOfRays, fov ){
        for( let angle = -fov/2; angle < fov/2; angle+= fov/noOfRays ){
            const x = this.rayLength * Math.cos(angle);
            const y = this.rayLength * Math.sin(angle);
            
            const ray = new Konva.Arrow({
                points : [ 0, 0, x, y ],
                strokeWidth : 1,
                stroke : "black"
            });
            this.rays.push(ray);
            this.add( ray );

            const indicator = new Konva.Circle({
                x : 0, y : 0,
                radius : 5, fill : "red",
            })
            ray.indicator = indicator
            this.add(indicator)
        }
    }

    castRays( points ){
        const X = [];
        this.rays.forEach( ray => {
            const x = this.x(),
                  y = this.y();

            const [a,b,px,py] = ray.points();

            const p1 = { x , y };
            const p2 = { x : x+px, y : y+py };

            let minDist = this.rayLength ;
            ray.indicator.hide()
            for( let i = 0; i < points.length; i+= 2){
                const q1 = { x: points[i  ], y:points[i+1]} ;
                const q2 = { x: points[i+2], y:points[i+3]} ;

                const intersect = lineLineIntersection( p1, p2, q1, q2 );
                if( intersect ){
                    ray.indicator.show()
                    const dx = intersect.x - x,
                          dy = intersect.y - y;
                    const dist = Math.sqrt( dx*dx + dy*dy );
                    
                    if( dist < minDist ){
                        minDist = dist;
                        ray.indicator.absolutePosition( intersect );
                    }
                }
            }
            X.push( minDist / this.rayLength );
        })

        return X;
    }

    thinkAndMove( speed, points ){
        const X = this.castRays( points );

        const [result, decision] = this.brain.predict(X)
        console.log(decision)
        return;
        switch( decision ){
            case 0: break;
            case 1:
                this.direction += Math.PI/9;
                break;
            case 2:
                this.direction += Math.PI/9;
                break;
        }

        this.x( speed * Math.cos(this.direction));
        this.y( speed * Math.sin(this.direction));
    }

    static sex( carA, carB ){
        const child = new Car( carA.x(), carb.y() ); 
        child.brain = NN.crossover( carA.brain, carB.brain )
        return child ;
    }
}

function lineLineIntersection(p1, p2, q1, q2) {
    const s1_x = p2.x - p1.x;
    const s1_y = p2.y - p1.y;
    const s2_x = q2.x - q1.x;
    const s2_y = q2.y - q1.y;
  
    const det = (-s2_x * s1_y + s1_x * s2_y);
  
    if (det === 0) {
      return false;
    }
  
    const s = (-s1_y * (p1.x - q1.x) + s1_x * (p1.y - q1.y)) / det;
    const t = ( s2_x * (p1.y - q1.y) - s2_y * (p1.x - q1.x)) / det;
  
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      const x = p1.x + (t * s1_x);
      const y = p1.y + (t * s1_y);
      return { x, y };
    }
  
    return null; 
  }