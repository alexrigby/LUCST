import fetchData from "/js/modules/universalFunctions.js";
import { populateTable, cleanHru, getHru, updateHru } from "/js/modules/hru_dataFunctions.js";
import { getPlantOptions, cleanPlant, newPlantType  } from "/js/modules/plantFunctions.js";
import { cleanLanduse, getLanduseTypes, landuseTypes } from "/js/modules/landuseFunctions.js";
import { makeSatelliteMap, shpToGeoJSON, makeStreetMap, onMapSelection } from "/js/modules/mapFunctions.js";
import { hydrograph, scenarioOptions } from "/js/modules/outputVisFunctions.js";
import { timeSim, printPrt} from "/js/modules/modelFunctions.js";


//import upload from "/js/modules/upload.js";
printPrt()
timeSim()

hydrograph()
// graphTab()
scenarioOptions()
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
    });




// landuse.lum:
// Fetch unclean dataset...
fetchData('/data/TxtInOut/landuse.lum')
    .then(data => {
        const cleanLanduseData = cleanLanduse(data);
        const cleanLanduseDataCopy = [...cleanLanduseData];



        const landuseTypes = getLanduseTypes(cleanLanduseData);
        
        
        

        window.LLYFNILanduse = [...landuseTypes];
        window.LLYFNILanduseEdit = [...cleanLanduseData];

    });



// plant.ini:
// Fetch unclean dataset...
fetchData('/data/TxtInOut/plant.ini')
    .then(data => {
        const cleanPlantData = cleanPlant(data);
        const cleanPlantDataCopy = [...cleanPlantData];
        window.LLYFNIPlant = [...cleanPlantData];


    });

fetchData('/data/TxtInOut/plants.plt')
    .then(data => {
        //used cleanLanduse beacuse file is in the same format as landuse.lum
        const cleanPlantsData = cleanLanduse(data);



        window.PLANToptions = [...cleanPlantsData];


    });



// leaflet.js
// Initialize the map and set its view to chosen coordinates, zoom, default layers
var map = L.map('map').setView([53.046775, -4.286951], 12, [streets]);
var satellite = makeSatelliteMap();
var streets = makeStreetMap().addTo(map);
//calling function from mapFunctions.js to convert the ziped shape files into geoJSON files  
// only add HRUs2 (1 is 'Actual HRUs')
var rivers = shpToGeoJSON('data/shpfiles/rivs1.zip')
var subBasins = shpToGeoJSON('data/shpfiles/subs1.zip')
var hrus = shpToGeoJSON('data/shpfiles/hru2.zip')




function shpStyles() {
    hrus.setStyle({ color: '#b0c4de', weight: 1 });
    rivers.setStyle({ color: '#0068C1' });
    subBasins.setStyle({ color: 'red', fillColor: 'none', weight: 1.5 });
}


// adding the converted geoJSON files to the map#
hrus.addTo(map);
hrus.once("data:loaded", function () {
    hrus.setStyle({ color: '#b0c4de', weight: 1 });
    console.log("finished loading hrus");
});

rivers.addTo(map);
rivers.once("data:loaded", function () {
    rivers.setStyle({ color: '#0068C1' });
    console.log("finished loading rivers");
});

subBasins.addTo(map);
subBasins.once("data:loaded", function () {
    subBasins.setStyle({ color: 'red', fillColor: 'none', weight: 1.5 });
    console.log("finished loading sub-basins");
});

// map layer objects 
var baseMaps = {
    "satellite": satellite,
    "streets": streets
};

var overlayMaps = {
    "HRUs": hrus,
    "Channels": rivers,
    "Sub-Basins": subBasins
};

//leaflets.js function to add layers to map with a drop down selection list
L.control.layers(baseMaps, overlayMaps).addTo(map);

//adds contain/intersect buttons to map 
L.Control.textbox = L.Control.extend({
    onAdd: function (map) {

        var text = L.DomUtil.create('div');
        text.innerHTML = `  
        <label><input type="radio" name="containOrIntersect" id="contain" checked> ${'Contain'}</label><br>
        <label class="ml-2"><input type="radio" name="containOrIntersect" id="intersect"> ${'Intersect'}</label>
    `
        return text;
    },
    onRemove: function (map) {
        // Nothing to do here
    }
});
L.control.textbox = function (opts) { return new L.Control.textbox(opts); }
L.control.textbox({ position: 'topright' }).addTo(map);


// using lasso plugin to select shapfile/hrus

const contain = document.querySelector('#contain');
const intersect = document.querySelector('#intersect');
const lassoEnabled = document.querySelector('#lassoEnabled');
const lassoControl = L.control.lasso().addTo(map);




function resetSelectedState() {
    shpStyles();

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
    //console.log(hrus)
    //lassoResult.innerHTML = layers.length ? `Selected ${layers.length} layers` : '';
}




//reset selection when mouse is pressed
map.on('mousedown', () => {
    resetSelectedState();
});
//select layers once lasso is drawn
map.on('lasso.finished', event => {
    setSelectedLayers(event.layers);
});

//gets lasso button to 'listen' for selection type 'contain'       
contain.addEventListener('change', () => {
    lassoControl.setOptions({ intersect: intersect.checked });
});
//gets lasso button to 'listen' for selcetion type 'intersect'
intersect.addEventListener('change', () => {
    lassoControl.setOptions({ intersect: intersect.checked });
});



newPlantType()


landuseTypes()

//creats the upload popup
document.getElementById("uploadButton").onmousedown = openUploadForm;
document.getElementById("popupClose").onmousedown = closeUploadForm;
function openUploadForm() {
    document.getElementById("upload").style.display = "block";
}
function closeUploadForm() {
    document.getElementById("upload").style.display = "none";
}



//populatePlantTypeForm()