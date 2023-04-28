
async function getAllAlbums() {
  let albums = await fetch("/api/albums", {
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

async function albumDetails(album, row) {
  const actionsCell = row.insertCell();
  const detailsButton = document.createElement("button");
  detailsButton.innerText = "Details";
  detailsButton.addEventListener("click", async () => {
    const detailsTable = document.getElementById("details-table");
    if (detailsTable.getAttribute("hidden")) {
      detailsTable.removeAttribute("hidden");
      document.getElementById("table-heading-text").removeAttribute('hidden')
    }
    detailsTable.querySelector("#details-id").textContent = album._id;
    detailsTable.querySelector("#details-title").textContent = album.title;
    detailsTable.querySelector("#details-artist").textContent = album.artist;
    detailsTable.querySelector("#details-year").textContent = album.year;
  });
  actionsCell.appendChild(detailsButton);
}

const deleteButton = document.getElementById("deleteButton");
deleteButton.addEventListener("click", async (event) => {
  // event.preventDefault();
  const target = event.target;
  if (confirm("Are you sure you want to delete this album?")) {
    const row = target.parentNode.parentNode
    await getIdFrom_id(row);
    try {
      await fetch(`/api/albums/${idFrom_id}`, {
        method: "DELETE",
      });
      row.remove();
    } catch (err) {
      console.error(err.message);
    }
  }
  await getAllAlbums();
});

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
    let searchedAlbum = await fetch(`/api/albums/${title}`,
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
    } else if (searchedAlbum.status === 404) {
      res += "<p>No such Album can be found in the database!</p>"
    }
    albumArea.innerHTML = res
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

const updateButton = document.getElementById("updateButton");
let idFrom_id;
updateButton.addEventListener("click", async (event) => {
  const target = event.target;

  if (target.classList.contains("btn-update")) {
    const row = target.parentNode.parentNode;
    const cells = row.querySelectorAll("td:not(:last-child)");

    cells.forEach((cell) => {
      const text = cell.innerHTML.trim();
      cell.innerHTML = `<input type="text" value="${text}">`;
    });

    const updateBtn = row.querySelector(".btn-update");
    updateBtn.classList.remove("btn-update");
    updateBtn.classList.add("btn-save");
    updateBtn.textContent = "Save";
    return;
  }
  if (target.classList.contains("btn-save")) {
    const row = target.parentNode.parentNode;
    const cells = row.querySelectorAll("td:not(:last-child)");

    cells.forEach((cell) => {
      const text = cell.querySelector("input").value;
      cell.innerHTML = "";
      cell.textContent = text;
    });

    const saveBtn = row.querySelector(".btn-save");
    saveBtn.classList.remove("btn-save");
    saveBtn.classList.add("btn-update");
    saveBtn.textContent = "Update";

    const title = cells[1].textContent;
    const artist = cells[2].textContent;
    const year = cells[3].textContent;
    await getIdFrom_id(row)
    try {

      const upToDate = await fetch(
        `/api/albums/${idFrom_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, artist, year }),
        }
      );
      await upToDate.json();
    } catch (error) {
      console.log(error);
    }
    await getAllAlbums();
  }
});

async function getIdFrom_id(row) {
  const id = row.querySelector("#details-id").textContent;
  let albums = await fetch("/api/albums", {
    method: "GET",
    headers: { "content-type": "application/json" },
  });
  albums = await albums.json()
  albums.forEach((album) => {
    if (album._id === id) {
      idFrom_id = album.id;
    }
  });
}

const postAlbum = document.getElementById("create-album-form");
postAlbum.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value.trim();
  const artist = document.getElementById("artist").value.trim();
  const year = document.getElementById("year").value.trim();
  try {
    const response = await fetch("/api/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, artist, year }),
    });
    if (!response.ok) {
      throw new Error("Failed to create album");
    }
    await getAllAlbums();
    document.getElementById("title").value = "";
    document.getElementById("artist").value = "";
    document.getElementById("year").value = "";
  } catch (err) {
    console.error(err.message);
  }
});