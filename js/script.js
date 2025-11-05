    "use strict";


//  js de corentin

    //On recupere en début de script tous les objets pour acceder au DOM
    const movieImg = document.getElementById("movie-img");
    const title = document.getElementById("title");
    const date = document.getElementById("date");
    const grade = document.getElementById("grade");
    const genre  = document.getElementById("genre");
    const filmMaker = document.getElementById("film-maker");
    const actors = document.getElementById("actors-container");
    const synopsis = document.getElementById("synopsis");
    
    //On creer ensuite des variables globales qui nous serviront plus tard
    let actorsTab = [];
    let filmMakerTab = [];
    let time;
    const nbActor = 5;


    //On initialise ensuite tous les elements au chargement

    genre.textContent = "Genre: ";
    actors.textContent = "Acteurs:";
    filmMaker.textContent = "Réalisé par: ";




//fetch du fichier details.json dans lequel nous avons toutes les datas du film
    fetch('http://127.0.0.1:5500/json/details.json')
        .then(response => response.json())
        .then(data => {
console.log(data);
//Partie récupération des infos principales
            movieImg.src="https://image.tmdb.org/t/p/original/"+data.poster_path;
            time = data.runtime;
            time = " - "+Math.floor(time/60)+"h "+(time%60)+"min";
            title.textContent = data.title;
            date.textContent = data.release_date.slice(0,4);
            grade.innerHTML ='<i class="fa-solid fa-star"></i> '+data.vote_average+"/10";
            data.genres.forEach((element, index) => {   //puisque le film peut avoir plusieurs genre nous faisons une boucle for each afin de tous les récuprer et mettre en page

                if(index===(data.genres.length-1)){
                    genre.textContent += element.name+time; //On ne met pas de "/" au dernier élément
                }else{genre.textContent += element.name+"/";}
            });
            synopsis.textContent = data.overview;
        

        })


//fetch du fichier credits.json dans lequel nous avons le casting
    fetch('http://127.0.0.1:5500/json/credits.json')
        .then(response => response.json())
        .then(data => {
console.log(data);

            //Partie récupération des acteurs
            for(let i=0 ; i<nbActor ; i++){                     //On boucle pour récupérer les nbActor premiers acteurs   
                let actor = document.createElement("p");
                let character = document.createElement("p");
                let container = document.createElement("div");
                container.id = "portrait-container";
                if(i===0){                                       //On gère l'affichage du premier espacement 
                    actor.textContent = data.cast[i].name+", ";
                    actor.style.marginLeft = "4px";
                }
                else if(i===nbActor-1){                         //Dernier acteur sans la virgule
                    actor.textContent = data.cast[i].name
                }else{
                    actor.textContent = data.cast[i].name+", "; 
                }
                                                                //On ajoute le nom du personnage joué par l'acteur et on creer un element image avec sa photo
                character.textContent = data.cast[i].character;
                character.className = "actor-charact";
                actor.id = `actor${i}`;
                actor.style.paddingRight = "2px";
                actor.style.paddingLeft = "2px";
                actor.style.cursor = "pointer";
                let actorImg = document.createElement("img");
                let actorText = actor.textContent;
                actorImg.className = "actor-img";

                //On fait un evenement mouse over pour afficher la photo et le personnage joué par l'acteur
                actor.addEventListener("mouseover", ()=>{
                    
                    actorImg.src = "https://image.tmdb.org/t/p/original/"+data.cast[i].profile_path;
                    container.appendChild(actorImg);
                    container.appendChild(character);
                    actor.appendChild(container);
                    
                })
                
                //On fait un evenement mouse leave pour retirer la photo et le personnage joué par l'acteur
                actor.addEventListener("mouseleave", () => {
                   
                    actor.innerHTML = "";
                    actor.textContent = actorText;
                })
                actors.appendChild(actor);
            }

            //Partie récupération du réalisateur
            data.crew.forEach(element => {      //On cherche dans tous le json les réalisateurs
                if(element.job==="Director"){
                    filmMakerTab.push(element.name);    //On stock les noms des réalisateurs dans un tableau
                }
            });
            filmMaker.textContent += filmMakerTab.join(", "); //On affiche les réalisateurs en les séparant par un "/"

        });



// js de mickael

