
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

window.addEventListener("load", () => {
  getAllAlbums();
});


