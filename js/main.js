import fetchData from "/js/modules/universalFunctions.js";
import { populateTable, cleanHru, getHru, updateHru } from "/js/modules/hru_dataFunctions.js";
import cleanPlant from "/js/modules/plantFunctions.js";
import {cleanLanduse, getLanduseTypes} from "/js/modules/landuseFunctions.js";
import { makeSatelliteMap, shpToGeoJSON, makeStreetMap, onMapSelection } from "/js/modules/mapFunctions.js"
// import plantTypes from "Types/plantTypes";

// hru-data.hru:
// Fetch unclean dataset...
fetchData('/data/TxtInOut/hru-data.hru')
    .then(data => {
        // Clean the dataset...
        const cleanHruData = cleanHru(data);
        // Saving a copy of the dataset
        const cleanHruDataCopy = [...cleanHruData];

        // Replace this with a state management solution
        window.LLYFNIData = [...cleanHruData];
         
        console.log(cleanHruDataCopy)
    });


// landuse.lum:
// Fetch unclean dataset...
fetchData('/data/TxtInOut/landuse.lum')
    .then(data => {
        const cleanLanduseData = cleanLanduse(data);
        const cleanLanduseDataCopy = [...cleanLanduseData];

        console.log(cleanLanduseDataCopy);

        const landuseTypes = getLanduseTypes(cleanLanduseData);

        window.LLYFNILanduse = [...landuseTypes];
    });


// plant.ini:
// Fetch unclean dataset...
fetchData('/data/TxtInOut/plant.ini')
    .then(data => {
        const cleanPlantData = cleanPlant(data);
        const cleanPlantDataCopy = [...cleanPlantData];
        console.log(cleanPlantDataCopy);
    });




// leaflet.js
// Initialize the map and set its view to chosen coordinates, zoom, default layers
var map = L.map('map').setView([53.046775, -4.286951], 12, [streets]);
var satellite = makeSatelliteMap();
var streets = makeStreetMap().addTo(map);
//calling function from mapFunctions.js to convert the ziped shape files into geoJSON files  
// only add HRUs2 (1 is 'Actual HRUs')
var hrus = shpToGeoJSON('data/shpfiles/hru2.zip', { color: 'red' })
var rivers = shpToGeoJSON('data/shpfiles/rivs1.zip')
// adding the converted geoJSON files to the map#
hrus.addTo(map);
hrus.once("data:loaded", function () {
    hrus.setStyle({ color: '#b0c4de', weight: 1.5 })
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
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            layer.setIcon(new L.Icon.Default());
        } else if (layer instanceof L.Path) {
            layer.setStyle({ color: '#b0c4de' });
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

    var hrus = onMapSelection(layers)

    populateTable(hrus)
    console.log(hrus)
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
    lassoEnabled.innerHTML = 'Selection Enabled';
    resetSelectedState();
});
//writes 'dissabled' to signify lasso disabled
map.on('lasso.disabled', () => {
    lassoEnabled.innerHTML = 'SelectionDisabled';
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






