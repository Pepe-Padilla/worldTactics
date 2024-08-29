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

        var newInnerHTML ="<h1 style='text-align: center; color:"+players[currentPlayer].color+"; justify-content: center; align-items : center; font-family : consolas;'>"+players[currentPlayer].playerName+"</h1>"+
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
        "<tr><td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_CHA_PATH+"soldier0"+IMAGE_EXTENTION+"'></td><td>"+players[currentPlayer].units.length+" </td>";
        if(!need4Colums) newInnerHTML += "</tr><tr>"; 
        newInnerHTML += "<td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_MAP_PATH+"mine0"+IMAGE_EXTENTION+"'></td><td>"+gold+" Gold</td></tr>"+
        "</tbody>"+
        "<table></div>"+
        "<h2 style='text-align: center; justify-content: center; align-items: center; font-family : consolas;'>Magic effects applyed...</h2>"+
        "<h2 style='text-align: center; justify-content: center; align-items: center; font-family : consolas;'>("+unitsLost+" units lost by harmfull effects) </h2>";

        theSplash.innerHTML= newInnerHTML;

        setTimeout(()=>{
            var ts = document.getElementById("theSplash");
            if(ts)ts.remove();
            gameController.state4turnActive();
          },8000);
    },
    showS4Splash: function(terrain, unit, bonus) {
        // showS4Splash
        var splashS4=document.getElementById("splashS4");

        // get mesures
        var idTile = "x0y0";
        var theTile = document.getElementById(idTile);
        var rect=theTile.getBoundingClientRect();
        var midx = Math.floor(theMap.xSize/2); //7 para 15
        var midy = Math.floor(theMap.ySize/2); //7 para 15
        var IMAGE_MAP_PATH = "../img/map/";
        var IMAGE_CHA_PATH = "../img/characters/";
        var IMAGE_EFE_PATH = "../img/effects/";
        var IMAGE_EXTENTION = ".png";

        if(!splashS4) {
            splashS4 = document.createElement("div");
            document.body.appendChild(splashS4);
            splashS4.id = "splashS4";
            splashS4.style.position = "absolute";
            splashS4.style.zIndex = 100;
            splashS4.style.background = 'white';
            splashS4.style.border = "5px solid "+players[currentPlayer].color;
            splashS4.style.borderRadius = "8px";
        }

        if(cursor.x > theMap.xSize / 2) {
            // splashS4 en la izquierda
            splashS4.style.left = Math.floor(rect.left+rect.width)+"px";
            splashS4.style.top = Math.floor(rect.top+rect.height)+"px";
            splashS4.style.width = Math.floor(rect.width*(midx-1))+"px";
            splashS4.style.height = Math.floor(rect.width*(midy+2))+"px";
        } else {
            // splashS4 en la derecha
            splashS4.style.left = Math.floor(rect.left+(rect.width*(midx+1)))+"px";
            splashS4.style.top = Math.floor(rect.top+rect.height)+"px";
            splashS4.style.width = Math.floor(rect.width*(midx-1))+"px";
            splashS4.style.height = Math.floor(rect.width*(midy+2))+"px";
        }

        newInnerHTML = "<div style='justify-items: center;'><table class='S4table'>"+
        "<h1 style='text-align: center; color:"+players[currentPlayer].color+"; justify-content: center; align-items : center; font-family : consolas;'>"+players[currentPlayer].playerName+"</h1>"+
        "<div style='justify-items: center;'><table>"+
        "<tbody>";

        // Unit stats
        if(unit) {
            var effectsUnitHTML = "";
            //var bonus = {agi:0,vel:0,str:0,def:0};
            for(var u=0;u<unit.status.length;u++) {
                effectsUnitHTML += "<img style='width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;' src='"+IMAGE_EFE_PATH+unit.status[u].icon+IMAGE_EXTENTION+"'>&nbsp;";    
            }
            newInnerHTML += "<tr><td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_CHA_PATH+unit.sprite+IMAGE_EXTENTION+"'></td><td>"+unit.name+"</td><tr>"+
            "<tr><td>HP</td><td>"+unit.hp+"</td></tr>"+
            "<tr><td>MP</td><td>"+unit.mp+"</td></tr>"+
            "<tr><td>agi</td><td>"+unit.agi+" "+(agi != 0?"(+ "+bonus.agi+")":"")+"</td></tr>"+
            "<tr><td>vel</td><td>"+unit.vel+" "+(vel != 0?"(+ "+bonus.vel+")":"")+"</td></tr>"+
            "<tr><td>str</td><td>"+unit.str+" "+(str != 0?"(+ "+bonus.str+")":"")+"</td></tr>"+
            "<tr><td>def</td><td>"+unit.def+" "+(def != 0?"(+ "+bonus.def+")":"")+"</td></tr>"+
            "<tr><td colspan='2'>"+effectsUnitHTML+"</td></tr>";
            "<tr><td colspan='2'>&nbsp;</td></tr>";
        }
        
        // Terrain stats
        newInnerHTML += "<tr><td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_MAP_PATH+terrain.sprite+"0"+IMAGE_EXTENTION+"'></td><td></td><tr>"+
        "<tr><td>def</td><td>"+terrain.defBonus+"</td></tr>";
        var effectsTerrainHTML = "";
        for(var t=0;t<terrain.status.length;t++) {
            effectsTerrainHTML += "<img style='width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;' src='"+IMAGE_EFE_PATH+terrain.status[t].icon+IMAGE_EXTENTION+"'>&nbsp;";    
        }
        "<tr><td colspan='2'>"+effectsTerrainHTML+"</td></tr>";
        
        newInnerHTML += "</tbody></table></div>";
        splashS4.innerHTML = newInnerHTML;
    }
}