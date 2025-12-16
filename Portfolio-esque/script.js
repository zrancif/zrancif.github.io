var dark = false;
function darkMode(btn){
    console.log(dark);
    dark = !dark;
    if(dark){
        document.documentElement.dataset.theme = "dark";
        btn.innerText = "🌤️ Light Mode";
    }
    else{
        document.documentElement.dataset.theme = "light";
        btn.innerText = "🌙 Dark Mode";
    }
}

var readme = false;
function ReadMore(btn){
    let parentCard = btn.closest(".project-cards");
    let target = parentCard.querySelector(".proj-details")
    
        readme = !readme;
    if(readme){
        target.style.fontSize = "1em";
        target.style.color = "rgb(53, 53, 53, 1)";
        target.style.transision = "rgb(53, 53, 53, 1)";
        btn.innerText = "Read Less";
    }
    else{
        target.style.fontSize = 0;
        target.style.color = "rgb(53, 53, 53, 0)"; 
        btn.innerText = "Read More";
    }
}
