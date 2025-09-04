// Inicializar mapa
var map = L.map("map").setView([20.67, -103.35], 6);

// Capas base
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

var facilmap = L.tileLayer("https://tile.facilmap.org/{z}/{x}/{y}.png", {
  attribution: "Facilmap",
});

var mapcarta = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  attribution: "Mapcarta (via OSM HOT)",
});

var baseMaps = {
  OpenStreetMap: osm,
  Facilmap: facilmap,
  "Mapcarta (ejemplo)": mapcarta,
};

L.control.layers(baseMaps).addTo(map);

var kmzLayer = L.kmzLayer().addTo(map);

// Función subir KMZ/KML
function uploadLayer() {
  const fileInput = document.getElementById("fileUpload");
  if (fileInput.files.length === 0) return alert("Selecciona un archivo");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("/upload", { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      kmzLayer.load(data.url);
      map.fitBounds(kmzLayer.getBounds());
      loadCapas();
    });
}

// Guardar punto
document.getElementById("formPunto").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const obj = Object.fromEntries(formData.entries());
  fetch("/puntos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  }).then(() => alert("Punto guardado"));
});

// Crear usuario
document.getElementById("formUsuario").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const obj = Object.fromEntries(formData.entries());
  fetch("/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  }).then(() => alert("Usuario creado"));
});

// Cargar capas en lista
function loadCapas() {
  fetch("/capas")
    .then((res) => res.json())
    .then((capas) => {
      const div = document.getElementById("listaCapas");
      div.innerHTML = "";
      capas.forEach((c) => {
        const btn = document.createElement("button");
        btn.innerText = c.nombre;
        btn.onclick = () => kmzLayer.load(c.archivo);
        div.appendChild(btn);
      });
    });
}
loadCapas();

// Placeholder Heatmap
function showHeatmap() {
  alert("Aquí se implementaría un mapa de calor con leaflet-heatmap u otro plugin");
}
let tempMarker;

map.on("click", function (e) {
  const { lat, lng } = e.latlng;

  // Borrar marcador anterior si existe
  if (tempMarker) {
    map.removeLayer(tempMarker);
  }

  // Crear marcador en el punto seleccionado
  tempMarker = L.marker([lat, lng]).addTo(map);

  // Rellenar automáticamente el formulario
  document.querySelector("input[name='lat']").value = lat.toFixed(6);
  document.querySelector("input[name='lng']").value = lng.toFixed(6);

  // Llevar al usuario al formulario
  document.getElementById("formPunto").scrollIntoView({ behavior: "smooth" });
});
