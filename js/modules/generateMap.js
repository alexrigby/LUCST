import { shpToGeoJSON } from "./shpToGeoJSON.js";
import { backgroundMap } from "./backgroundMap.js";
import { onMapSelection } from "/js/modules/onMapSelection.js";
import { populateLanduseTable } from "/js/modules/populateLanduseTable.js";
import { getHRUData } from "./getHRUData.js";

export async function generateMap() {
  const rivers = await shpToGeoJSON("catchment/Watershed/Shapes/rivs1.zip");
  const subBasins = await shpToGeoJSON("catchment/Watershed/Shapes/subs1.zip");
  const hrus = await shpToGeoJSON("catchment/Watershed/Shapes/hrus2.zip");

  //gets the coordinates of hru1 and returns it to use as the starting center for leaflet map
  const coordinates = await shp("catchment/Watershed/Shapes/hrus2.zip");
  const HRU1Coordinates = coordinates.features[0].geometry.bbox.slice(1, 3);

  // leaflet.js
  // Initialize the map and set its view to hru1 coordinates, zoom, default layers
  window.map = L.map("map").setView(HRU1Coordinates, 11, [streets]);
  var satellite = backgroundMap("mapbox/satellite-v9");
  var streets = backgroundMap("mapbox/streets-v11").addTo(map);
  var outdoors = backgroundMap("mapbox/outdoors-v11");
  //calling function from mapFunctions.js to convert the ziped shape files into geoJSON files
  // only add HRUs2 (1 is 'Actual HRUs')

  await getHRUData("Default"); // NEEDS to be called after window.map has been created

  // adding the converted geoJSON files to the map#
  hrus.addTo(map);
  hrus.once("data:loaded", function () {
    hrus.setStyle({ color: "#b0c4de", weight: 1 });
  });

  rivers.addTo(map);
  rivers.once("data:loaded", function () {
    rivers.setStyle({ color: "#0068C1" });
  });

  subBasins.addTo(map);
  subBasins.once("data:loaded", function () {
    subBasins.setStyle({ color: "red", fillColor: "none", weight: 1.5 });
  });

  // map layer objects
  var baseMaps = {
    satellite: satellite,
    streets: streets,
    terrain: outdoors,
  };

  var overlayMaps = {
    HRUs: hrus,
    Channels: rivers,
    "Sub-Basins": subBasins,
  };

  //leaflets.js function to add layers to map with a drop down selection list
  L.control.layers(baseMaps, overlayMaps).addTo(map);

  //adds contain/intersect buttons to map
  L.Control.textbox = L.Control.extend({
    onAdd: function (map) {
      var text = L.DomUtil.create("div");
      text.id = "lassoControls";
      text.innerHTML = `  
    <label><input type="radio" name="containOrIntersect" id="contain" checked> ${"Contain"}</label><br>
    <label class="ml-2"><input type="radio" name="containOrIntersect" id="intersect"> ${"Intersect"}</label>
`;
      return text;
    },
    onRemove: function (map) {
      // Nothing to do here
    },
  });
  L.control.textbox = function (opts) {
    return new L.Control.textbox(opts);
  };
  L.control.textbox({ position: "topright" }).addTo(map);

  // using lasso plugin to select shapfile/hrus
  const contain = document.querySelector("#contain");
  const intersect = document.querySelector("#intersect");
  const lassoControl = L.control.lasso().addTo(map);
  //adds and id to the lasso button so I can turn it off when default is selected
  const lassoId = lassoControl._container;
  lassoId.id = "lassoButtonControl";

  function resetSelectedState() {
    shpStyles(hrus, rivers, subBasins);
  }

  async function setSelectedLayers(layers) {
    resetSelectedState();
    layers.forEach((layer) => {
      if (layer.feature?.properties?.HRUS) {
        if (layer instanceof L.Marker) {
          layer.setIcon(new L.Icon.Default({ className: "selected " }));
        } else if (layer instanceof L.Path) {
          layer.setStyle({ color: "#ff4620" });
        }
      }
    });
    var hrus = onMapSelection(layers);
    await populateLanduseTable(hrus);
    document.getElementById("hruTable").style.display = "block";
  }

  //reset selection when mouse is pressed
  map.on("mousedown", () => {
    resetSelectedState();
  });
  //select layers once lasso is drawn
  map.on("lasso.finished", (event) => {
    window.currentLasso = event.layers;
    setSelectedLayers(event.layers);
  });

  //gets lasso button to 'listen' for selection type 'contain'
  contain.addEventListener("change", () => {
    lassoControl.setOptions({ intersect: intersect.checked });
  });
  //gets lasso button to 'listen' for selcetion type 'intersect'
  intersect.addEventListener("change", () => {
    lassoControl.setOptions({ intersect: intersect.checked });
  });
}

function shpStyles(hrus, rivers, subBasins) {
  hrus.setStyle({ color: "#b0c4de", weight: 1 });
  rivers.setStyle({ color: "#0068C1" });
  subBasins.setStyle({ color: "red", fillColor: "none", weight: 1.5 });
}

export default {
  generateMap,
};
