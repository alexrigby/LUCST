import fetchData from "/js/modules/universalFunctions.js";
import { cleanHru, getHru, updateHru } from "/js/modules/hru_dataFunctions.js";
import cleanPlant from "/js/modules/plantFunctions.js";
import cleanLanduse from "/js/modules/landuseFunctions.js";
import   shpToGeoJSON   from "/js/modules/mapFunctions.js"

// hru-data.hru:
// Fetch unclean dataset...
fetchData('/data/TxtInOut/hru-data.hru')
    .then(data => {
        // Clean the dataset...
        const cleanHruData = cleanHru(data);
        // Saving a copy of the dataset
        const cleanHruDataCopy = [...cleanHruData];

        console.log(updateHru(cleanHruDataCopy, 2, 'rnge_lum'))
    });


// landuse.lum:
// Fetch unclean dataset...
fetchData('/data/TxtInOut/landuse.lum')
    .then(data => {
        // Clean the dataset...
        const cleanLanduseData = cleanLanduse(data);
        // Saving a copy of the dataset
        const cleanLanduseDataCopy = [...cleanLanduseData];

        // Do something with the result...
        console.log(cleanLanduseDataCopy);
    });


// plant.ini:
// Fetch unclean dataset...
fetchData('/data/TxtInOut/plant.ini')
    .then(data => {
        // Clean the dataset...
        const cleanPlantData = cleanPlant(data);
        // Saving a copy of the dataset
        const cleanPlantDataCopy = [...cleanPlantData];

        // Do something with the result...
        console.log(cleanPlantDataCopy);
    });




// leaflet.js

// Initialize the map and set its view to chosen coordinates, zoom, default layers
var map = L.map('map').setView([53.046775, -4.286951], 13, [streets]);
// adding a satelite layer
var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxleHJpZ2J5IiwiYSI6ImNra3V6ZHUxdjRkdGIycHF0OWY2MmY1MGoifQ.huw3PRhwLPINPzih4CGrhQ'
});
// adding a streetmap layer
var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxleHJpZ2J5IiwiYSI6ImNra3V6ZHUxdjRkdGIycHF0OWY2MmY1MGoifQ.huw3PRhwLPINPzih4CGrhQ'
}).addTo(map);




//calling function from mapFunctions.js to convert the ziped shape files into geoJSON files  
// only add HRUs2 (1 is 'Actual HRUs')
var shpfile1 = shpToGeoJSON('data/shpfiles/hru2.zip')
var shpfile2= shpToGeoJSON('data/shpfiles/rivs1.zip')

// adding the converted geoJSON files to the map#

shpfile1.addTo(map);
shpfile1.once("data:loaded", function () {
  console.log("finished loaded shapefile");
});


shpfile2.addTo(map);
shpfile2.once("data:loaded", function () {
  console.log("finished loaded shapefile");
});



// map layer objects 
var baseMaps = {
    "satelliet": satellite,
    "streets": streets
};

var overlayMaps = {
    "HRUs":shpfile1,
    "Rivers":shpfile2 
};


//leaflets.js function to add layers to map with a drop down selection list
L.control.layers(baseMaps, overlayMaps).addTo(map);

// using lasso plugin to select shapfile/hrus
//const mapElement = document.querySelector('#map');
        //const toggleLasso = document.querySelector('#toggleLasso');
        const contain = document.querySelector('#contain');
        const intersect = document.querySelector('#intersect');
        const lassoEnabled = document.querySelector('#lassoEnabled');
        const lassoResult = document.querySelector('#lassoResult');
// adds lasso toggle button to map
const lassoControl = L.control.lasso().addTo(map);
       

        function resetSelectedState() {
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    layer.setIcon(new L.Icon.Default());
                } else if (layer instanceof L.Path) {
                    layer.setStyle({ color: '#3388ff' });
                }
            });

            lassoResult.innerHTML = '';
        }

        function setSelectedLayers(layers) {
            resetSelectedState();
            layers.forEach(layer => {
                if (layer instanceof L.Marker) {
                    layer.setIcon(new L.Icon.Default({ className: 'selected '}));
                } else if (layer instanceof L.Path) {
                    layer.setStyle({ color: '#ff4620' });
                }
            });

            lassoResult.innerHTML = layers.length ? `Selected ${layers.length} layers` : '';
        }
//reset selection when mouse is pressed
        map.on('mousedown', () => {
            resetSelectedState();
        });
//select layers once lasso is drawn
        map.on('lasso.finished', event => {
            setSelectedLayers(event.layers);
        });
//writes 'enabled' to signify lasso enabled
        map.on('lasso.enabled', () => {
            lassoEnabled.innerHTML = 'Enabled';
            resetSelectedState();
        });
//writes 'dissabled' to signify lasso disabled
        map.on('lasso.disabled', () => {
            lassoEnabled.innerHTML = 'Disabled';
        });
//activates toggle Lasso button 
        // toggleLasso.addEventListener('click', () => {
        //     if (lassoControl.enabled()) {
        //         lassoControl.disabled();
        //     } else {
        //         lassoControl.enabled();
        //     }
        // });
 //gets lasso button to 'listen' for selection type 'contain'       
        contain.addEventListener('change', () => {
            lassoControl.setOptions({ intersect: intersect.checked });
        });
//gets lasso button to 'listen' for selcetion type 'intersect'
        intersect.addEventListener('change', () => {
            lassoControl.setOptions({ intersect: intersect.checked });
        });