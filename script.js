document.addEventListener("DOMContentLoaded", function (event) {
    event.preventDefault();
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));    

    if (loggedInUser) {
        let userInfo = document.createElement('div');
        userInfo.innerHTML = `
            <div class="profile-container">
                <div class="profile-icon">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="profile-info">
                    <h2>Welcome, ${loggedInUser.name}!</h2>
                </div>
            </div>
        `;
        document.body.prepend(userInfo);
        getmovies();


    } else {
        document.body.innerHTML = `<h2>No user found. Please register first.</h2>`;
    }


    let dashboard = document.getElementById('allmovies');
    let adult = document.getElementsByClassName('card-Adult');
    let genre = document.getElementsByClassName('card-Genre');
    let addmovie = document.getElementById("addmoviebtn");
    let addmovieform = document.getElementById("container");
    let closemovieform = document.querySelector(".fa-xmark");
    let submitmovie = document.getElementById("addmovie");



    function getmovies() {
      const ajax = new XMLHttpRequest();
       ajax.open('GET', 'https://mimic-server-api.vercel.app/movies')
        ajax.onload = function () {
            let data = JSON.parse(ajax.response);
              data.forEach(movie => {
                if (adult) {
                    if (adult === true) {
                        movie.adult = '<span class="age-restricted adult-18">18+</span>';
                    } else {
                        movie.adult = '<span class="age-restricted adult-16">16+</span>';
                    }
                }                
                    let genreMapping = {
                        28: "Action",
                        12: "Adventure",
                        35: "Comedy",
                        80: "Crime",
                        18: "Drama",
                        10751: "Family",
                        14: "Fantasy",
                        36: "History",
                        10749: "Romance",
                        53: "Thriller"
                    };                   
                    movie.genre_ids = movie.genre_ids.map(id => genreMapping[Number(id)] || "Unknown");
               
                dashboard.innerHTML += `
            <div class="card">
                <img src="${movie.poster_path}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text"><span>original_language:</span> ${movie.original_language}</p>
                    <p class="card-text"><span>release_date:</span> ${movie.release_date}</p>
                    <p class="card-text" style='color:red'><span>Rating:</span> <i class="fa-solid fa-star" style="color: #FFD43B;"></i>${movie.vote_average}/10</p>
                    <p class="card-Adult"><span>Adult:</span> ${movie.adult}</p>
                    <p class="card-Genre"><span>Genre:</span> ${movie.genre_ids}</p>
                    <button class="btn btn-primary><a href="#">Book</a></button>
                </div>
            </div>
            `
            }

            );

        };
        ajax.send();
    };

    getmovies();

    addmovie.addEventListener('click', function () {
        addmovieform.style.display = "block";
    });
    closemovieform.addEventListener('click', function () {
        addmovieform.style.display = "none";
    });

    function addmovies() {
        submitmovie.addEventListener('click', function (event) {
            event.preventDefault();
            const ajax = new XMLHttpRequest();
            ajax.open('POST', 'https://mimic-server-api.vercel.app/movies');
            ajax.setRequestHeader('Content-Type', 'application/json');

            let title = document.getElementById("title");
            let language = document.getElementById("language");
            let date = document.getElementById("release_date");
            let rating = document.getElementById("rating");
            let adult = document.getElementById("adult");
            let image = document.getElementById("poster");
            let selectedGenres = [...document.querySelectorAll('input[name="genre"]:checked')].map(checkbox => parseInt(checkbox.value));

            let data = {
                title: title.value,
                original_language: language.value,
                release_date: date.value,
                vote_average: parseFloat(rating.value) || 0,
                adult: adult ? adult.checked : false,
                genre_ids: selectedGenres,
                poster_path: image.value
            };

            console.log(data);
            ajax.send(JSON.stringify(data));

            addmovieform.style.display = "none";
            alert("Movie added successfully");

            let dashboard = document.getElementById("dashboard");
            if (dashboard) {
                dashboard.innerHTML = "";
            }
            getmovies();
        }
        );
    }
    addmovies();


    function searchmovie() {
        let searchbtn = document.getElementById("search-btn");
        let search= document.getElementById("search");
        searchbtn.addEventListener('click', function () {
            let searchValue = search.value.toLowerCase();
            let cards = document.getElementsByClassName("card");
            for (let i = 0; i < cards.length; i++) {
                let title = cards[i].querySelector(".card-title").innerText.toLowerCase();
                if (title.includes(searchValue)) {
                    cards[i].style.display = "block";
                } else {
                    cards[i].style.display = "none";
                }
            }
        });
    }
    searchmovie();

    function logout(){
        let logout=document.getElementById("logoutbtn");
        logout.addEventListener('click',()=>{
            alert("Logout Sucessfully.");
            window.location.href="index-sign-in.html";
        })

    }
    logout();
});
