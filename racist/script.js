import CarPool from "./carpool.js";
import Node from "./nodeobject.js";
import Track from "./track.js";

var stage;
var layer ;
var track;
var debugText;
var carpool;
var mode = 'edit' ;
var debug = false ;
let speed = 1 ;

document.getElementById("speed").oninput = function(){ speed = this.value }

document.getElementById("debug").addEventListener( 'click', function(){
    debug = ! debug ;
    this.textContent = debug ? "Hide gizmos" : "Show gizmos";
    carpool && carpool.debug( debug );
})

document.getElementById("mode").addEventListener('click', function() {
    this.classList.remove('checked','unchecked');
    mode = mode == 'edit' ? 'run' : 'edit' ;
    this.classList.add( mode == 'run'? 'checked': 'unchecked' );
    document.getElementById("text-content").textContent = mode =='edit'? 'Run' : 'Edit'

    track.setMode( mode );
    if( mode == "run" ){
        track.saveTrack();
        if( track.ready() ){
            carpool = new CarPool( 100, track, ...track.getStartingState());
            layer.add(carpool)
            layer.draw()
            draw()
        }
    }else{
        carpool.destroy() ;
    }
})


function setup(){
    stage = new Konva.Stage({
        container: 'canvas', 
        width : window.innerWidth,
        height : window.innerHeight
    });
    
    layer = new Konva.Layer();
    
    stage.add(layer);
    
    window.addEventListener("resize", e => {
        stage.width(  window.innerWidth  );
        stage.height( window.innerHeight ); 
    })

    track = new Track( 35 );

    if( !track.loadTrack() ){
        for( let angle = 0; angle < Math.PI*2; angle+= Math.PI/10 ){
            const radius = 250 + Math.random() * 90;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            track.addNode( new Node( stage.width()/2 + x,   stage.height()/2 + y ));
        }
        track.constructLine();
    }
    layer.add( track )

    debugText = new Konva.Text({
        x : 20, y : 20 
    })

    layer.add( debugText );
    layer.draw();
}

// const fps = 60;
// const fpsInterval = 1000/fps;
var time = 0 ;
var genTime = 0;
function draw( curr ){
    if( mode == "run") requestAnimationFrame( draw );
    if( !carpool || !carpool.running ) return ;
    // const timeElapsed = curr - time
    // if( timeElapsed<fpsInterval) return;
    time = curr ;
    for( let i = 0; i < speed; i++){
        carpool.thinkAndMove( 2, genTime );
        genTime++;
        if( !carpool.running ){
            genTime = 0;
            carpool.calculateFitness();
            carpool.nextGeneration()
            carpool.debug( debug )
        }
        debugText.text(`Time : ${(time/1000).toFixed(3)}\nGeneration : ${carpool.generation}\nAlive : ${carpool.running}\nBest : ${carpool.bestScore}`);
    }
}

setup();draw();
