var dimentions = {
    with: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    init: function() {
        window.addEventListener("resize", function(event){
            dimentions.with = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            dimentions.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            console.log("new With["+dimentions.with+"] Height["+dimentions.height+"]");
        } );
    }
}