"use strict"


//On recupere en début de script tous les objets pour acceder au DOM
const movieImg = document.getElementById("movie-img");
const title = document.getElementById("title");
const date = document.getElementById("date");
const grade = document.getElementById("grade");
const genre = document.getElementById("genre");
const filmMaker = document.getElementById("film-maker");
const actors = document.getElementById("actors-container");
const synopsis = document.getElementById("synopsis");
const search = document.getElementById("search");
const results = document.getElementById("results");
const select = document.createElement("select");
const btnTrailer = document.getElementsByClassName("btn-trailer");

const trailerContainer = document.getElementById("trailer-container");
const smallHome = document.getElementById("small-home");

const apiKey = "42d462f5c882e0bf35326fd50db4cae6";
const urlId = new URLSearchParams(window.location.search);

//On creer ensuite des variables globales qui nous serviront plus tard
let actorsTab = [];
let filmMakerTab = [];
let time;
let nbActor = 5;

//On initialise ensuite tous les elements au chargement

genre.textContent = "Genre: ";
actors.textContent = "Acteurs:";
filmMaker.textContent = "Réalisé par: ";

let fullGrade;
let subGrade;


//fetch sur l'url qui contient les datas pour faire un search
let searchInput = search.value;

results.innerHTML="";

if(searchInput===""){
    
    results.style.visibility = "hidden";
}

search.addEventListener("keyup", () => {            //La fonction se déclanche au relachement de n'importe quelle touche

    results.style.visibility = "visible";
    results.innerHTML="";                           //On vide les resultats au cas où il en restait
    
    searchInput=search.value;                       //On recupere la valeur de l'input
    let urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchInput)}&language=fr-FR`;

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


let filmId = urlId.get('id');                   //On recupere l'id de l'url qui a été appelé

if(!/\d+$/.test(filmId)){                       //Avec un regEx on regarde si l'id est valide a savoir un nombre
    console.log("ID de film invalide");         
    window.location.href = "404.html";          //Si ce n'est pas le cas on revoit une erreru et chargeons la page erreur 404
}

//fetch sur l'url qui contient les datas videos dans lequel nous avons les clefs youtube des trailers

let urlVideo = `https://api.themoviedb.org/3/movie/${filmId}/videos?api_key=${apiKey}&language=fr-FR`;              //On tappe dans l'api qui a les clefs youtube des trailer

