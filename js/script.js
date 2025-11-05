document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "https://api.themoviedb.org/3/discover/movie?api_key=f220b0b98c5eef49bb153e81d0235707&language=fr-FR&with_original_language=fr&sort_by=release_date.desc&primary_release_date.gte=2025-11-01&primary_release_date.lte=2025-11-07";

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const liste = document.getElementById("liste-film");
            liste.innerHTML = "";

            data.results.forEach(movie => {
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

            // Lancer le carrousel après avoir ajouté les films
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