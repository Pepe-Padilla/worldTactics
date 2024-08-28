var splash = {
    createBotSplash: function(gold,unitsLost) {
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var theSplash = document.createElement("div");
        document.body.appendChild(theSplash);
        theSplash.id = "theSplash";
        theSplash.style.position = "absolute";
        theSplash.style.zIndex = 100;
        theSplash.style.left = Math.floor(width * 0.1)+"px";
        theSplash.style.top = Math.floor(height * 0.1)+"px";
        theSplash.style.width = Math.floor(width * 0.8)+"px";
        theSplash.style.height = Math.floor(height * 0.8)+"px";
        theSplash.style.background = 'white';
        theSplash.style.border = "5px solid "+players[currentPlayer].color;
        theSplash.style.borderRadius = "8px";

        var idTile = "x0y0";
        var theTile = document.getElementById(idTile);
        var rect=theTile.getBoundingClientRect();
        var IMAGE_MAP_PATH = "../img/map/";
        var IMAGE_CHA_PATH = "../img/characters/";
        var IMAGE_EXTENTION = ".png";

        // 2 or 4 colums depending of the splash height and orentation
        var need4Colums = width > height;

        var newInnerHTML ="<h1 style='text-align: center; color:"+players[currentPlayer].color+"; justify-content: center; align-items : center; font-family : consolas;'>"+players[currentPlayer].playerName+"</hi>"+
        "<h3 style='text-align: center; justify-content: center; align-items: center; font-family : consolas;'>Turn "+currentTurn+"</h3>"+
        "<div style='justify-items: center;'>"+
        "<table>"+
        "<thead><tr>"+
        "<th></th><th></th>";
        if(need4Colums) newInnerHTML += "<th></th><th></th>"; 
        newInnerHTML += "</tr></thead>"+
        "<tbody>"+
        "<tr><td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_MAP_PATH+"casttle0"+IMAGE_EXTENTION+"'></td><td>1</td>";
        if(!need4Colums) newInnerHTML +=  "</tr><tr>"; 
        newInnerHTML += "<td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_MAP_PATH+"keep0"+IMAGE_EXTENTION+"'></td><td>"+(players[currentPlayer].buildings.length -1)+"</td></tr>"+
        "<tr><td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_CHA_PATH+"soldier0"+IMAGE_EXTENTION+"'></td><td>"+players[currentPlayer].units.length+" (-"+unitsLost+" by efects)</td>";
        if(!need4Colums) newInnerHTML += "</tr><tr>"; 
        newInnerHTML += "<td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_MAP_PATH+"mine0"+IMAGE_EXTENTION+"'></td><td>"+gold+" Gold</td></tr>"+
        "</tbody>"+
        "<table></div>"+
        "<h2 style='text-align: center; justify-content: center; align-items: center; font-family : consolas;'>Applying magic efects...</h2>";

        theSplash.innerHTML= newInnerHTML;

        setTimeout(()=>{
            var ts = document.getElementById("theSplash");
            if(ts)ts.remove();
            gameController.state4turnActive();
          },10000);
    }
}