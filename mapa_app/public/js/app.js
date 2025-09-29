

// --- 1. Inicialización del Mapa ---
// Inicializa el mapa centrado en México.
var map = L.map("map").setView([23.6345, -102.5528], 6);

// --- 2. Capas Base ---
// Capa base principal de OpenStreetMap.
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Capas de Google (se mantienen como opciones).
var googleStreets = L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
});

var googleSatellite = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
});

var googleHybrid = L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
});

var googleTerrain = L.tileLayer("http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
});

// ---- Capas Google Mutant ----
//var googleRoadmap = L.gridLayer.googleMutant({
//  type: "roadmap"
//});

//var googleTraffic = L.gridLayer.googleMutant({
//  type: "roadmap"
//});

//googleTraffic.addGoogleLayer("TrafficLayer");


// Capa de clima (requiere tu API KEY de OpenWeatherMap).
var weatherLayer = L.tileLayer(
    "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=TU_API_KEY",
    { attribution: "Map data © OpenWeatherMap" }
);

// --- 3. Control de Capas ---
// Objeto que contiene las capas base para el control.
var baseMaps = {
    "OpenStreetMap": osm,
    "Google Streets": googleStreets,
    "Google Satélite": googleSatellite,
    "Google Híbrido": googleHybrid,
    "Google Terreno": googleTerrain
  //  "Google Roadmap": googleRoadmap
};

// Objeto que contiene las capas superpuestas.
var overlayMaps = {
    "Clima (Temperatura)": weatherLayer
  //   "Tráfico (Google)": googleTraffic
};

// Añade el control de capas al mapa.
L.control.layers(baseMaps, overlayMaps).addTo(map);

// --- 4. Barra de Búsqueda con Geocodificación Global ---
// Capa para almacenar los marcadores de resultados de búsqueda.
var markersLayer = L.layerGroup().addTo(map);

// Inicialización del control de búsqueda.
var searchControl = new L.Control.Search({
    // Configuración para usar el servicio de geocodificación de Nominatim.
    url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
    jsonpParam: 'json_callback',
    propertyName: 'display_name', // Propiedad del JSON de respuesta con el nombre del lugar.
    propertyLoc: ['lat', 'lon'],  // Propiedades con la latitud y longitud.

    // Configuración de la visualización del resultado.
    marker: L.circleMarker([0,0], {radius: 20, color: '#e03'}), // Marcador temporal para el resultado.
    autoCollapse: true,
    autoType: false,
    minLength: 2,
    zoom: 12,
    firstTipSubmit: true // Selecciona el primer resultado al presionar Enter.
});

// Evento que se activa cuando se encuentra una ubicación.
searchControl.on('search:locationfound', function(e) {
    markersLayer.clearLayers(); // Limpia marcadores de búsquedas anteriores.
    
    // Crea un popup en la ubicación encontrada con el nombre del lugar.
    L.popup()
        .setLatLng(e.latlng)
        .setContent(e.text)
        .openOn(map);
});

// Añade el control de búsqueda al mapa.
map.addControl(searchControl);

// --- 5. Funcionalidad Existente ---
function uploadLayer() {
    const input = document.getElementById("fileUpload");
    if (input.files.length === 0) {
        alert("Selecciona un archivo KML/KMZ");
        return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const kmzParser = new L.KMZParser();
        kmzParser.on("loaded", function(layer) {
            map.addLayer(layer);
            map.fitBounds(layer.getBounds());
        });
        kmzParser.parse(e.target.result);
    };
    reader.readAsArrayBuffer(file);
}

function showHeatmap() {
    alert("Funcionalidad de mapa de calor en desarrollo");
}