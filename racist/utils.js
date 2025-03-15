export default class Vec2{
    constructor( x, y ){
        this.x = x;
        this.y = y;
    }
    rotated( angleDegrees ){
        const angle = angleDegrees/180*Math.PI
        const cos = Math.cos(angle),
              sin = Math.sin(angle);
        return new Vec2(this.x * cos - this.y * sin ,
                        this.x * sin + this.y * cos );
    }
    length(){
        return Math.sqrt( this.x*this.x + this.y*this.y );
    }
    normal(){
        const len = this.length();
        return new Vec2( -this.y/len, this.x/len );
    }
    static distance(v1, v2){
        return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
    }
    static fromNode( node ){
        return new Vec2( node.x(), node.y() );
    }
    static add( v1, v2 ){
        return new Vec2( v1.x+v2.x, v1.y+v2.y );
    }
    static sub( v1, v2 ){
        return new Vec2( v1.x-v2.x, v1.y-v2.y );
    }
}