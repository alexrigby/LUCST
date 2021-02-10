import fetchData from "/js/modules/universalFunctions.js";
import { cleanHru, getHru, updateHru } from "/js/modules/hru_dataFunctions.js";
import cleanPlant from "/js/modules/plantFunctions.js";
import cleanLanduse from "/js/modules/landuseFunctions.js";
import { makeSatelliteMap, shpToGeoJSON, makeStreetMap } from "/js/modules/mapFunctions.js"

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
// adding a satelite layer using function form mapFunctions
var satellite = makeSatelliteMap();
// adding a streetmap layer using function from mapFunctions
var streets = makeStreetMap().addTo(map);
//calling function from mapFunctions.js to convert the ziped shape files into geoJSON files  
// only add HRUs2 (1 is 'Actual HRUs')
var hrus = shpToGeoJSON('data/shpfiles/hru2.zip')
var rivers = shpToGeoJSON('data/shpfiles/rivs1.zip')
// adding the converted geoJSON files to the map#
hrus.addTo(map);
hrus.once("data:loaded", function () {
    console.log("finished loaded shapefile");
});

rivers.addTo(map);
rivers.once("data:loaded", function () {
    console.log("finished loaded shapefile");
});

// map layer objects 
var baseMaps = {
    "satelliet": satellite,
    "streets": streets
};

var overlayMaps = {
    "HRUs": hrus,
    "Rivers": rivers
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
            layer.setIcon(new L.Icon.Default({ className: 'selected ' }));
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