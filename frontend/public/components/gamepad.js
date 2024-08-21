var gamepad = {
    control: null,
    isGamepadConnected: 'ongamepadconnected' in window,
    isConnected: false,
    init: function() {
        if(gamepad.isGamepathConnected) {
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
            gamepad.control = null;
            try {
                gamepad.control = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            } catch(error) {
                console.log(error.m)
            }
        }
    },
    identifiy: function() {}
}