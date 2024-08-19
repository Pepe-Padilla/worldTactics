function Rectangle (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = "r"+x+y+w+h;
    this.insertDOM();
}

Rectangle.prototype.insertDOM = function () {
    var div = '<div id="'+this.id+'"></div>'
    var wtGame = document.getElementById("wtGame").innerHTML;
    var color =  '#'+ Math.floor(Math.random()*16777215).toString(16); //Math.floor(Math.random()*16777215) numeros aleatorios para RGB!!!
    document.getElementById("wtGame").innerHTML = wtGame + div;

    document.getElementById(this.id).style.position = "absolute";
    document.getElementById(this.id).style.left = this.x + "px";
    document.getElementById(this.id).style.top = this.y + "px";
    document.getElementById(this.id).style.width = this.w + "px";
    document.getElementById(this.id).style.height = this.h + "px";
    document.getElementById(this.id).style.backgroundColor = color;

}