const searchBar = document.getElementById("search");
searchBar.placeholder = "Search for a location...";

function saveQuery() {
    const query = searchBar.value;
    localStorage.setItem("searchQuery", query);
    // alert("You searched: " + query);
    window.location.href = "html/map.html";
}



//not working 

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











