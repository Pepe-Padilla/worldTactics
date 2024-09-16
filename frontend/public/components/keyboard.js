var keyboard = {
    keys: new Array(),
    init: function() {
        document.onkeydown = keyboard.readKey;
    },
    readKey: function(e) {
        //keyboard.keys.push(e.key);
        gameController.readAction(e.key);
    },
    isKeyDown: function(key) {
        return keyboard.keys.indexOf(key) !== -1;
    },
    reset: function() {
        keyboard.keys = new Array();
    }
};