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

    /* ------ CAROUSEL DES AFFICHES DE FILM ------- */
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
