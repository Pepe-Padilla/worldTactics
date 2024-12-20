class ScrDimension {

    mapMaxX;
    mapMaxY;
    width;
    height;
    tiles;
    widthMargin;
    heightMargin;

    constructor (mapMaxXx,mapMaxYx) {
        this.initValues(mapMaxXx,mapMaxYx);
    }

    initValues(mapMaxXx,mapMaxYx){
        this.mapMaxX = mapMaxXx;
        this.mapMaxY = mapMaxYx;
        this.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.tiles = Math.floor(Math.min((this.width / this.mapMaxX),(this.height/this.mapMaxY)));
        this.widthMargin = Math.floor((this.width-(this.tiles*this.mapMaxX))/2);
        this.heightMargin = Math.floor((this.height-(this.tiles*this.mapMaxY))/2);
        console.log("mapMax["+this.mapMaxX+"|"+this.mapMaxY+"] width["+this.width+"] height["+this.height+"] tiles["+this.tiles+"] widthMargin["+this.widthMargin+"] heightMargin["+this.heightMargin+"]");
    }

    init() {
        const mapMaxXx =this.mapMaxX;
        const mapMaxYx =this.mapMaxY;
        window.addEventListener("resize", function(event){
            this.initValues(mapMaxXx,mapMaxYx);
            mapController.redrawTiles(this);
            state4Controller.retakeBuildings();
            state4Controller.redrawUnits();
            mapController.redrawRanges();
        } );
    }
}
