//-----------------------------------------------------SEARCH BAR----------------------------------------------------

    //fetch sur l'url qui contient les datas pour faire un search

const results = document.getElementById("results");
const search = document.getElementById("search");
const API_KEY = "42d462f5c882e0bf35326fd50db4cae6";

let searchInput = search.value;
let filmId;

results.innerHTML="";

if(searchInput===""){
    results.style.visibility = "hidden";
}

search.addEventListener("keyup", () => {            //La fonction se déclanche au relachement de n'importe quelle touche

    results.style.visibility = "visible";
    results.innerHTML="";                           //On vide les resultats au cas où il en restait
    
    searchInput=search.value;                       //On recupere la valeur de l'input
    let urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchInput)}&language=fr-FR`;

    fetch(urlSearch)
        .then(response => response.json())
        .then(data => {
    //console.log(data);
            data.results.forEach ((film, index) => {                    //Le fetch nous donne un json d'une liste de 20 resultats que l'on va parcourir

                
                if(index<10){                                           //On choisit de ne garder que le 10 preniers résultats
                    let option = document.createElement("option");      //Pour chaque résultats on creer une option
                    option.value = data.results[index].title;           //On parametre ensuite cette option
                    option.className="option";
                    option.innerHTML = option.value;
                    results.appendChild(option);                        //On insert notre option dans le result container

                    option.addEventListener("click", () => {            //On ajoute un evenment sur le click pour selectioner et rechercher ce film
                        search.value = option.value;
                        filmId = data.results[index].id;
                        results.innerHTML="";
                        window.location.href= `movie.html?id=${filmId}`;    //On charge la page du film demandé
                        searchInput="";
                    })
                    search.addEventListener("keyup", (event) => {
                        if(event.key === "Escape"){
                            console.log("touche echape")
                            search.value= "";
                            results.innerHTML="";
                        }
                        else if(event.key === "Enter"){
                            filmId=data.results[0].id
                            results.innerHTML="";
                            window.location.href= `movie.html?id=${filmId}`;
                        }   
                        
                      
                })
                }
            });
        })
        .catch(error => {
            console.log('Erreur lors de la recherche ', error);
        });

})

//----------------------------------------------SEARCH BAR MOBILE---------------------------------------------------

const searchMobile = document.getElementById("search-mobile");


searchMobile.addEventListener("click", () => {
    search.style.display = "block";
})