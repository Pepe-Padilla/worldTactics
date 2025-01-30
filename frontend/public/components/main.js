// main loop
// ups - updates per second
// fps - frames per second
let mainLoop = {
    idExecution: null,
    
    // aux variables for UPS and FPS reading, not necessary
    lastMS: 0,
    //ups: 0,
    //fps: 0,

    iteration: function(currentMS) {
        // temporalReg time in ms

        // window.requestAnimationFrame recalls the function currentMS auto completed
        mainLoop.idExecution = window.requestAnimationFrame(mainLoop.iteration);
        mainLoop.update(currentMS);
        mainLoop.draw(currentMS);

        // show UPSs and FPSs
        if(currentMS - mainLoop.lastMS > 999) { // 1 sec = 1000 ms
            mainLoop.lastMS = currentMS;
        //    console.log( "UPS: " + mainLoop.ups + " | FPS: " + mainLoop.fps );
        //    mainLoop.ups = 0;
            //gamepad.update();
        //    mainLoop.fps = 0;
        }

    },
    //stop: function() {},
    update: function(currentMS) {
        //mainLoop.ups++; // UPS reading

        // game logic
        //keyboard.reset();
        gamepad.update();
    },
    draw: function(currentMS) {
        //mainLoop.fps++; // FPS reading
        
        // draw functions

    }
};