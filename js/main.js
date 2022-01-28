import { populateLanduseTable } from "/js/modules/populateLanduseTable.js";
import { newPlantCommunityForm } from "/js/modules/newPlantCommunityForm.js";
import { onMapSelection } from "/js/modules/onMapSelection.js";
import { hydrograph } from "/js/modules/hydrograph.js";
import { choropleth } from "/js/modules/choropleth.js";
import { getTsvFileOptions } from "./modules/getTsvFileOptions.js";
import { getInputFileData, getLanduseData, getHruData } from "./modules/getInputFileData.js";
import { newLanduseForm } from "./modules/NewLandUseForm.js";
import { updateCurrentScenario } from "./modules/updateCurentScenario.js";
import { shpToGeoJSON } from "./modules/shpToGeoJSON.js";
import { backgroundMap } from "./modules/backgroundMap.js";
import { scenarioOptions } from "./modules/sceanrioOptions.js";
import { defaultChannelData } from "./modules/defaultChannelData.js";

const dev = new URL(window.location).searchParams.get('dev') === '1';
export const HOST = dev ? 'localhost' : '5.67.118.6';
//run for dev with ?dev=1
//if ipv4 chnage change value 
// console.log('test');

(async () => {
    console.log('domcontent loaded')
    // Has the page loaded fully yet?
    window.init = false;

    
    await defaultChannelData()
 
    await scenarioOptions()

    await getInputFileData('Default')
    await getLanduseData('Default')
    await choropleth('Default')
    await getTsvFileOptions('Default', "plants.plt", "plantNames")
    await getTsvFileOptions("Default", "grassedww.str", "grww")
    await getTsvFileOptions("Default", "urban.urb", "urbanLUList")
    await getTsvFileOptions("Default", "ovn_table.lum", "manN")
    await getTsvFileOptions("Default", "cons_practice.lum", "cons")
    await getTsvFileOptions("Default", "cntable.lum", "cn2Options")
    await getTsvFileOptions("Default", "tiledrain.str", "tile")
    await getTsvFileOptions("Default", "septic.str", "sep")
    await getTsvFileOptions("Default", "filterstrip.str", "vfs")
    await hydrograph('Default')

    //hides the hruTable by default
    document.getElementById("hruTable").style.display = "none";


    var rivers = await shpToGeoJSON('catchment/Watershed/Shapes/rivs1.zip')
    var subBasins = await shpToGeoJSON('catchment/Watershed/Shapes/subs1.zip')
    var hrus = await shpToGeoJSON('catchment/Watershed/Shapes/hrus2.zip')

    //gets the coordinates of hru1 and returns it to use as the starting center for leaflet map
    const coordinates = await shp('catchment/Watershed/Shapes/hrus2.zip')
    const HRU1Coordinates = coordinates.features[0].geometry.bbox.slice(1, 3)

    // leaflet.js
    // Initialize the map and set its view to hru1 coordinates, zoom, default layers
    window.map = L.map('map').setView(HRU1Coordinates, 11, [streets]);
    var satellite = backgroundMap('mapbox/satellite-v9');
    var streets = backgroundMap('mapbox/streets-v11').addTo(map);
    var outdoors = backgroundMap('mapbox/outdoors-v11')
    //calling function from mapFunctions.js to convert the ziped shape files into geoJSON files  
    // only add HRUs2 (1 is 'Actual HRUs')

    await getHruData('Default') // NEEDS to be called after window.map has been created

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
        "streets": streets,
        "terrain": outdoors,
        // "OS" : os,
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

    async function setSelectedLayers(layers) {
        resetSelectedState();

        layers.forEach(layer => {
            if (layer.feature?.properties?.HRUS) {
                if (layer instanceof L.Marker) {
                    layer.setIcon(new L.Icon.Default({ className: 'selected ' }));
                } else if (layer instanceof L.Path) {
                    layer.setStyle({ color: '#ff4620' });
                }
            }
        });

        var hrus = onMapSelection(layers)

        await populateLanduseTable(hrus)

        document.getElementById("hruTable").style.display = "block";
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

    document.getElementById("link").addEventListener('click', () => {
        console.log(document.getElementById("myFile").value)
    })


    await newPlantCommunityForm()
    await newLanduseForm()


    updateCurrentScenario('Default');


    // Create New Scenario Button
    function openPlantForm() {
        document.getElementById("plantForm").style.display = "block";
        document.getElementById("result").innerHTML = "";
        document.getElementById("hruTable").style.display = "none";
    }
    function closePlantForm() {
        document.getElementById("plantForm").style.display = "none";
    }
    function openLuForm() {
        document.getElementById("luForm").style.display = "block";
        document.getElementById("result").innerHTML = "";
        document.getElementById("hruTable").style.display = "none";
    }
    function closeLuForm() {
        document.getElementById("luForm").style.display = "none";
    }


    //when Default is selected there is no lasso tools available
    function lassoSelectionControl(scenario) {
        if (scenario === "Default") {
            document.getElementById("lassoControls").style.display = "none";
            document.getElementById("lassoButtonControl").style.display = "none";

            document.getElementById("openPlantForm").onclick = closePlantForm;
            document.getElementById("openLuForm").onclick = closeLuForm;
            //when current scenario is selected no table is shown
            document.getElementById("hruTable").style.display = "none";

        }
        else {
            document.getElementById("lassoControls").style.display = "block";
            document.getElementById("lassoButtonControl").style.display = "block";
            document.getElementById("openPlantForm").onclick = openPlantForm;
            document.getElementById("openLuForm").onclick = openLuForm;
            // document.getElementById("hruTable").style.display = "block";
        }
    }
    //Asignes selection control to default scenario when page loads
    lassoSelectionControl('Default')

    //when the scenario tab is clicked the function lassoSelectionControl is called
    const scenarioTabs = document.getElementById('scenarioTab')
    scenarioTabs.addEventListener('click', () => {
        lassoSelectionControl(window.currentScenario)
    })
    //set the display of lasso contol to 'none' by default so when the page loads no controls show
    document.getElementById("lassoControls").style.display = "none";
    document.getElementById("lassoButtonControl").style.display = "none";



    const createNewScenarioButton = document.getElementById("createNewScenario");
    createNewScenarioButton.addEventListener("click", async function (e) {
        // console.log(window.currentScenarioVersion)
        e.preventDefault();
        let newScenarioVersion = window.currentScenarioVersion;
        console.log(newScenarioVersion)
        let newScenario = prompt("Enter name of new scenario", "Scenario " + `${newScenarioVersion}`);

        // Escape hatch
        if (newScenario === null) return;

        let scenarioList = null;
        let scenarioExists = false;
        await fetch(`http://${HOST}:8000/getscenarios`)
            .then(response => response.json())
            .then(data => {
                scenarioList = data;
                window.currentScenarioVersion = data.length;
            });
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
                    await fetch(`http://${HOST}:8000/createScenario?scenario=${newScenario}`)
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

})();
