const container = document.getElementById("moviesContainer");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".filter-btn");
const genreBtns = document.querySelectorAll(".genre-btn");
const randomBtn = document.getElementById("randomBtn");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

function displayMovies(movieList) {

container.innerHTML = "";

movieList.forEach(movie => {

const card = document.createElement("div");
card.classList.add("movie-card");

card.innerHTML = ` <img src="${movie.poster}">

<div class="movie-info">
<h3 class="movie-title">${movie.title}</h3>
<p class="movie-meta">${movie.genre} • ${movie.year}</p>
<p class="movie-desc">${movie.description}</p>
</div>
`;

card.addEventListener("click", () => openModal(movie));

container.appendChild(card);

});

}

function openModal(movie) {

modal.style.display = "block";

modalBody.innerHTML = `

<div class="modal-body">
<img src="${movie.poster}">
<div class="modal-text">
<h2>${movie.title}</h2>
<p><strong>Genre:</strong> ${movie.genre}</p>
<p><strong>Year:</strong> ${movie.year}</p>
<p>${movie.description}</p>
</div>
</div>
`;

}

closeModal.addEventListener("click", () => {
modal.style.display = "none";
});

window.addEventListener("click", e => {
if(e.target === modal){
modal.style.display = "none";
}
});

displayMovies(movies);

buttons.forEach(btn => {

btn.addEventListener("click", () => {

const mood = btn.dataset.mood;

if (mood === "all") {
displayMovies(movies);
} else {
const filtered = movies.filter(movie => movie.mood === mood);
displayMovies(filtered);
}

});

});

genreBtns.forEach(btn => {

btn.addEventListener("click", () => {

const genre = btn.dataset.genre;

if (genre === "all") {
displayMovies(movies);
} else {
const filtered = movies.filter(movie => movie.genre === genre);
displayMovies(filtered);
}

});

});

search.addEventListener("input", () => {

const value = search.value.toLowerCase();

const filtered = movies.filter(movie =>
movie.title.toLowerCase().includes(value)
);

displayMovies(filtered);

});

randomBtn.addEventListener("click", () => {

const random = movies[Math.floor(Math.random() * movies.length)];
displayMovies([random]);

});
