let title = document.querySelector(".post-title");
let description = document.querySelector(".post-description");
let gif = document.querySelector("#post-gif");
let form = document.querySelector(".create-post");
let gallery = document.querySelector(".gifs");
let gif_search = document.querySelector("#gif-search");
let gif_reset = document.querySelector("#gif-reset");
let selectedGif;

window.onload = initLoad;

let loaded = false;
function initLoad() {
  fetch("http://localhost:4000/")
    .then((res) => res.json())
    .then((data) => {
      try {
        let templateData = data;
        let template = Handlebars.compile(
          document.querySelector("#template--all").innerHTML
        );
        console.log(templateData);
        let filled = template(templateData);
        document.querySelector(".cards--container").innerHTML = filled;
        loaded = true;
      } catch (e) {
        alert(e);
      }
    });
}

getTrending();
function getTrending() {
  fetch(
    "https://api.giphy.com/v1/gifs/trending?api_key=8PiyixOfCPFFExgTLW5347Y8xbuMoYGk&limit=25&rating=g"
  )
    .then((res) => {
      return res.json();
    })
    .then(({ data }) => {
      data.forEach((gif) => {
        let image = document.createElement("img");
        image.src = gif.images["fixed_height_small"].url;
        image.classList.add("gif-image");
        gallery.append(image);
      });
      addGifHandlers();
    })
    .catch((error) => {
      alert("Error: ", error);
    });
}

gif_search.addEventListener("click", fetchGifs);

function fetchGifs() {
  gallery.innerHTML = "";
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=8PiyixOfCPFFExgTLW5347Y8xbuMoYGk&q=${userGif}&limit=25&offset=0&rating=g&lang=en`
  )
    .then((res) => {
      return res.json();
    })
    .then(({ data }) => {
      data.forEach((gif) => {
        let image = document.createElement("img");
        image.src = gif.images["fixed_height_small"].url;
        image.classList.add("gif-image");
        gallery.append(image);
      });
      addGifHandlers();
    })
    .catch((error) => {
      alert("Error: ", error);
    });
}

gif_reset.addEventListener("click", resetSearch);

function resetSearch() {
  gallery.innerHTML = "";
  getTrending();
  gif.value = "";
}

// Form Submit
form.addEventListener("submit", returnUserInput);

function returnUserInput(e) {
  e.preventDefault();
  let userTitle = title.value;
  let userDescription = description.value;
  userObject.push(userTitle);
  userObject.push(userDescription);
  if (!selectedGif) {
    return alert("Must Select a valid GIF");
  }
  let data = {
    title: userTitle,
    content: userDescription,
    giphy: selectedGif.src,
  };
  fetch("http://localhost:4000/create", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log("Error:", e);
      alert("Error: ", e);
    });
  // location.reload();
}

// Looping thorugh all gifs to handle selection

function addGifHandlers() {
  let selected = false;

  let gif_images = document.querySelectorAll(".gif-image");
  gif_images.forEach((gif) => {
    gif.addEventListener("click", () => {
      if (!selected) {
        selected = true;
        selectedGif = gif;
        selectedGif.style.border = "3px solid red";
      } else {
        selectedGif.style.border = "none";
        selectedGif = gif;
        selectedGif.style.border = "3px solid red";
      }
    });
  });
}

// module.exports = { userObject };
module.exports = { loaded };
