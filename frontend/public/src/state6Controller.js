var state6Cursor = null;
var action67=null;
var state6Controller = {
    actionSelected: function () {
        var selected = document.getElementById("menu60_"+menuCursor);
        var tds=selected.getElementsByTagName("td");
        var action = tds[0].id; 

        switch(action) {
            case "menu60_attack":
                console.log(action);
                this.atackSelected();
                break;
            case "menu60_skill":
                console.log(action);
                break;
            case "menu60_move":
                console.log(action);
                state6Cursor = {...cursor};
                this.moveSelected();
                break;
            case "menu60_cancel":
                console.log(action);
                state5Controller.cancelMoveUnit();
                break;
        }
    },
    moveSelected: function() {
        state50Unit.x=state6Cursor.x;
        state50Unit.y=state6Cursor.y;
        state50Unit.moved = true;
        state5Controller.cancelMoveUnit();
    },
    atackSelected: function() {
        state6Cursor = {...cursor};
        splash.cancelS50Splash();
        mapController.showXRange(state6Cursor.x,state6Cursor.y,state50Unit.atkrange,true,currentPlayer);
        gameState = 67;
    },
    cancelS60: function() {
        cursor = {...state6Cursor};
        state6Cursor=null;
        action67=null;
        mapController.cancelXRange();
        splash.showS50Splash(state50Unit);
        gameState = 60;
    }
}