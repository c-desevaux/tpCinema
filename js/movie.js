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

const trailerContainer = document.getElementById("trailer-container");
const smallHome = document.getElementById("small-home");

const apiKey = "42d462f5c882e0bf35326fd50db4cae6";
const urlId = new URLSearchParams(window.location.search);

//On creer ensuite des variables globales qui nous serviront plus tard
let actorsTab = [];
let filmMakerTab = [];
let time;
const nbActor = 5;

//On initialise ensuite tous les elements au chargement

genre.textContent = "Genre: ";
actors.textContent = "Acteurs:";
filmMaker.textContent = "Réalisé par: ";

let fullGrade;
let subGrade;


//fetch sur l'url qui contient les datas pour faire un search
let searchInput;


search.addEventListener("keyup", () => {

    results.innerHTML="";
    select.innerHTML="";
    searchInput=search.value;
    let urlSearch = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchInput)}&language=fr-FR`;

    fetch(urlSearch)
        .then(response => response.json())
        .then(data => {
    //console.log(data);
            data.results.forEach ((film, index) => {

                if(index<10){
                    console.log(data.results[index].title);
                    let option = document.createElement("option");
                    option.value = data.results[index].title;
                    option.innerHTML = option.value;
    console.log(option.value);
                    results.appendChild(option);
                }
                

            });
            

        })
        .catch(error => {
            console.log('Erreur lors de la recherche ', error);
        });

})




let filmId = urlId.get('id');

if(!/\d+$/.test(filmId)){
    console.log("ID de film invalide");
    window.location.href = "404.html";
}

//fetch sur l'url qui contient les datas videos dans lequel nous avons les clefs youtube des trailers

let urlVideo = `https://api.themoviedb.org/3/movie/${filmId}/videos?api_key=${apiKey}&language=fr-FR`;              //On tappe dans l'api qui a les clefs youtube des trailer

fetch(urlVideo)
    .then(response => response.json())
    .then(data => {

        if (data.results[0]) {
            let yKey = data.results[0].key;

            document.querySelectorAll(".btn-trailer").forEach(btnTrailer => {
                

                btnTrailer.addEventListener("click", () => {
                //window.open(`https://www.youtube.com/watch?v=${yKey}`, `_blank`);
                trailerContainer.innerHTML = "";
                trailerContainer.innerHTML = `
                        <iframe class="trailer"
                            src="https://www.youtube.com/embed/${yKey}?autoplay=1" 
                            frameborder="0" allowfullscreen
                            allow="autoplay; encrypted-media">
                            </iframe>
                        `;

                })
            }) 
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
        movieImg.src = "https://image.tmdb.org/t/p/original/" + data.poster_path;
        time = data.runtime;
        time = " - " + Math.floor(time / 60) + "h " + (time % 60) + "min";              //On transforme les minutes en heure minute
        title.textContent = data.title;
        date.textContent = data.release_date.slice(0, 4);
        if (data.vote_average != 0) {
            fullGrade = data.vote_average.toString();
            subGrade = fullGrade.substr(0, 3) + "/10";
            grade.innerHTML = '<i class="fa-solid fa-star"></i> ' + subGrade;
        } else { grade.innerHTML = "" }

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

        //Partie récupération des acteurs
        for (let i = 0; i < nbActor; i++) {                     //On boucle pour récupérer les nbActor premiers acteurs   
            let actor = document.createElement("p");
            let character = document.createElement("p");
            let container = document.createElement("div");
            container.id = "portrait-container";

            if (data.cast[i]) {
                if (i === 0 && (data.cast.length > 1)) {                                       //On gère l'affichage du premier espacement
                    actor.textContent = data.cast[i].name + ", ";
                    actor.style.marginLeft = "4px";
                } else if (i === nbActor - 1 || data.cast.length === 1) {                         //Dernier acteur sans la virgule

                    actor.textContent = data.cast[i].name;
                } else {
                    actor.textContent = data.cast[i].name + ", ";
                }
                //On ajoute le nom du personnage joué par l'acteur et on creer un element image avec sa photo
                if (data.cast[i].character === "") {
                    character.textContent = data.cast[i].name;
                } else { character.textContent = data.cast[i].character; }

                character.className = "actor-charact";
                actor.id = `actor${i}`;
                actor.style.paddingRight = "2px";
                actor.style.paddingLeft = "2px";
                actor.style.textDecoration = "underline";
                actor.style.cursor = "pointer";
                let actorImg = document.createElement("img");
                let actorText = actor.textContent;
                actorImg.className = "actor-img";

                //On fait un evenement mouse over pour afficher la photo et le personnage joué par l'acteur
                actor.addEventListener("mouseover", () => {
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
            }else{
                //actors.innerHTML="";
                break;
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



smallHome.addEventListener("click", () => {
    window.location.href = "../index.html";
});



