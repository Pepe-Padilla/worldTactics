var gamepad = {
    keys: [],
    keyRelation: [],
    control: null,
    isGamepadConnected: 'ongamepadconnected' in window,
    isConnected: false,
    init: function() {
        if(gamepad.isGamepadConnected) {
            window.addEventListener("gamepadconnected", gamepad.connect);
            window.addEventListener("gamepaddisconnected", gamepad.disconnect);
        } else {
            gamepad.update();
        }
        this.keyRelation["gamePadA"]= 0;
        this.keyRelation["gamePadB"]= 1;
        this.keyRelation["gamePadLB"]= 4;
        this.keyRelation["gamePadRB"]= 5;
        this.keyRelation["gamePadUp"]= 12;
        this.keyRelation["gamePadDown"]= 13;
        this.keyRelation["gamePadLeft"]= 14;
        this.keyRelation["gamePadRight"]= 15;
    },
    connect: function (e) {
        gamepad.control = e.gamepad;
        gamepad.identifiy();
    },
    disconnect: function (e) {
        console.log("Gamepath disconnect %d: %s", e.gamepad.index, e.gamepad.id);
    },
    update: function() {
        if(!gamepad.isGamepadConnected) {
            aControl = null;
            try {
                aControl = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
                gamepad.control = aControl[0];
                if(!gamepad.isConnected && gamepad.control) {
                    gamepad.isConnected = true;
                    gamepad.identifiy();
                }
            } catch(error) {
                console.log(error.message);
            }
        }
        if(!gamepad.control) {
            return;
        }
        for (const [key, value] of Object.entries(this.keyRelation)) {
            if(gamepad.isButtonDown(gamepad.control.buttons[value])) {
                // whileKeyDown

                if(this.keys.indexOf(key) == -1) {
                    this.keys.push(key);

                    // onKeyDown
                    gameController.readAction(key);
                }
            } else {
                var indexKey = this.keys.indexOf(key);
                if(indexKey !== -1) {
                    this.keys.splice(indexKey,1);

                    // onKeyUp
                }
            } 
        }
    },
    identifiy: function() {
        console.log("GamePad connected [%d]: %s. %d buttons, %d axes", 
            gamepad.control.index,gamepad.control.id,gamepad.control.buttons.length, gamepad.control.axes.length);
    },
    isButtonDown: function(button) {
        if(typeof(button) == "object") {
            return button.pressed;
        }
        return button > 0.3 || button < -0.3; //sería mejor un > 0.3?
    }
}