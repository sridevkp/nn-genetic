import CarPool from "./carpool.js";
import Node from "./node.js";
import Track from "./track.js";

var stage;
var layer ;
var track;
var debugText;
var carpool;
var mode = 'edit' 

document.getElementById("mode").addEventListener('click', function() {
    this.classList.remove(mode);
    mode = mode == 'edit' ? 'run' : 'edit' ;
    this.classList.add(mode);
    document.getElementById("text-content").textContent = mode =='edit'? 'Run' : 'Edit'

    track.setMode( mode );
    if( mode == "run" ){
        if( track.ready() ){
            carpool = new CarPool( 1, track, ...track.getStartingState());
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

    track = new Track( 50 );

    for( let angle = 0; angle < Math.PI*2; angle+= Math.PI/10 ){
        const radius = 150 + Math.random() * 120;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        track.addNode( new Node( stage.width()/2 + x,   stage.height()/2 + y ));
    }
    track.constructLine();
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
function draw( curr ){
    if( mode == "run") requestAnimationFrame( draw );
    if( !carpool ) return ;
    // const timeElapsed = curr - time
    // if( timeElapsed<fpsInterval) return;
    time = curr ;

    carpool.thinkAndMove( 5 );
    
    if( !carpool.running ){
        carpool.calculateFitness();
        carpool.nextGeneration()
    }

    
    debugText.text(`Time : ${(time/1000).toFixed(3)}\nGeneration : ${carpool.generation}\nAlive : ${carpool.running}\nBest : ${carpool.best?.score}`);
}

setup();
draw();