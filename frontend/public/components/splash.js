let splash = {
    createBotSplash: function(gold,unitsLost) {
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        let theSplash = document.createElement("div");
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

        const idTile = "x0y0";
        const theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();
        const IMAGE_MAP_PATH = "../img/map/";
        const IMAGE_CHA_PATH = "../img/characters/";
        const IMAGE_EXTENSION = ".png";

        // 2 or 4 columns depending on the splash height and orientation
        const need4Columns = width > height;

        let newInnerHTML ="<h1 style='text-align: center; color:"+players[currentPlayer].color+"; justify-content: center; align-items : center; font-family : consolas;'>"+players[currentPlayer].playerName+"</h1>"+
        "<h3 style='text-align: center; justify-content: center; align-items: center; font-family : consolas;'>Turn "+currentTurn+"</h3>"+
        "<div style='justify-items: center;'>"+
        "<table>"+
        "<thead><tr>"+
        "<th></th><th></th>";
        if(need4Columns) newInnerHTML += "<th></th><th></th>";
        newInnerHTML += "</tr></thead>"+
        "<tbody>"+
        "<tr><td><img alt='Castle' style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_MAP_PATH+"castle0"+IMAGE_EXTENSION+"'></td><td>1</td>";
        if(!need4Columns) newInnerHTML +=  "</tr><tr>";
        newInnerHTML += "<td><img alt='Keep' style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_MAP_PATH+"keep0"+IMAGE_EXTENSION+"'></td><td>"+(players[currentPlayer].buildings.length -1)+"</td></tr>"+
        "<tr><td><img alt='Commoner' style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_CHA_PATH+"commoner-"+players[currentPlayer].color+IMAGE_EXTENSION+"'></td><td>"+players[currentPlayer].units.length+" </td>";
        if(!need4Columns) newInnerHTML += "</tr><tr>";
        newInnerHTML += "<td><img alt='Gold Mine' style='width:"+(rect.width*1.2)+"px;height:"+(rect.width*1.2)+"px;' src='"+IMAGE_MAP_PATH+"mine0"+IMAGE_EXTENSION+"'></td><td>"+gold+" Gold</td></tr>"+
        "</tbody>"+
        "<table></div>"+
        "<h2 style='text-align: center; justify-content: center; align-items: center; font-family : consolas;'>Magic effects applyed...</h2>"+
        "<h2 style='text-align: center; justify-content: center; align-items: center; font-family : consolas;'>("+unitsLost+" units lost by harmful effects) </h2>";

        theSplash.innerHTML= newInnerHTML;
    },
    showS4Splash: function(terrain, unit, bonus, playerIndex) {
        // showS4Splash
        let splashS4=document.getElementById("splashS4");

        // get measures
        const idTile = "x0y0";
        const theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();
        const midX = Math.floor(theMap.xSize/2); //7 para 15
        //var midY = Math.floor(theMap.ySize/2); //7 para 15
        const IMAGE_MAP_PATH = "../img/map/";
        const IMAGE_CHA_PATH = "../img/characters/";
        const IMAGE_EFE_PATH = "../img/effects/";
        const IMAGE_EXTENSION = ".png";

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
            splashS4.style.width = Math.floor(rect.width*(midX-1))+"px";
            //splashS4.style.height = Math.floor(rect.width*(midY+2))+"px";
        } else {
            // splashS4 en la derecha
            splashS4.style.left = Math.floor(rect.left+(rect.width*(midX+1)))+"px";
            splashS4.style.top = Math.floor(rect.top+rect.height)+"px";
            splashS4.style.width = Math.floor(rect.width*(midX-1))+"px";
            //splashS4.style.height = Math.floor(rect.width*(midY+2))+"px";
        }

        let newInnerHTML = "<div style='justify-items: center;'><table class='S4table'>"+
        "<h1 style='text-align: center; color:"+players[playerIndex].color+"; justify-content: center; align-items : center; font-family : consolas;'>"+players[playerIndex].playerName+"</h1>"+
        "<div style='justify-items: center;'><table>"+
        "<tbody>";

        // Unit stats
        if(unit) {
            let effectsUnitHTML = "";
            //var bonus = {agi:0,vel:0,str:0,def:0};
            for(let u=0;u<unit.status.length;u++) {
                let turnsLeft = 0;
                if(unit.status[u].passive) {
                    //console.log("passive");
                    turnsLeft = "∞";
                }
                else {
                    for(let e=0;e<unit.status[u].effects.length;e++) {
                        const turn = unit.status[u].effects[e].turn;
                        if((turn+1)>turnsLeft) turnsLeft=turn+1;
                    }
                }
                effectsUnitHTML += "<div class='hpMetter' style='--imgVar: var(--"+unit.status[u].icon +"); width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;'>"+turnsLeft+"</div>&nbsp;";    
            }
            newInnerHTML += "<tr><td><img alt='unit' style='width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;' src='"+IMAGE_CHA_PATH+unit.sprite+"-"+players[playerIndex].color+IMAGE_EXTENSION+"'></td><td>"+unit.name+"</td><tr>"+
            "<tr><td>HP</td><td>"+unit.hp+"</td></tr>"+
            "<tr><td>MP</td><td>"+unit.mp+"</td></tr>"+
            "<tr><td>agi</td><td>"+unit.agi+" "+(bonus.agi !== 0?"(+ "+bonus.agi+")":"")+"</td></tr>"+
            "<tr><td>vel</td><td>"+unit.vel+" "+(bonus.vel !== 0?"(+ "+bonus.vel+")":"")+"</td></tr>"+
            "<tr><td>str</td><td>"+unit.str+" "+(bonus.str !== 0?"(+ "+bonus.str+")":"")+"</td></tr>"+
            "<tr><td>def</td><td>"+unit.def+" "+(bonus.def !== 0?"(+ "+bonus.def+")":"")+"</td></tr>"+
            "<tr><td colspan='2'>"+effectsUnitHTML+"</td></tr>";
            "<tr><td colspan='2'><hr></td></tr>";
        }
        
        // Terrain stats
        newInnerHTML += "<tr><td><img alt='terrain' style='width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;' src='"+IMAGE_MAP_PATH+terrain.sprite+"0"+IMAGE_EXTENSION+"'></td><td>def: "+terrain.defBonus+"</td><tr>";
        let effectsTerrainHTML = "";
        for(let t=0;t<terrain.status.length;t++) {
            effectsTerrainHTML += "<img alt='status' style='width:"+(rect.width*0.7)+"px;height:"+(rect.width*0.7)+"px;' src='"+IMAGE_EFE_PATH+terrain.status[t].icon+IMAGE_EXTENSION+"'>&nbsp;";
        }
        "<tr><td colspan='2'>"+effectsTerrainHTML+"</td></tr>";
        
        newInnerHTML += "</tbody></table></div>";
        splashS4.innerHTML = newInnerHTML;
    },
    cancelS4Splash: function() {
        let splashS4=document.getElementById("splashS4");
        if(splashS4)splashS4.remove();
    },
    showS50Splash: function(unit) {
        // showS4Splash
        let splashS50=document.getElementById("splashS50");

        // get measures
        const idTile = "x0y0";
        const theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();
        //const midX = Math.floor(theMap.xSize/2); //7 para 15
        //const midY = Math.floor(theMap.ySize/2); //7 para 15

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
            //splashS4.style.height = Math.floor(rect.width*(midY+2))+"px";
        } else {
            // splashS4 en la derecha
            splashS50.style.left = Math.floor(rect.left+(rect.width*(midx+1)))+"px";
            splashS50.style.top = Math.floor(rect.top+rect.height)+"px";
            //splashS4.style.width = Math.floor(rect.width*(midx-1))+"px";
            //splashS4.style.height = Math.floor(rect.width*(midy+2))+"px";
        }

        let elementsOnMenu = 0;
        let table= document.createElement("table");
        let tbody= document.createElement("tbody");

        // attack
        let atRow= document.createElement("tr");
        atRow.id="menu60_"+elementsOnMenu;
        elementsOnMenu++;
        let atDt1= document.createElement("td");
        atDt1.id="menu60_attack";
        let atico= document.createElement("div");
        atico.className="splashS50Button";
        atico.style.setProperty("--imgVar","var(--atack)");
        atico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        atico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        let atDt2= document.createElement("td");
        atDt2.className="splashS50Text";
        atDt2.innerHTML="Attack";
        atDt1.appendChild(atico);
        atRow.appendChild(atDt1);
        atRow.appendChild(atDt2);
        tbody.appendChild(atRow);

        // Skills
        if(unit.skills.length > 0) {
            let skRow= document.createElement("tr");
            skRow.id="menu60_"+elementsOnMenu;
            elementsOnMenu++;
            let skDt1= document.createElement("td");
            skDt1.id="menu60_skills";
            let skico= document.createElement("div");
            skico.className="splashS50Button";
            skico.style.setProperty("--imgVar","var(--skills)");
            skico.style.setProperty("--widthico",(rect.width*0.7)+"px");
            skico.style.setProperty("--heightico",(rect.height*0.7)+"px");
            let skDt2= document.createElement("td");
            skDt2.className="splashS50Text";
            skDt2.innerHTML="Skills";
            skDt1.appendChild(skico);
            skRow.appendChild(skDt1);
            skRow.appendChild(skDt2);
            tbody.appendChild(skRow);
        }

        // Move
        let moRow= document.createElement("tr");
        moRow.id="menu60_"+elementsOnMenu;
        elementsOnMenu++;
        let moDt1= document.createElement("td");
        moDt1.id="menu60_move";
        let moico= document.createElement("div");
        moico.className="splashS50Button";
        moico.style.setProperty("--imgVar","var(--move)");
        moico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        moico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        let moDt2= document.createElement("td");
        moDt2.className="splashS50Text";
        moDt2.innerHTML="Move";
        moDt1.appendChild(moico);
        moRow.appendChild(moDt1);
        moRow.appendChild(moDt2);
        tbody.appendChild(moRow);

        // Cancel
        let caRow= document.createElement("tr");
        caRow.id="menu60_"+elementsOnMenu;
        elementsOnMenu++;
        let caDt1= document.createElement("td");
        caDt1.id="menu60_cancel";
        let caico= document.createElement("div");
        caico.className="splashS50Button";
        caico.style.setProperty("--imgVar","var(--cancel)");
        caico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        caico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        let caDt2= document.createElement("td");
        caDt2.className="splashS50Text";
        caDt2.innerHTML="Cancel";
        caDt1.appendChild(caico);
        caRow.appendChild(caDt1);
        caRow.appendChild(caDt2);
        tbody.appendChild(caRow);

        table.appendChild(tbody);
        splashS50.appendChild(table);
        document.body.appendChild(splashS50);

        menuCursor = 0;
        Tile.createCursorMenu(menuCursor,players[currentPlayer].color,60);
    },
    cancelS50Splash: function() {
        let splashS50=document.getElementById("splashS50");
        if(splashS50)splashS50.remove();
        Tile.deleteCursorMenu();
    },
    showBuildingMenu: function(sprite) {
        const idTile = "x0y0";
        const theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();

        const idMenu = "building";
        let splashBM=document.getElementById(idMenu);
        if(!splashBM) {
            splashBM=document.createElement("div");
            splashBM.id = idMenu;
            splashBM.className = "splashBM";
            splashBM.style.setProperty("--playerColor",players[currentPlayer].color);
        }
        splashBM.innerHTML = "";

        let table = document.createElement("table");
        let caption = document.createElement("caption");
        caption.innerHTML=players[currentPlayer].playerName +" gold: "+players[currentPlayer].gold;
        table.appendChild(caption);
        
        let trTerrain = document.createElement("tr");
        let td1Terrain = document.createElement("td");
        let td2Terrain = document.createElement("td");
        let divTerrain = document.createElement("div");
        divTerrain.className = "hpMetter";
        divTerrain.style.setProperty("--imgVar","var(--"+sprite+")");
        divTerrain.style.width= rect.width+"px";
        divTerrain.style.height = rect.height+"px";
        td1Terrain.appendChild(divTerrain);
        td2Terrain.textContent = sprite;
        trTerrain.appendChild(td1Terrain);
        trTerrain.appendChild(td2Terrain);
        table.appendChild(trTerrain);

        let count = 0;
        for(let i=0;i<allUnits.length;i++) {
            if(allUnits[i].trainingGround === sprite) {
                let trUnit = document.createElement("tr");
                trUnit.id = "menu52_"+count;
                let trUnitDescription = document.createElement("tr");
                let td1Unit = document.createElement("td");
                td1Unit.id = "unit_"+i;
                let td2Unit = document.createElement("td");
                let td3Unit = document.createElement("td");
                let divUnit = document.createElement("div");

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
                td3Unit.id = "menu_2_52_"+count;
                
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
        const idMenu = "building";
        let splashBM=document.getElementById(idMenu);
        if(splashBM) {
            splashBM.remove();
        }
    },
    showEOTMenu: function(){
        const idTile = "x0y0";
        const theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();

        const idMenu = "endofturn";
        let splashBM=document.getElementById(idMenu);
        if(!splashBM) {
            splashBM=document.createElement("div");
            splashBM.id = idMenu;
            splashBM.className = "splashBM";
            splashBM.style.setProperty("--playerColor",players[currentPlayer].color);
        }
        splashBM.innerHTML = "";

        let table = document.createElement("table");
        let tbody = document.createElement("tbody");

        let elementsOnMenu = 0;

        // Cycle
        let areActiveUnits = false;
        players[currentPlayer].units.forEach(element => {
            if(!element.moved) areActiveUnits = true;
        });
        if(areActiveUnits) {
            let roRow= document.createElement("tr");
            roRow.id="menu80_"+elementsOnMenu;
            elementsOnMenu++;
            let roDt1= document.createElement("td");
            roDt1.id="menu80_cycle";
            let roico= document.createElement("div");
            roico.className="splashS50Button";
            roico.style.setProperty("--imgVar","var(--rotate)");
            roico.style.setProperty("--widthico",(rect.width*0.7)+"px");
            roico.style.setProperty("--heightico",(rect.height*0.7)+"px");
            let roDt2= document.createElement("td");
            roDt2.className="splashS50Text";
            roDt2.innerHTML="Next active unit";
            roDt1.appendChild(roico);
            roRow.appendChild(roDt1);
            roRow.appendChild(roDt2);
            tbody.appendChild(roRow);
        }

        // EOT
        let eotRow= document.createElement("tr");
        eotRow.id="menu80_"+elementsOnMenu;
        elementsOnMenu++;
        let eotDt1= document.createElement("td");
        eotDt1.id="menu80_eot";
        let eotIco= document.createElement("div");
        eotIco.className="splashS50Button";
        eotIco.style.setProperty("--imgVar","var(--eot)");
        eotIco.style.setProperty("--widthico",(rect.width*0.7)+"px");
        eotIco.style.setProperty("--heightico",(rect.height*0.7)+"px");
        let oitDt2= document.createElement("td");
        oitDt2.className="splashS50Text";
        oitDt2.innerHTML="End of turn?";
        eotDt1.appendChild(eotIco);
        eotRow.appendChild(eotDt1);
        eotRow.appendChild(oitDt2);
        tbody.appendChild(eotRow);

        // Cancel
        let caRow= document.createElement("tr");
        caRow.id="menu80_"+elementsOnMenu;
        elementsOnMenu++;
        let caDt1= document.createElement("td");
        caDt1.id="menu80_cancel";
        let caico= document.createElement("div");
        caico.className="splashS50Button";
        caico.style.setProperty("--imgVar","var(--cancel)");
        caico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        caico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        let caDt2= document.createElement("td");
        caDt2.className="splashS50Text";
        caDt2.innerHTML="Cancel";
        caDt1.appendChild(caico);
        caRow.appendChild(caDt1);
        caRow.appendChild(caDt2);
        tbody.appendChild(caRow);

        table.appendChild(tbody);

        splashBM.appendChild(table);
        document.body.appendChild(splashBM);
    },
    cancelEOTMenu: function() {
        const idMenu = "endofturn";
        let splashBM=document.getElementById(idMenu);
        if(splashBM) {
            splashBM.remove();
        }
    },
    skillS50Splash: function(unit) { 
        // showS4Splash
        let splashS50=document.getElementById("splashS50");

        // get mesures
        const idTile = "x0y0";
        const theTile = document.getElementById(idTile);
        const rect=theTile.getBoundingClientRect();

        if(!splashS50) {
            splashS50 = document.createElement("div");
            document.body.appendChild(splashS50);
            splashS50.id = "splashS50";
            splashS50.className="splashS50";
            splashS50.style.setProperty("--colorSprite","var(--"+players[currentPlayer].color+")");
        }

        splashS50.innerHTML = "";

        splashS50.style.left = Math.floor(rect.left+(rect.width/2))+"px";
        splashS50.style.top = Math.floor(rect.top+(rect.height/2))+"px";

        let elementsOnMenu = 0;
        let table= document.createElement("table");
        table.style.borderCollapse = "colapse";
        let caption = document.createElement("caption");
        caption.innerHTML = unit.mp + " mp";
        table.appendChild(caption);
        let tbody= document.createElement("tbody");

        let passiveSkills = [];
        let lasttr = null;
        for(let s = 0;s < unit.skills.length; s++) {
            const skill = unit.skills[s];
            let atRow= document.createElement("tr");
            if(!skill.passive && skill.mp <= unit.mp) {
                atRow.id="menu65_"+elementsOnMenu;
                elementsOnMenu++;
            }
            let atDt1= document.createElement("td");
            atDt1.id="menu65_"+skill.name;
            let atico= document.createElement("div");
            atico.className="splashS50Button";
            atico.style.setProperty("--imgVar","var(--"+skill.icon+")");
            atico.style.setProperty("--widthico",(rect.width*0.7)+"px");
            atico.style.setProperty("--heightico",(rect.height*0.7)+"px");
            if(skill.mp > unit.mp)  atico.style.opacity=0.4;
            let atDt2= document.createElement("td");
            atDt2.className="splashS50Text";
            atDt2.innerHTML=skill.name + " ["+skill.mp+" mp] - "+ skill.description;
            atDt1.appendChild(atico);
            atRow.appendChild(atDt1);
            atRow.appendChild(atDt2);
            if(!skill.passive) { 
                tbody.appendChild(atRow);
                lasttr = atRow;
            }
            else {
                passiveSkills.push(atRow);
            }
        }

        if(lasttr && passiveSkills.length>0) lasttr.style.borderBottom = "1px solid black";

        for(let ps= 0;ps<passiveSkills.length; ps++) {
            tbody.appendChild(passiveSkills[ps]);
            lasttr = passiveSkills[ps];
        }

        lasttr.style.borderBottom = "1px solid black";

        // Cancel
        let caRow= document.createElement("tr");
        caRow.id="menu65_"+elementsOnMenu;
        elementsOnMenu++;
        let caDt1= document.createElement("td");
        caDt1.id="menu65_cancel";
        let caico= document.createElement("div");
        caico.className="splashS50Button";
        caico.style.setProperty("--imgVar","var(--cancel)");
        caico.style.setProperty("--widthico",(rect.width*0.7)+"px");
        caico.style.setProperty("--heightico",(rect.height*0.7)+"px");
        let caDt2= document.createElement("td");
        caDt2.className="splashS50Text";
        caDt2.innerHTML="Cancel";
        caDt1.appendChild(caico);
        caRow.appendChild(caDt1);
        caRow.appendChild(caDt2);
        tbody.appendChild(caRow);

        table.appendChild(tbody);
        splashS50.appendChild(table);
        document.body.appendChild(splashS50);

        menuCursor = 0;
        Tile.deleteCursorMenu();
        Tile.createCursorMenu(menuCursor,players[currentPlayer].color,65);
    }
}