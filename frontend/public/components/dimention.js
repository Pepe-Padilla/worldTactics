class Dimention {

    mapMaxX;
    mapMaxY;
    with;
    height;
    tiles;
    withMargin;
    heightMargin;

    constructor (mapMaxXx,mapMaxYx) {
        this.mapMaxX = mapMaxXx;
        this.mapMaxY = mapMaxYx;
        this.with = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.tiles = Math.floor(Math.min((this.with / this.mapMaxX),(this.height/this.mapMaxY)));
        this.withMargin = Math.floor((this.with-(this.tiles*this.mapMaxX))/2);
        this.heightMargin = Math.floor((this.height-(this.tiles*this.mapMaxY))/2);
        console.log("mapMax["+this.mapMaxX+"|"+this.mapMaxY+"] with["+this.with+"] height["+this.height+"] tiles["+this.tiles+"] withMargin["+this.withMargin+"] heightMargin["+this.heightMargin+"]");
    }

    init() {
        var mapMaxXx =this.mapMaxX;
        var mapMaxYx =this.mapMaxY;
        window.addEventListener("resize", function(event){
            this.mapMaxX = mapMaxXx;
            this.mapMaxY = mapMaxYx;
            this.with = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            this.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.tiles = Math.floor(Math.min((this.with / this.mapMaxX),(this.height/this.mapMaxY)));
            this.withMargin = Math.floor((this.with-(this.tiles*this.mapMaxX))/2);
            this.heightMargin = Math.floor((this.height-(this.tiles*this.mapMaxY))/2);
            console.log("mapMax["+this.mapMaxX+"|"+this.mapMaxY+"] with["+this.with+"] height["+this.height+"] tiles["+this.tiles+"] withMargin["+this.withMargin+"] heightMargin["+this.heightMargin+"]");
            init.redrawTiles(this);
        } );
    }
}
