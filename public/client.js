
async function getAllAlbums() {
  let albums = await fetch("http://localhost:3000/api/albums", {
    method: "GET",
    headers: { "content-type": "application/json" },
  });
  albums = await albums.json();
  const table = document.getElementById("album-table").querySelector("tbody");
  table.innerHTML = "";
  albums.forEach((album) => {
    const row = table.insertRow();
    row.insertCell().innerText = album.id;
    row.insertCell().innerText = album.title;
    row.insertCell().innerText = album.artist;
    row.insertCell().innerText = album.year;
    albumDetails(album, row);
  });
}

async function createAlbumCollapse() {
  let coll = document.getElementsByClassName("createButton");
  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}

const searchButton = document.getElementById("searchButton");
const searchTitle = document.getElementById("searchTitle");
const albumArea = document.querySelector(".albumArea");
async function searchByTitle() {
  try {
    const title = searchTitle.value;
    let searchedAlbum = await fetch(`http://localhost:3000/api/albums/${title}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let res = `<h3>Searched by Title: "${title}"</h3>`;
    if (title == "") {
      return;
    } else if (searchedAlbum.status === 404){
      res+="<p>No such Album can be found in the database!</p>"
    }
    albumArea.innerHTML=res
    searchedAlbum = await searchedAlbum.json();
    if (searchedAlbum == undefined) {
      res += "<p>Album not found</p>";
      albumArea.innerHTML = res;
      return;
    }
    const searchByTitleTable = document.getElementById("searched-table");
    let hidden = searchByTitleTable.getAttribute("hidden")
    if (hidden) {
      searchByTitleTable.removeAttribute("hidden");
    }
    searchByTitleTable.querySelector("tbody").innerHTML = "";
    searchedAlbum.forEach((album) => {
      const row = searchByTitleTable.querySelector("tbody").insertRow();
      row.insertCell().innerText = album.id;
      row.insertCell().innerText = album.title;
      row.insertCell().innerText = album.artist;
      row.insertCell().innerText = album.year;
    })
  } catch (error) {
    console.log(error);
  }
}

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  searchByTitle()
});


window.addEventListener("load", () => {
  getAllAlbums();
  createAlbumCollapse()
});
