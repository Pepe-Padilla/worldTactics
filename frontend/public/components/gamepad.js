var gamepad = {
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
        if(gamepad.isButtonDown(gamepad.control.buttons[0])) {
            console.log("controll A");
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