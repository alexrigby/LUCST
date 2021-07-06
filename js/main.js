import fetchData from "/js/modules/universalFunctions.js";
import { populateTable, cleanHru, getHru, updateHru } from "/js/modules/hru_dataFunctions.js";
import { getPlantOptions, cleanPlant, newPlantType } from "/js/modules/plantFunctions.js";
import { cleanLanduse, getLanduseTypes, landuseTypes } from "/js/modules/landuseFunctions.js";
import { updateTooltips, makeSatelliteMap, shpToGeoJSON, makeStreetMap, onMapSelection } from "/js/modules/mapFunctions.js";
import { hydrograph, scenarioOptions } from "/js/modules/outputVisFunctions.js";
import { timeSim, printPrt } from "/js/modules/modelFunctions.js";
import choropleth from "/js/modules/choroplethFunctions.js";



// TRYING TO ZIP SHAPE FILES----- UNFINISHED

// async function downloadButton(data, fileName) {
//   var myFile = new Blob([data], { type: 'blob' });
//   document.getElementById('downloadLanduse').setAttribute('href', window.URL.createObjectURL(myFile));
//   document.getElementById('downloadLanduse').setAttribute('download', fileName);
// }

// const hru2Shp = '/data/hru2/hrus2.shp';
// // Fetch the image and parse the response stream as a blob
// const hru2ShpBlob = fetch(hru2Shp).then(response => response.blob());

// // create a new file from the blob object
// const hru2ShpFile = new File([hru2ShpBlob], "hrus2.shp");

// let zip = new JSZip();
// let hruFolder = zip.folder('hru2');
// hruFolder.file( "hru2.shp",hru2ShpFile);
// console.log(hruFolder)


// // hruFolder.generateAsync({ type: "blob" }).then(content => saveAs(content, "files"));

// downloadButton(hruFolder, "hru2")


//import upload from "/js/modules/upload.js";
printPrt()
timeSim()

await scenarioOptions()
hydrograph(window.currentScenario)
// graphTab()
choropleth(window.currentScenario)

// hru-data.hru:
// Fetch unclean dataset...
fetchData('/LLYFNI2/Scenarios/Default/TxtInOut/hru-data.hru')
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
fetchData('/LLYFNI2/Scenarios/Default/TxtInOut/landuse.lum')
    .then(data => {
        const cleanLanduseData = cleanLanduse(data);
        const cleanLanduseDataCopy = [...cleanLanduseData];



        const landuseTypes = getLanduseTypes(cleanLanduseData);




        window.LLYFNILanduse = [...landuseTypes];
        window.LLYFNILanduseEdit = [...cleanLanduseData];

    });



// plant.ini:
// Fetch unclean dataset...
fetchData('/LLYFNI2/Scenarios/Default/TxtInOut/plant.ini')
    .then(data => {
        const cleanPlantData = cleanPlant(data);
        const cleanPlantDataCopy = [...cleanPlantData];
        window.LLYFNIPlant = [...cleanPlantData];

    });

fetchData('/LLYFNI2/Scenarios/Default/TxtInOut/plants.plt')
    .then(data => {
        //used cleanLanduse beacuse file is in the same format as landuse.lum
        const cleanPlantsData = cleanLanduse(data);
        window.PLANToptions = [...cleanPlantsData];

    });



// leaflet.js
// Initialize the map and set its view to chosen coordinates, zoom, default layers
window.map = L.map('map').setView([53.046775, -4.286951], 12, [streets]);
var satellite = makeSatelliteMap();
var streets = makeStreetMap().addTo(map);
//calling function from mapFunctions.js to convert the ziped shape files into geoJSON files  
// only add HRUs2 (1 is 'Actual HRUs')
var rivers = shpToGeoJSON('LLYFNI2/Watershed/Shapes/rivs1.zip')
var subBasins = shpToGeoJSON('LLYFNI2/Watershed/Shapes/subs1.zip')
var hrus = shpToGeoJSON('LLYFNI2/Watershed/Shapes/hrus2.zip')




function shpStyles() {
    hrus.setStyle({ color: '#b0c4de', weight: 1 });
    rivers.setStyle({ color: '#0068C1' });
    subBasins.setStyle({ color: 'red', fillColor: 'none', weight: 1.5 });
}