document.addEventListener("DOMContentLoaded", async function () {
    const API_KEY = "f220b0b98c5eef49bb153e81d0235707";

    /* --- CAROUSEL DES BANDES-ANNONCES --- */
    const heroList = document.getElementById("hero-list");
    const heroRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr-FR&sort_by=popularity.desc`);
    const heroData = await heroRes.json();

    for (let i = 0; i < 5; i++) {
        const movie = heroData.results[i];
        const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=fr-FR`);
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(v => v.site === "YouTube" && v.type === "Trailer");

        if (!trailer) continue;

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
            <button>▶️ Regarder</button>
            </div>
        </li>
        `;
    }

    new Splide("#hero-carousel", {
        type: "fade",
        autoplay: true,
        interval: 9000,
        rewind: true,
        arrows: false,
        pagination: true,
    }).mount();

    /* ------ CAROUSEL DES AFFICHES DE FILMS ------- */
    const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr-FR&with_original_language=fr&sort_by=release_date.desc&primary_release_date.gte=2025-11-01&primary_release_date.lte=2025-11-07`;

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
            <div class="film-card">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="film-info">
                <h3>${movie.title}</h3>
                <p>📅 ${movie.release_date}</p>
                <p>⭐ ${movie.vote_average}/10</p>
            </div>
            </div>`;
                liste.appendChild(li);
            });

            new Splide("#films", {
                perPage: 4,
                gap: "1rem",
                autoplay: true,
                rewind: true,
                breakpoints: {
                    1024: { perPage: 3 },
                    768: { perPage: 2 },
                    480: { perPage: 1 },
                },
            }).mount();
        })
        .catch(error => console.error("Erreur :", error));
});
=======
    "use strict";



    //On recupere en début de script tous les objets pour acceder au DOM
    const movieImg = document.getElementById("movie-img");
    const title = document.getElementById("title");
    const date = document.getElementById("date");
    const grade = document.getElementById("grade");
    const genre  = document.getElementById("genre");
    const filmMaker = document.getElementById("film-maker");
    const actors = document.getElementById("actors-container");
    const synopsis = document.getElementById("synopsis");
    
    //On creer ensuite des variables globales qui nous serviront plus tard
    let actorsTab = [];
    let filmMakerTab = [];
    let time;
    const nbActor = 5;


    //On initialise ensuite tous les elements au chargement

    genre.textContent = "Genre: ";
    actors.textContent = "Acteurs:";
    filmMaker.textContent = "Réalisé par: ";




//fetch du fichier details.json dans lequel nous avons toutes les datas du film
    fetch('http://127.0.0.1:5500/json/details.json')
        .then(response => response.json())
        .then(data => {
console.log(data);
//Partie récupération des infos principales
            movieImg.src="https://image.tmdb.org/t/p/original/"+data.poster_path;
            time = data.runtime;
            time = " - "+Math.floor(time/60)+"h "+(time%60)+"min";
            title.textContent = data.title;
            date.textContent = data.release_date.slice(0,4);
            grade.innerHTML ='<i class="fa-solid fa-star"></i> '+data.vote_average+"/10";
            data.genres.forEach((element, index) => {   //puisque le film peut avoir plusieurs genre nous faisons une boucle for each afin de tous les récuprer et mettre en page

                if(index===(data.genres.length-1)){
                    genre.textContent += element.name+time; //On ne met pas de "/" au dernier élément
                }else{genre.textContent += element.name+"/";}
            });
            synopsis.textContent = data.overview;
        

        })


//fetch du fichier credits.json dans lequel nous avons le casting
    fetch('http://127.0.0.1:5500/json/credits.json')
        .then(response => response.json())
        .then(data => {
console.log(data);

            //Partie récupération des acteurs
            for(let i=0 ; i<nbActor ; i++){                     //On boucle pour récupérer les nbActor premiers acteurs   
                let actor = document.createElement("p");
                let character = document.createElement("p");
                let container = document.createElement("div");
                container.id = "portrait-container";
                if(i===0){                                       //On gère l'affichage du premier espacement 
                    actor.textContent = data.cast[i].name+", ";
                    actor.style.marginLeft = "4px";
                }
                else if(i===nbActor-1){                         //Dernier acteur sans la virgule
                    actor.textContent = data.cast[i].name
                }else{
                    actor.textContent = data.cast[i].name+", "; 
                }
                                                                //On ajoute le nom du personnage joué par l'acteur et on creer un element image avec sa photo
                character.textContent = data.cast[i].character;
                character.className = "actor-charact";
                actor.id = `actor${i}`;
                actor.style.paddingRight = "2px";
                actor.style.paddingLeft = "2px";
                actor.style.cursor = "pointer";
                let actorImg = document.createElement("img");
                let actorText = actor.textContent;
                actorImg.className = "actor-img";

                //On fait un evenement mouse over pour afficher la photo et le personnage joué par l'acteur
                actor.addEventListener("mouseover", ()=>{
                    
                    actorImg.src = "https://image.tmdb.org/t/p/original/"+data.cast[i].profile_path;
                    container.appendChild(actorImg);
                    container.appendChild(character);
                    actor.appendChild(container);
                    
                })
                
                //On fait un evenement mouse leave pour retirer la photo et le personnage joué par l'acteur
                actor.addEventListener("mouseleave", () => {
                   
                    actor.innerHTML = "";
                    actor.textContent = actorText;
                })
                actors.appendChild(actor);
            }

            //Partie récupération du réalisateur
            data.crew.forEach(element => {      //On cherche dans tous le json les réalisateurs
                if(element.job==="Director"){
                    filmMakerTab.push(element.name);    //On stock les noms des réalisateurs dans un tableau
                }
            });
            filmMaker.textContent += filmMakerTab.join(", "); //On affiche les réalisateurs en les séparant par un "/"

        });

>>>>>>> 39caa8b5a896a71e86cdb6847b8b79f4c8815405


