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
    
    let actorsTab = [];
    const nbActor = 5;


    //On initialise ensuite tous les elements au chargement

    genre.textContent = "Genre: ";
    actors.textContent = "Acteurs:";


//fetch du fichier credits.json dans lequel nous avons le casting
    fetch('http://127.0.0.1:5500/json/credits.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            
            for(let i=0 ; i<nbActor ; i++){
                let actor = document.createElement("p");
                if(i===0){
                    actor.textContent = data.cast[i].name+", ";
                    actor.style.marginLeft = "5px";
                }
                else if(i===nbActor-1){
                    actor.textContent = data.cast[i].name
                }else{
                    actor.textContent = data.cast[i].name+", ";
                }
                
                actor.id = `actor${i}`;
                actor.style.paddingRight = "3px";
                actor.style.paddingLeft = "3px";
                actor.style.cursor = "pointer";
                let actorImg = document.createElement("img");
                let actorText = actor.textContent;
                actorImg.className = "actor-img";
                actor.addEventListener("mouseover", ()=>{
                    
                    actorImg.src = "https://image.tmdb.org/t/p/original/"+data.cast[i].profile_path;
                    actor.appendChild(actorImg);
                })
                
                actor.addEventListener("mouseleave", () => {
                   
                    actor.innerHTML = "";
                    actor.textContent = actorText;
                })
                actors.appendChild(actor);
            }

        });

//fetch du fichier details.json dans lequel nous avons toutes les datas du film
    fetch('http://127.0.0.1:5500/json/details.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            movieImg.src="https://image.tmdb.org/t/p/original/"+data.poster_path;
            title.textContent = data.title;
            date.textContent = data.release_date.slice(0,4);
            grade.innerHTML ='<i class="fa-solid fa-star"></i> '+data.vote_average+"/10";
            data.genres.forEach((element, index) => {   //puisque le film peut avoir plusieurs genre nous faisons une boucle for each afin de tous les récuprer et mettre en page

                if(index===(data.genres.length-1)){
                    genre.textContent += element.name; //On ne met pas de "/" au dernier élément
                }else{genre.textContent += element.name+"/";}
            });
            synopsis.textContent = data.overview;
        

        })