// adding the converted geoJSON files to the map#
hrus.addTo(map);
hrus.once("data:loaded", function () {
    hrus.setStyle({ color: '#b0c4de', weight: 1 });
    // console.log("finished loading hrus");
});

rivers.addTo(map);
rivers.once("data:loaded", function () {
    rivers.setStyle({ color: '#0068C1' });
    // console.log("finished loading rivers");
});

subBasins.addTo(map);
subBasins.once("data:loaded", function () {
    subBasins.setStyle({ color: 'red', fillColor: 'none', weight: 1.5 });
    // console.log("finished loading sub-basins");
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
        text.id = "lassoControls"
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
//adds and id to the lasso button so I can turn it off when default is selected
const lassoId = lassoControl._container;
lassoId.id = "lassoButtonControl"



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
    window.currentLasso = event.layers;
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


// const lulcEditButtons = document.querySelectorAll(".lulc-edit-button");

// lulcEditButtons.forEach((el, i, arr) => {
//   el.addEventListener("click", () => { 
//     updateTooltips()
//   })
// })


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


// Scenario Management
// window.currentScenario = "Default";


export function updateCurrentScenario(scenario) {
    window.currentScenario = scenario;
    // Update scenario tab
    // Reset tab view
    Array.from(document.getElementsByClassName('tablinks')).forEach((el, i, arr) => {
        el.classList.remove('scenario-active');
    })
    // Set active tab button
    document.querySelector(`[data-scenario="${scenario}"]`).classList.add('scenario-active');
    // TODO: Call Hydrograph()

    console.log('CURRENT SCENARIO: ', window.currentScenario)

}


updateCurrentScenario('Default');
// Create New Scenario Button


//when Default is selected there is no lasso tools available
function lassoSelectionControl(scenario) {
    if (scenario === "Default") {
        document.getElementById("lassoControls").style.display = "none";
        document.getElementById("lassoButtonControl").style.display = "none";
         document.getElementById("result").innerHTML = "";

    }
    else {
        document.getElementById("lassoControls").style.display = "block";
        document.getElementById("lassoButtonControl").style.display = "block";
        // document.getElementById("result").style.display = "block";
    }
}


//when the scenario tab is clicked the function lassoSelectionControl is called
const scenarioTabs = document.getElementById('scenarioTab')
scenarioTabs.addEventListener('click', () => {
    lassoSelectionControl(window.currentScenario)
})
//set the display of lasso contol to 'none' by default so when the page loads no controls show
document.getElementById("lassoControls").style.display = "none";
document.getElementById("lassoButtonControl").style.display = "none";

window.currentScenarioVersion = 0;

const createNewScenarioButton = document.getElementById("createNewScenario");
createNewScenarioButton.addEventListener("click", async function (e) {
    console.log(window.currentScenarioVersion)
    e.preventDefault();
    let newScenarioVersion = window.currentScenarioVersion + 1 ;
    console.log(newScenarioVersion)
    let newScenario = prompt("Enter name of new scenario", "Scenario " + `${newScenarioVersion}`);
    let scenarioList = null;
    let scenarioExists = false;
    await fetch('http://localhost:8000/getscenarios')
        .then(response => response.json())
        .then(data => { scenarioList = data });
    if (newScenario === "Default") {
        console.error("New scenario cannot be 'Default'");
        window.alert("New scenario cannot be 'Default'");
    } else {
        if (scenarioList !== null && scenarioList !== undefined && typeof scenarioList === 'object') {
            scenarioList.forEach((el, i, arr) => {
                if (newScenario === el) {
                    scenarioExists = true;
                }
            });
            if (scenarioExists === false) {
                await fetch(`http://localhost:8000/createScenario?scenario=${newScenario}`)
                    .then(res => res.json())
                    .then(async data => {
                        if (data.code === 1) {
                            await scenarioOptions();
                            document.querySelector(`[data-scenario="${newScenario}"]`).click();
                        } else {
                            console.error(`Could not create new scenario: Err ${data.code}, ${data?.message}`);
                            window.alert(`Could not create new scenario: Err ${data.code}, ${data?.message}`);
                        }
                    });
                // updateCurrentScenario(newScenario);
                window.currentScenario = newScenario;
            } else {
                console.error(`Scenario with name ${newScenario} already exists`);
                window.alert(`Scenario with name ${newScenario} already exists`);
            }
        } else {
            console.error("Could not fetch Scenario List");
            throw new Error("Could not fetch scenario list");
        }
    }

});

