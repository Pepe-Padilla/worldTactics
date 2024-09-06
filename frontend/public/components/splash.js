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
        "<tr><td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_CHA_PATH+"commoner-"+players[currentPlayer].color+IMAGE_EXTENTION+"'></td><td>"+players[currentPlayer].units.length+" </td>";
        if(!need4Colums) newInnerHTML += "</tr><tr>"; 
        newInnerHTML += "<td><img style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_MAP_PATH+"mine0"+IMAGE_EXTENTION+"'></td><td>"+gold+" Gold</td></tr>"+
        "</tbody>"+
        "<table></div>"+
        "<h2 style='text-align: center; justify-content: center; align-items: center; font-family : consolas;'>Magic effects applyed...</h2>"+
        "<h2 style='text-align: center; justify-content: center; align-items: center; font-family : consolas;'>("+unitsLost+" units lost by harmfull effects) </h2>";

        theSplash.innerHTML= newInnerHTML;
    },
    showS4Splash: function(terrain, unit, bonus, playerIndex) {
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
            //splashS4.style.height = Math.floor(rect.width*(midy+2))+"px";
        } else {
            // splashS4 en la derecha
            splashS4.style.left = Math.floor(rect.left+(rect.width*(midx+1)))+"px";
            splashS4.style.top = Math.floor(rect.top+rect.height)+"px";
            splashS4.style.width = Math.floor(rect.width*(midx-1))+"px";
            //splashS4.style.height = Math.floor(rect.width*(midy+2))+"px";
        }

        newInnerHTML = "<div style='justify-items: center;'><table class='S4table'>"+
        "<h1 style='text-align: center; color:"+players[playerIndex].color+"; justify-content: center; align-items : center; font-family : consolas;'>"+players[playerIndex].playerName+"</h1>"+
        "<div style='justify-items: center;'><table>"+
        "<tbody>";

        // Unit stats
        if(unit) {
            var effectsUnitHTML = "";
            //var bonus = {agi:0,vel:0,str:0,def:0};
            for(var u=0;u<unit.status.length;u++) {
                var turnsLeft = 0;
                for(var e=0;e<unit.status[u].effects.length;e++) {
                    var turn = unit.status[u].effects[e].turn;
                    if((turn+1)>turnsLeft) turnsLeft=turn+1;
                }
                effectsUnitHTML += "<div class='hpMetter' style='--imgVar: var(--"+unit.status[u].icon +"); width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;'>"+turnsLeft+"</div>&nbsp;";    
            }
            newInnerHTML += "<tr><td><img style='width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;' src='"+IMAGE_CHA_PATH+unit.sprite+"-"+players[playerIndex].color+IMAGE_EXTENTION+"'></td><td>"+unit.name+"</td><tr>"+
            "<tr><td>HP</td><td>"+unit.hp+"</td></tr>"+
            "<tr><td>MP</td><td>"+unit.mp+"</td></tr>"+
            "<tr><td>agi</td><td>"+unit.agi+" "+(bonus.agi != 0?"(+ "+bonus.agi+")":"")+"</td></tr>"+
            "<tr><td>vel</td><td>"+unit.vel+" "+(bonus.vel != 0?"(+ "+bonus.vel+")":"")+"</td></tr>"+
            "<tr><td>str</td><td>"+unit.str+" "+(bonus.str != 0?"(+ "+bonus.str+")":"")+"</td></tr>"+
            "<tr><td>def</td><td>"+unit.def+" "+(bonus.def != 0?"(+ "+bonus.def+")":"")+"</td></tr>"+
            "<tr><td colspan='2'>"+effectsUnitHTML+"</td></tr>";
            "<tr><td colspan='2'><hr></td></tr>";
        }
        
        // Terrain stats
        newInnerHTML += "<tr><td><img style='width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;' src='"+IMAGE_MAP_PATH+terrain.sprite+"0"+IMAGE_EXTENTION+"'></td><td>def: "+terrain.defBonus+"</td><tr>";
        var effectsTerrainHTML = "";
        // TODO: pasar a dev como con units
        for(var t=0;t<terrain.status.length;t++) {
            effectsTerrainHTML += "<img style='width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;' src='"+IMAGE_EFE_PATH+terrain.status[t].icon+IMAGE_EXTENTION+"'>&nbsp;";    
        }
        "<tr><td colspan='2'>"+effectsTerrainHTML+"</td></tr>";
        
        newInnerHTML += "</tbody></table></div>";
        splashS4.innerHTML = newInnerHTML;
    },
    cancelS4Splash: function() {
        var splashS4=document.getElementById("splashS4");
        if(splashS4)splashS4.remove();
    },
    showS50Splash: function(unit) {
        // showS4Splash
        var splashS50=document.getElementById("splashS50");

        // get mesures
        var idTile = "x0y0";
        var theTile = document.getElementById(idTile);
        var rect=theTile.getBoundingClientRect();
        var midx = Math.floor(theMap.xSize/2); //7 para 15
        var midy = Math.floor(theMap.ySize/2); //7 para 15

        if(!splashS50) {
            splashS50 = document.createElement("div");
            document.body.appendChild(splashS50);
            splashS50.id = "splashS50";
            splashS50.className="splashS50";
            splashS50.style.setProperty("--colorSprite","var(--"+players[currentPlayer].color+")");
        }

        if(cursor.x > theMap.xSize / 2) {
            // splashS4 en la izquierda
            splashS50.style.left = Math.floor(rect.left+rect.width)+"px";
            splashS50.style.top = Math.floor(rect.top+rect.height)+"px";
            //splashS4.style.width = Math.floor(rect.width*(midx-1))+"px";
            //splashS4.style.height = Math.floor(rect.width*(midy+2))+"px";
        } else {
            // splashS4 en la derecha
            splashS50.style.left = Math.floor(rect.left+(rect.width*(midx+1)))+"px";
            splashS50.style.top = Math.floor(rect.top+rect.height)+"px";
            //splashS4.style.width = Math.floor(rect.width*(midx-1))+"px";
            //splashS4.style.height = Math.floor(rect.width*(midy+2))+"px";
        }

        var elementsOnMenu = 0;
        var table= document.createElement("table");
        var tbody= document.createElement("tbody");

        // atack
        var atrow= document.createElement("tr");
        atrow.id="menu60_"+elementsOnMenu;
        elementsOnMenu++;
        var atdt1= document.createElement("td");
        atdt1.id="menu60_attack";
        var atico= document.createElement("div");
        atico.className="splashS50Button";
        atico.style.setProperty("--imgVar","var(--atack)");
        atico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        atico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        var atdt2= document.createElement("td");
        atdt2.className="splashS50Text";
        atdt2.innerHTML="Attack";
        atdt1.appendChild(atico);
        atrow.appendChild(atdt1);
        atrow.appendChild(atdt2);
        tbody.appendChild(atrow);

        // Skills
        if(unit.skills.length > 0) {
            var skrow= document.createElement("tr");
            skrow.id="menu60_"+elementsOnMenu;
            elementsOnMenu++;
            var skdt1= document.createElement("td");
            skdt1.id="menu60_skills";
            var skico= document.createElement("div");
            skico.className="splashS50Button";
            skico.style.setProperty("--imgVar","var(--skills)");
            skico.style.setProperty("--widthico",(rect.width*0.7)+"px");
            skico.style.setProperty("--heightico",(rect.height*0.7)+"px");
            var skdt2= document.createElement("td");
            skdt2.className="splashS50Text";
            skdt2.innerHTML="Skills";
            skdt1.appendChild(skico);
            skrow.appendChild(skdt1);
            skrow.appendChild(skdt2);
            tbody.appendChild(skrow);
        }

        // TODO: Take

        // Move
        var morow= document.createElement("tr");
        morow.id="menu60_"+elementsOnMenu;
        elementsOnMenu++;
        var modt1= document.createElement("td");
        modt1.id="menu60_move";
        var moico= document.createElement("div");
        moico.className="splashS50Button";
        moico.style.setProperty("--imgVar","var(--move)");
        moico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        moico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        var modt2= document.createElement("td");
        modt2.className="splashS50Text";
        modt2.innerHTML="Move";
        modt1.appendChild(moico);
        morow.appendChild(modt1);
        morow.appendChild(modt2);
        tbody.appendChild(morow);

        // Cancel
        var carow= document.createElement("tr");
        carow.id="menu60_"+elementsOnMenu;
        elementsOnMenu++;
        var cadt1= document.createElement("td");
        cadt1.id="menu60_cancel";
        var caico= document.createElement("div");
        caico.className="splashS50Button";
        caico.style.setProperty("--imgVar","var(--cancel)");
        caico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        caico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        var cadt2= document.createElement("td");
        cadt2.className="splashS50Text";
        cadt2.innerHTML="Cancel";
        cadt1.appendChild(caico);
        carow.appendChild(cadt1);
        carow.appendChild(cadt2);
        tbody.appendChild(carow);

        table.appendChild(tbody);
        splashS50.appendChild(table);
        document.body.appendChild(splashS50);

        menuCursor = 0;
        Tile.createCursorMenu(menuCursor,players[currentPlayer].color,60);
    },
    cancelS50Splash: function() {
        var splashS50=document.getElementById("splashS50");
        if(splashS50)splashS50.remove();
        Tile.deleteCursorMenu();
    },
    showBuildingMenu: function(sprite) {
        var idTile = "x0y0";
        var theTile = document.getElementById(idTile);
        var rect=theTile.getBoundingClientRect();

        var idMenu = "building";
        var splashBM=document.getElementById(idMenu);
        if(!splashBM) {
            splashBM=document.createElement("div");
            splashBM.id = idMenu;
            splashBM.className = "splashBM";
            splashBM.style.setProperty("--playerColor",players[currentPlayer].color);
        }
        splashBM.innerHTML = "";

        var table = document.createElement("table");
        var caption = document.createElement("caption");
        caption.innerHTML=players[currentPlayer].name +" gold: "+players[currentPlayer].gold;
        table.appendChild(caption);
        
        var trTerrain = document.createElement("tr");
        var td1Terrain = document.createElement("td");
        var td2Terrain = document.createElement("td");
        var divTerrain = document.createElement("div");
        divTerrain.className = "hpMetter";
        divTerrain.style.setProperty("--imgVar","var(--"+sprite+")");
        divTerrain.style.width= rect.width+"px";
        divTerrain.style.height = rect.height+"px";
        td1Terrain.appendChild(divTerrain);
        td2Terrain.textContent = sprite;
        trTerrain.appendChild(td1Terrain);
        trTerrain.appendChild(td2Terrain);
        table.appendChild(trTerrain);

        var count = 0;
        for(var i=0;i<allUnits.length;i++) {
            if(allUnits[i].traingGround == sprite) {
                var trUnit = document.createElement("tr");
                trUnit.id = "menu52_"+count;
                var trUnitDescription = document.createElement("tr");
                var td1Unit = document.createElement("td");
                td1Unit.id = "unit_"+i;
                var td2Unit = document.createElement("td");
                var td3Unit = document.createElement("td");
                var divUnit = document.createElement("div");

                divUnit.className = "hpMetter";
                divUnit.style.setProperty("--imgVar","var(--"+allUnits[i].sprite+"-"+players[currentPlayer].color+")");
                divUnit.style.width= rect.width+"px";
                divUnit.style.height = rect.height+"px";
                td1Unit.rowSpan=2;
                td1Unit.appendChild(divUnit);

                td2Unit.textContent = allUnits[i].name + " - " + allUnits[i].gold + " gold";
                td2Unit.style.fontSize="larger";
                td3Unit.style.fontSize="normal";
                td3Unit.textContent = allUnits[i].description;
                var idTR2="menu_2_52_"+count;
                td3Unit.id = idTR2;
                
                trUnit.appendChild(td1Unit);
                trUnit.appendChild(td2Unit);
                trUnitDescription.appendChild(td3Unit);
                
                table.appendChild(trUnit);
                table.appendChild(trUnitDescription);
                
                count++;
            }
        }

        splashBM.appendChild(table);
        document.body.appendChild(splashBM);
    },
    cancelBuildingMenu: function() {
        var idMenu = "building";
        var splashBM=document.getElementById(idMenu);
        if(splashBM) {
            splashBM.remove();
        }
    },
    showEOTMenu: function(){
        var idTile = "x0y0";
        var theTile = document.getElementById(idTile);
        var rect=theTile.getBoundingClientRect();

        var idMenu = "endofturn";
        var splashBM=document.getElementById(idMenu);
        if(!splashBM) {
            splashBM=document.createElement("div");
            splashBM.id = idMenu;
            splashBM.className = "splashBM";
            splashBM.style.setProperty("--playerColor",players[currentPlayer].color);
        }
        splashBM.innerHTML = "";

        var table = document.createElement("table");
        var tbody = document.createElement("tbody");

        var elementsOnMenu = 0;

        // Cicle
        var areActiveUnits = false;
        players[currentPlayer].units.forEach(element => {
            if(!element.moved) areActiveUnits = true;
        });
        if(areActiveUnits) {
            var rorow= document.createElement("tr");
            rorow.id="menu80_"+elementsOnMenu;
            elementsOnMenu++;
            var rodt1= document.createElement("td");
            rodt1.id="menu80_cicle";
            var roico= document.createElement("div");
            roico.className="splashS50Button";
            roico.style.setProperty("--imgVar","var(--rotate)");
            roico.style.setProperty("--widthico",(rect.width*0.7)+"px");
            roico.style.setProperty("--heightico",(rect.height*0.7)+"px");
            var rodt2= document.createElement("td");
            rodt2.className="splashS50Text";
            rodt2.innerHTML="Next active unit";
            rodt1.appendChild(roico);
            rorow.appendChild(rodt1);
            rorow.appendChild(rodt2);
            tbody.appendChild(rorow);
        }

        // EOT
        var carow= document.createElement("tr");
        carow.id="menu80_"+elementsOnMenu;
        elementsOnMenu++;
        var cadt1= document.createElement("td");
        cadt1.id="menu80_eot";
        var caico= document.createElement("div");
        caico.className="splashS50Button";
        caico.style.setProperty("--imgVar","var(--eot)");
        caico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        caico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        var cadt2= document.createElement("td");
        cadt2.className="splashS50Text";
        cadt2.innerHTML="End of turn?";
        cadt1.appendChild(caico);
        carow.appendChild(cadt1);
        carow.appendChild(cadt2);
        tbody.appendChild(carow);

        // Cancel
        var carow= document.createElement("tr");
        carow.id="menu80_"+elementsOnMenu;
        elementsOnMenu++;
        var cadt1= document.createElement("td");
        cadt1.id="menu80_cancel";
        var caico= document.createElement("div");
        caico.className="splashS50Button";
        caico.style.setProperty("--imgVar","var(--cancel)");
        caico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        caico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        var cadt2= document.createElement("td");
        cadt2.className="splashS50Text";
        cadt2.innerHTML="Cancel";
        cadt1.appendChild(caico);
        carow.appendChild(cadt1);
        carow.appendChild(cadt2);
        tbody.appendChild(carow);

        table.appendChild(tbody);

        splashBM.appendChild(table);
        document.body.appendChild(splashBM);
    },
    cancelEOTMenu: function() {
        var idMenu = "endofturn";
        var splashBM=document.getElementById(idMenu);
        if(splashBM) {
            splashBM.remove();
        }
    }
}