fetch(urlVideo)
    .then(response => response.json())
    .then(data => {

        if(data.results[0]){

            let yKey = data.results[0].key;                     //On recupere la clefs qui va nous permetre de construire l'url pour youtube

            document.querySelectorAll(".btn-trailer").forEach(btnTrailer => {       //On parcours les deux btn-trailer (l'un visible en desktop et l'autre en mobile)
                

                btnTrailer.addEventListener("click", () => {                        //Si on click on remplace le bouton par le trailer
                //window.open(`https://www.youtube.com/watch?v=${yKey}`, `_blank`);
                trailerContainer.innerHTML = "";
                trailerContainer.innerHTML = `
                        <iframe class="trailer mb-5"
                            src="https://www.youtube.com/embed/${yKey}?autoplay=1" 
                            frameborder="0" allowfullscreen
                            allow="autoplay; encrypted-media">
                            </iframe>
                        `;

                })
            }) 
        }else{
            trailerContainer.innerHTML="";
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des vidéos :', error);
    });

let urlDetails = `https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}&language=fr-FR`;

//fetch du fichier details.json dans lequel nous avons toutes les datas du film
fetch(urlDetails)
    .then(response => response.json())
    .then(data => {
//console.log(data);

        //Partie récupération des infos principales
        if(data.poster_path){
            movieImg.src = "https://image.tmdb.org/t/p/original/" + data.poster_path;          //On recherche l'image du poster
        }else{
            movieImg.href="ressources/poster_missing.png";
        }
        
        time = data.runtime;
        time = " - " + Math.floor(time / 60) + "h " + (time % 60) + "min";              //On transforme les minutes en heure minute
        title.textContent = data.title;
        date.textContent = data.release_date.slice(0, 4);

        if (data.vote_average != 0) {                                               //Si la note est superieur a 0 on affiche la note tronqué au dixieme
            fullGrade = data.vote_average.toString();           
            subGrade = fullGrade.substr(0, 3) + "/10";
            grade.innerHTML = '<i class="fa-solid fa-star"></i> ' + subGrade;

        } else { grade.innerHTML = '<i class="fa-solid fa-star"></i> Non-noté' }       //Sinon on affiche que le film n'est pas encore noté

        if (data.genres.length > 0) {
            data.genres.forEach((element, index) => {   //puisque le film peut avoir plusieurs genre nous faisons une boucle for each afin de tous les récuprer et mettre en page

                if (index === (data.genres.length - 1)) {
                    genre.textContent += element.name + time; //On ne met pas de "/" au dernier élément
                } else { genre.textContent += element.name + "/"; }
            });
        } else { genre.innerHTML = ""; }

        synopsis.textContent = data.overview;
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des détails du film :', error);
        window.location.href = "404.html";
    });

let urlCredits = `https://api.themoviedb.org/3/movie/${filmId}/credits?api_key=${apiKey}&language=fr-FR`;
//fetch du fichier credits.json dans lequel nous avons le casting
fetch(urlCredits)
    .then(response => response.json())
    .then(data => {

//console.log(data);

        if(data.cast.length<nbActor){                       //On reajuste le no;bre d'acteur a afficher en fonction du film
            nbActor=data.cast.length;
        }
        if(nbActor===0){                                    //Si aucun acteur n'est renseigné dans l'api on enleve cette ligne
            actors.innerHTML="";    
        }
        if(nbActor===1){
            actors.textContent="Acteur:  ";

        }

        //Partie récupération des acteurs
        for (let i = 0; i < nbActor; i++) {                     //On boucle pour récupérer les nbActor premiers acteurs   
            let actor = document.createElement("p");
            let character = document.createElement("p");
            let container = document.createElement("div");
            container.id = "portrait-container";
            
            
            if (data.cast.length>=1) {
                if (i === 0 && (data.cast.length > 1)) {                 //On gère l'affichage du premier espacement
                    actor.textContent = data.cast[i].name + ", ";
                    actor.style.marginLeft = "4px";
                } else if(i === 0 && data.cast.length === 1){
                    actor.textContent = data.cast[i].name;
                    actor.style.marginLeft = "4px";
                }else if (i === nbActor - 1) {                         //Dernier acteur sans la virgule

                    actor.textContent = data.cast[i].name;
                } else {
                    actor.textContent = data.cast[i].name + ", ";
                }
                //On ajoute le nom du personnage joué par l'acteur et on creer un element image avec sa photo
                if (data.cast[i].character === "") {
                    character.textContent = data.cast[i].name;
                } else { character.textContent = data.cast[i].character; }

                //On defini le style du portrait de l'acteur
                character.className = "actor-charact";
                actor.id = `actor${i}`;
                actor.style.paddingRight = "2px";
                actor.style.paddingLeft = "2px";
                actor.style.textDecoration = "underline";
                actor.style.cursor = "pointer";
                let actorImg = document.createElement("img");
                let actorText = actor.textContent;
                actorImg.className = "actor-img";

                //On fait un evenement mouse over pour afficher la photo et le personnage joué par l'acteur qui va nous servir pour la version desktop
                actor.addEventListener("mouseover", () => {
                    if (data.cast[i].profile_path) {
                        actorImg.src = "https://image.tmdb.org/t/p/original/" + data.cast[i].profile_path;
                    } else { actorImg.src = "ressources/unknown_person.jpg"; }

                    container.appendChild(actorImg);
                    container.appendChild(character);
                    actor.appendChild(container);

                })

                //On refait la meme fonction mais cette fois ci pour le click, ce qui va nous servir pour la version mobile
                actor.addEventListener("click", () => {
                    if (data.cast[i].profile_path) {
                        actorImg.src = "https://image.tmdb.org/t/p/original/" + data.cast[i].profile_path;
                    } else { actorImg.src = "../ressources/unknown_person.jpg"; }

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
        }


        //Partie récupération du réalisateur

        data.crew.forEach(element => {      //On cherche dans tous le json les réalisateurs
            if (element.job === "Director") {
                filmMakerTab.push(element.name);    //On stock les noms des réalisateurs dans un tableau
            }
        });
        if (filmMakerTab.length < 1) {
            filmMaker.innerHTML = "";
        } else {
            filmMaker.textContent += filmMakerTab.join(", "); //On affiche les réalisateurs en les séparant par un "/"
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des crédits du film :', error);
    });

//Bouton home du menu mobile rechqrge la page index

smallHome.addEventListener("click", () => {
    window.location.href = "index.html";
});



