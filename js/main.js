import fetchData from "/js/modules/universalFunctions.js";
import { cleanHru, getHru, updateHru } from "/js/modules/hru_dataFunctions.js";
import cleanPlant from "/js/modules/plantFunctions.js";
import cleanLanduse from "/js/modules/landuseFunctions.js";
import { makeSatelliteMap, shpToGeoJSON, makeStreetMap, onMapSelection } from "/js/modules/mapFunctions.js"


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
var map = L.map('map').setView([53.046775, -4.286951], 12, [streets]);
// adding a satelite layer using function form mapFunctions
var satellite = makeSatelliteMap();
// adding a streetmap layer using function from mapFunctions
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
    map.eachLayer(function (layer) {
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
    console.log(hrus)

    var hruTbody = document.querySelector("#hruTable tbody");
    addDataToTbody(hruTbody, hrus);

    lassoResult.innerHTML = layers.length ? `Selected ${layers.length} layers` : '';
}


function addDataToTbody(nl, data) { // nl -> NodeList, data -> array with objects
    data.forEach((d, i) => {
      var tr = nl.insertRow(i);
      Object.keys(d).forEach((k, j) => { // Keys from object represent th.innerHTML
        var cell = tr.insertCell(j);
        cell.innerHTML = d[k]; // Assign object values to cells   
      });
      nl.appendChild(tr);
    })
  }
  
  
  
  

// function populateTable3(data) {
//   // (B) CREATE HTML TABLE OBJECT
//   var perrow = 2, // 2 CELLS PER ROW
//       table = document.createElement("table"),
//       row = table.insertRow();

//   // LOOP THROUGH ARRAY AND ADD TABLE CELLS
//   for (var i = 0; i < data.length; i++) {
//     // ADD "BASIC" CELL
//     var cell = row.insertCell();
//     cell.innerHTML = data[i];

//     // ATTACH A RUNNING NUMBER OR CUSTOM DATA
//     // cell.dataset.id = i;
 
//     /* ATTACH ONCLICK LISTENER IF REQUIRED
//     cell.addEventListener("click", function(){
//       console.log(this.dataset.id); 
//     });
//     */

//     // BREAK INTO NEXT ROW
//     var next = i + 1;
//     if (next%perrow==0 && next!=data.length) {
//       row = table.insertRow();
//     }
//   }

//   // (C) ATTACH TABLE TO CONTAINER
//   document.getElementById("container1").appendChild(table);
// };






function populateTable(data) {
    var table = "";
    for (var i in data) {
        table += "<tr>"
        table += "<td>"
            + data [i] + "</td>"
        table += "</tr>";
    }

    document.getElementById("result").innerHTML = table;
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






