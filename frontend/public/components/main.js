// main loop
// ups - updates per second
// fps - frames per second

var mainLoop = {
    idExecution: null,
    
    // aux variables for UPS and FPS reading, not necesary
    //lastMS: 0,
    //ups: 0,
    //fps: 0,

    iteration: function(currentMS) {
        // temporalReg time in ms

        // window.requestAnimationFrame mete a la función que tiene por parametro el currentMS
        mainLoop.idExecution = window.requestAnimationFrame(mainLoop.iteration);
        mainLoop.update(currentMS);
        mainLoop.draw(currentMS);

        // show UPSs and FPSs
        //if(currentMS - mainLoop.lastMS > 999) { // 1 sec = 1000 ms
        //    mainLoop.lastMS = currentMS;
        //    console.log( "UPS: " + mainLoop.ups + " | FPS: " + mainLoop.fps );
        //    mainLoop.ups = 0;
        //    mainLoop.fps = 0;
        //}

    },
    stop: function() {},
    update: function(currentMS) {
        //mainLoop.ups++; // UPS reading

        // game logic
        keyboard.reset();
    },
    draw: function(currentMS) {
        //mainLoop.fps++; // FPS reading
        
        // draw functions
    }
};