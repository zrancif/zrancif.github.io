document.getElementById("sidebar").addEventListener("click", () => {
    if(document.getElementById("menu").classList.contains("close")) {
        document.getElementById("menu").classList.remove("close");
        document.getElementById("menu").classList.toggle("open");
        document.body.style = "overflow:hidden;";
        document.getElementById("markers").style = "display:none;";
    }
    else{
        document.getElementById("menu").classList.remove("open");
        document.getElementById("menu").classList.toggle("close");
        document.body.style = "overflow:visible;";
        document.getElementById("markers").style = "display:absolute;";
  }
});
