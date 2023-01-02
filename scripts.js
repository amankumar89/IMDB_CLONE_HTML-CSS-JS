// to get all the movies into the home page
const BASE_URL = `https://api.themoviedb.org/3`;

// api key of TMDB API
const API_KEY = `api_key=49e3be45df1c1a483b5eb9560e3c73ab`;

// TO GET ALL THE MOVIES FOR THE HOME PAGE
const API_URL = `${BASE_URL}/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;

// for searching the single movie
const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;

//this is the image url of Api
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
let moviesContainer = document.getElementById("movies-lists");
const form = document.getElementById("search-movies");
const search = document.getElementById("search");
const favoritePage = document.getElementById("fav");
const favButtonContainer = document.getElementsByClassName("fav-btn");
let favoriteMovies = [];

// get all movies funtion
getMovies(API_URL);

// getting full path of image
function getImageUrl(path) {
  if (IMAGE_URL + path === "https://image.tmdb.org/t/p/w500null") {
    return `https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`;
  }
  return IMAGE_URL + path;
}

// first time all movie will display at home page
function getMovies(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => loadMoviesToContainer(data.results))
    .catch((err) => console.log("error in fetching the movies"));
}

// load the main container with movie list
function loadMoviesToContainer(movieList) {
  moviesContainer.innerHTML = "";
  movieList.forEach((movie) => {
    const { title, vote_average, poster_path, overview } = movie;

    document.getElementById("heading").innerHTML = `<h2>All Movies</h2>`;
    singleMovie = document.createElement("div");
    singleMovie.classList.add("movie");

    singleMovie.innerHTML = `
   <img
          src="${getImageUrl(poster_path)}"
          alt="movie-poster"
        />
        <div class="movie-info">
          <h4>${title}</h4>
          <span class="rating">&#11088;${vote_average}</span>
        </div>
        <div class="movie-plot"><span>Plot :- </span>
          ${overview}
          <button class="fav-btn" id="fav-btn" onclick=addToFavorite(${
            movie.id
          })>Add to Favorite</button>
        </div>`;
    //  now append this upcoming html in singleMovie Container
    moviesContainer.appendChild(singleMovie);
  });
  for (let index = 0; index < favButtonContainer.length; index++) {
    favButtonContainer[index].addEventListener("click", () => {
      // let favBtn = document.getElementById("fav-btn");
      favButtonContainer[index].innerText = "Unfavorite";
      favButtonContainer[index].classList.add("fav-btn-clicked");
    });
  }

  const allMovie = document.querySelectorAll("img");
  for (let i = 0; i < allMovie.length; i++) {
    allMovie[i].addEventListener("click", () => {
      const singleMovie = allMovie[i];
      showSingleMovie(singleMovie);
    });
  }
}

function showSingleMovie(movie) {
  console.log(movie.children);
  moviesContainer.innerHTML = "";
}

// adding single movie to favorite
function addToFavorite(movieId) {
  favoriteMovies.push({ id: movieId });

  const newMovieList = favoriteMovies.filter((obj, index) => {
    return index === favoriteMovies.findIndex((o) => obj.id === o.id);
  });

  localStorage.setItem("movies", JSON.stringify(newMovieList));
}

// fetching the favorite movie by the id
async function fetchFavMovie(id) {
  const url = BASE_URL + "/movie/" + id + "?" + API_KEY;

  const response = await fetch(url);
  let movie = await response.json();

  const { title, vote_average, poster_path, overview } = movie;

  singleMovie = document.createElement("div");
  singleMovie.classList.add("movie");
  singleMovie.innerHTML = `
   <img
          src="${getImageUrl(poster_path)}"
          alt="movie-poster"
        />
        <div class="movie-info">
          <h4>${title}</h4>
          <span class="rating">&#11088;${vote_average}</span>
        </div>
        <div class="movie-plot"><span>Plot :- </span>
          ${overview}
          <button class="fav-btn-clicked" onclick=removeFromFavorite(${
            movie.id
          })>Unfavorite</button>
        </div>`;
  //  now append this upcoming html in singleMovie Container
  moviesContainer.appendChild(singleMovie);
}

function removeFromFavorite(id) {
  favoriteMovies = JSON.parse(localStorage.getItem("movies"));
  const newMovieList = favoriteMovies.filter((movie) => {
    return movie.id !== id;
  });

  favoriteMovies = newMovieList;
  localStorage.setItem("movies", JSON.stringify(favoriteMovies));
  showFavorite(favoriteMovies);
}

// show favorite when click on favorite button
function showFavorite(favoriteMovies) {
  moviesContainer.innerHTML = "";
  document.getElementById("heading").innerHTML = `<h2>Favorites</h2>`;
  if (favoriteMovies.length === 0) return;
  for (const movie of favoriteMovies) {
    fetchFavMovie(movie.id);
  }
}

// handling for not to refresh the page
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

// for every key stroke it will work
search.addEventListener("input", function (e) {
  const searchedMovie = search.value;

  if (search.value.length <= 0) getMovies(API_URL);
  else getMovies(SEARCH_URL + "&query=" + searchedMovie);
});

// to print in favorite page
favoritePage.addEventListener("click", () => {
  // getting data from local storage
  favoriteMovies = JSON.parse(localStorage.getItem("movies"));
  showFavorite(favoriteMovies);
});

// reload the page when click on the brand logo
document.getElementById("logo").addEventListener("click", () => {
  localStorage.setItem("movies", JSON.stringify(favoriteMovies));
  getMovies(API_URL);
});
