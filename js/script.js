"use strict";


const API_KEY = "f220b0b98c5eef49bb153e81d0235707";

/* --- CAROUSEL DES BANDES-ANNONCES --- */
const heroList = document.getElementById("hero-list");

fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr-FR&sort_by=popularity.desc`)
    .then(response => response.json())
    .then(heroData => {
        const tabBA = [];
        
        for (let i = 0; i < 4; i++) {
            const movie = heroData.results[i];
            const videoBa = fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=fr-FR`)
                .then(response => response.json())
                .then(videoData => {
                    const trailer = videoData.results.find(v => v.site === "YouTube" && v.type === "Trailer");
                    
                    if (!trailer) return;

                    heroList.innerHTML += `
                    <li class="splide__slide">
                        <iframe 
                        src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}" 
                        frameborder="0" allowfullscreen
                        allow="autoplay; encrypted-media">
                        </iframe>
                        <div class="film-overlay">
                        <h2>${movie.title}</h2>
                        <p>⭐ ${movie.vote_average}/10</p>
                        </div>
                    </li>
                    `;
                });
            
            tabBA.push(videoBa);
        }
        
        return Promise.all(tabBA);
    })
    .then(() => {
        new Splide("#hero-carousel", {
            type: "fade",
            autoplay: true,
            interval: 9000,
            rewind: true,
            arrows: false,
            pagination: true,
        }).mount();
    })
    .catch(error => console.error("Erreur bandes-annonces :", error));


    /* ------ CAROUSEL DES AFFICHES DE FILMS DE LA SEMAINE ------- */
    const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr-FR&sort_by=release_date.desc&primary_release_date.gte=2025-11-01&primary_release_date.lte=2025-11-07`;
//console.log(API_URL);

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const liste = document.getElementById("liste-film");
            liste.innerHTML = "";

            data.results.forEach(movie => {
                if (!movie.poster_path) return;
                const li = document.createElement("li");
                li.classList.add("splide__slide");
                li.innerHTML = `
                <a href="movie.html?id=${movie.id}">
                    <div class="film-card">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    <div class="film-info">
                        <h3>${movie.title}</h3>
                        <p>📅 ${movie.release_date}</p>
                        <p>⭐ ${movie.vote_average}/10</p>
                    </div>
                    </div>
                </a>`;
                liste.appendChild(li);
            });

            new Splide("#films", {
                perPage: 6,
                gap: "1rem",
                autoplay: true,
                type: 'loop',
                rewind: true,
                breakpoints: {
                    1024: { perPage: 5 },
                    768: { perPage: 3 },
                    480: { perPage: 2 },
                },
            }).mount();
        })
        .catch(error => console.error("Erreur :", error));

//-----------------------------------------------------SEARCH BAR----------------------------------------------------

        //fetch sur l'url qui contient les datas pour faire un search

const results = document.getElementById("results");
const search = document.getElementById("search");
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
console.log(index);
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