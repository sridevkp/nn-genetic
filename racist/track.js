import Node from "./node.js";

export default class Track extends Konva.Group{
    nodes = [];
    lines = [];

    constructor( trackWidth ){
        super({})
        this.trackWidth = trackWidth ;

        this.rightLine = new Konva.Line({ strokeWidth:2, stroke:"gray"});
        this.leftLine = new Konva.Line({ strokeWidth:2, stroke:"gray"});

        this.add( this.rightLine );
        this.add( this.leftLine );
    }

    ready(){
        return this.nodes.length > 2;
    }

    addNode( node ){
        this.nodes.push( node );
        node.on("click", e => { if(e.evt.button==2) this.remove(node); })
    }  

    addNodeAtIndex( i, node ){
        this.nodes.insert( i, node )
        node.on("click", e => { if(e.evt.button==2) this.remove(node); })
        this.constructLine()
    }

    remove( node ){
        node.remove();
        this.nodes.remove( node );
        this.constructLine();
    }

    getConnectorPoints( from, to, padding ){
        const dx = to.x() - from.x();
        const dy = to.y() - from.y();
        let angle = Math.atan2(-dy, dx);

        const radius = 50;

        return [
          from.x() + -padding * Math.cos(angle + Math.PI),
          from.y() + padding * Math.sin(angle + Math.PI),
          to.x() + -padding * Math.cos(angle),
          to.y() + padding * Math.sin(angle),
        ];
    }

    getNormal( a, b ){
        const dx = a.x()-b.x();
        const dy = a.y()-b.y();
        const len = Math.sqrt( dx*dx + dy*dy );
        return { x : -dy/len, y : dx/len }
    }

    constructLine(){
        this.nodes.forEach( node => node.remove() )
        this.lines.forEach( line => line.destroy() );
        this.lines = [];

        for( let i = 0; i < this.nodes.length; i++ ){
            const a = this.nodes[ i ];
            const b = this.nodes[ (i+1) % this.nodes.length ];

            const line = new Konva.Arrow({
                points: this.getConnectorPoints( a, b, 20 ),
                stroke : "white",
                strokeWidth : 3,
            });

            line.on('mouseenter', e => {
                line.strokeWidth(5);
            })
            line.on('mouseleave', e => {
                line.strokeWidth(3);
            })
            line.on('click', e => {
                if( e.evt.button == 0) this.addNodeAtIndex( i+1, new Node( e.evt.layerX, e.evt.layerY ) );
            })

            const updateLine = e => line.points(this.getConnectorPoints( a, b, 20 ));
            a.on('dragmove', updateLine);
            b.on('dragmove', updateLine);

            this.lines.push( line )
            this.add( line );
        }

        this.nodes.forEach( node => this.add( node ) )
        if ( this.nodes.length > 0 ) this.nodes[0].fill("red");
    }

    deconstructLine(){
        this.nodes.forEach( node => node.remove() );
        this.lines.forEach( line => line.remove() );
    }

    constructRoad(){
        const rightPoints = [];
        const leftPoints  = [];

        for( let i = 1; i < this.nodes.length+2; i++ ){
            const a = this.nodes[ (i-1) % this.nodes.length ];
            const b = this.nodes[ (i+1) % this.nodes.length ];
            const p = this.nodes[  i    % this.nodes.length ];

            const normal = this.getNormal( a, b );

            const prx = p.x() + normal.x*this.trackWidth;
            const pry = p.y() + normal.y*this.trackWidth;
            const plx = p.x() - normal.x*this.trackWidth;
            const ply = p.y() - normal.y*this.trackWidth;

            rightPoints.push(prx, pry );
            leftPoints.push( plx, ply );
        }
        this.rightLine.points( rightPoints );
        this.leftLine.points( leftPoints );
    }

    deconstructRoad(){
        this.rightLine.points([]);
        this.leftLine.points([]);
    }

    getStartingState(){
        const start = this.nodes[0] ;
        const dx = this.nodes[1].x() - start.x() ;
        const dy = this.nodes[1].y() - start.y() ;

        const angle = Math.atan2(-dy, dx);
        
        return [ start.x(), start.y(), angle ] ;
    }
    
}

Array.prototype.insert = function ( index, ...items ) {
    this.splice( index, 0, ...items );
};

Array.prototype.remove = function ( item ) {
    const index = this.indexOf(item);
    if (index > -1) { 
        this.splice(index, 1); 
    }
}