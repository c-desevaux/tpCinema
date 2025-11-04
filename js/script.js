    "use strict";

    //On recupere en début de script tous les objets pour acceder au DOM
    const movieImg = document.getElementById("movie-img");
    const title = document.getElementById("title");
    const date = document.getElementById("date");
    const grade = document.getElementById("grade");
    const genre  = document.getElementById("genre");
    const filmMaker = document.getElementById("film-maker");
    const actors = document.getElementById("actors");
    const synopsis = document.getElementById("synopsis");
    
    const nbActor = 4;


    //On initialise ensuite tous les elements au chargement

    genre.textContent = "Genre: ";
    actors.textContent = "Acteurs: ";


//fetch du fichier credits.json dans lequel nous avons le casting
    fetch('http://127.0.0.1:5500/json/credits.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);


            for(let i=0 ; i<nbActor ; i++){
                if(i===nbActor-1){
                    actors.textContent += data.cast[i].name;
                }else{
                    actors.textContent += data.cast[i].name+", ";
                }
                
            }

        })

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

