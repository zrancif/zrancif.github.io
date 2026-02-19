    const searchBar = document.getElementById("search");
    const savedQuery = localStorage.getItem("searchQuery");
    
    function saveQuery() {
        const query = searchBar.value;
        localStorage.setItem("searchQuery", query);
        // alert("You searched: " + query);
        window.location.href = "../html/map.html";
    }

window.addEventListener("DOMContentLoaded", () => {
    if (savedQuery) {
        searchBar.placeholder = savedQuery;
        localStorage.removeItem("searchQuery");
    }
    else {
        searchBar.placeholder = "Search for a location...";
    }
});


const canvas = document.getElementById("mapCanvas"); 
const ctx = canvas.getContext("2d");    
const mapImg = document.getElementById("mapImage"); 


//draw map
window.addEventListener("DOMContentLoaded", () => {
    const imgAspect = mapImg.width / mapImg.height;
    const maxCanvasWidth = window.innerWidth * 0.9;
    const maxCanvasHeight = window.innerHeight * 0.85;

    let drawWidth = maxCanvasWidth;
    let drawHeight = maxCanvasWidth / imgAspect;

    if (drawHeight > maxCanvasHeight) {
        drawHeight = maxCanvasHeight;
        drawWidth = maxCanvasHeight * imgAspect;
    }

    canvas.width = drawWidth;
    canvas.height = drawHeight;

    ctx.drawImage(mapImg, 0, 0, drawWidth, drawHeight);
});


//Map stuff
fetch("../JSON/mapData.json")
    .then(res => res.json())
    .then(locations => {
        const mapDiv = document.getElementById("markers");

        locations.forEach(loc => {
            const marker = document.createElement("div");
            marker.textContent = loc.label;
            marker.title = loc.name;
            


                marker.style.position= 'absolute';
                marker.style.left = (loc.x * (canvas.width / mapImg.width)) + 'px';
                marker.style.top = (loc.y * (canvas.height / mapImg.height)) + 'px';
                marker.style.transform= 'translate(-50%, -50%)';
                marker.style.pointerEvents='auto';
                marker.style.fontSize= '10px';
                marker.style.backgroundColor= 'wheat';
                marker.style.borderRadius= '5px';
                marker.style.padding= '2px';
                marker.style.textAlign= 'center';
                marker.style.zIndex= '1';
                marker.style.cursor= 'pointer';

                if (savedQuery && loc.name.toLowerCase() === savedQuery.toLowerCase()) {
                    marker.style.boxShadow = "0 0 10px 2px rgba(255, 0, 0, 0.5)";
                    marker.style.zIndex = "2";
                }
                else{
                    marker.style.border = "none";
                }
            
            marker.addEventListener("click", () => {
                // alert("You clicked on: " + loc.name);
                document.getElementById("popUp").style.display = "inline";
                document.getElementById("popUp").querySelector("div").style.display="flex";
                document.getElementById("popUp").querySelector("img").style.display="block";

                document.getElementById("bldgName").innerHTML = loc.name;
                document.getElementById("bldgImg").src = loc.image;
                

                const details = document.getElementById("Details");
                details.innerHTML = "";

                if (loc.type === "bldg") {
                    for (let i = loc.floor; i > 0; i--) {
                    details.appendChild(document.createElement("hr"));
                    const floorDiv = document.createElement("div");
                    floorDiv.className = "floor";
                    floorDiv.innerText = "Floor " + i;
                    details.appendChild(floorDiv);
                    details.appendChild(document.createElement("hr"));

                    const roomsDiv = document.createElement("div");
                    roomsDiv.className = "rooms";

        
                    const col1 = document.createElement("div");
                    const col2 = document.createElement("div");
                    col1.className = "column";
                    col2.className = "column";

                    const roomList = loc.rooms[i - 1];
                    const half = Math.ceil(roomList.length / 2);

                    for (let j = 0; j < roomList.length; j++) {
                        const roomDiv = document.createElement("div");
                        roomDiv.className = "room";
                        roomDiv.innerText = roomList[j];

                        if (j < half) col1.appendChild(roomDiv);
                        else col2.appendChild(roomDiv);
                    }

                    roomsDiv.appendChild(col1);
                    roomsDiv.appendChild(col2);
                    details.appendChild(roomsDiv);
                }
            }

            if (loc.type === "gate"){
                details.innerText="Schedule";
                details.appendChild(document.createElement("hr"));
                for (let j = 0; j < loc.schedule.length; j++) {
                        const schedDiv = document.createElement("div");
                        schedDiv.className = "sched";
                        schedDiv.innerText = loc.schedule[j];
                        details.appendChild(schedDiv);
                    }
            }
            });



            mapDiv.appendChild(marker);
        });
    });

fetch("../JSON/mapData.json")
  .then(response => response.json())
  .then(data => {
    const datalist = document.getElementById("labels");
    data.forEach(item =>{
      if(item.name){
        const option = document.createElement('option');
        option.value = item.name;
        datalist.appendChild(option);
      }
      Object.assign(document.getElementById("labels").style, {
        width: 'calc(100vw - 10vh)'
      })
    })
  })

  function closePopUp() {
    document.getElementById("popUp").style.display = "none";
  }
