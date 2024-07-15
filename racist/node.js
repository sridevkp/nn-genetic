export default class Node extends Konva.Circle{
    constructor( x, y ){
        super({
            x, y,
            radius : 10,
            fill : "white",
            strokeWidth : 3,
            draggable : true ,
        })

        this.on("mouseenter", e => {
            this.stroke("grey")
        })
        this.on("mouseleave", e => {
            this.stroke(this.fill())
        })
    }
}