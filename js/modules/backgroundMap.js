//ADDS BACKGROUND MAP TILES TO LEAFLET MAP

// backgroundMap('mapboxId')

export function backgroundMap(mapboxId) {
    return L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: mapboxId,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWxleHJpZ2J5IiwiYSI6ImNra3V6ZHUxdjRkdGIycHF0OWY2MmY1MGoifQ.huw3PRhwLPINPzih4CGrhQ'
    });
}

export default {
    backgroundMap
}