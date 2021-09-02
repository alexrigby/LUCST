
//using leaflets.shpfiles plugin to convert .shapefiles.zip to geoJSON
export async function shpToGeoJSON(url) {
    return await new L.Shapefile(url, {
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                    return k + ": " + feature.properties[k];
                }).join("<br />"), {
                    maxHeight: 200
                });

            }
        }

    });
}

// export function updateTooltips() {
//     window.map.eachLayer((layer) => {
//         if(layer.feature?.properties?.HRUS) {
//             layer.bindPopup(Object.keys(layer.feature.properties).map(function (k, i) {
//                 if(k === "Landuse") {
//                     console.log(k, window.LLYFNIData[i].lu_mgt)
//                     return k + ": " + window.catchmentData[i].lu_mgt.substr(0, 4).toUpperCase();
//                 } else {
//                     return k + ": " + layer.feature.properties[k];
//                 }
//             }).join("<br />"), {
//                 maxHeight: 200
//             });
//         }
//         })
//     }





export function shpStyles() {
    hrus.setStyle({ color: '#b0c4de', weight: 1 });
    rivers.setStyle({ color: '#0068C1' });
    subBasins.setStyle({ color: 'red', fillColor: 'none', weight: 1.5 });
}

//using leaflet to make a map tile
export function makeSatelliteMap() {
    return L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWxleHJpZ2J5IiwiYSI6ImNra3V6ZHUxdjRkdGIycHF0OWY2MmY1MGoifQ.huw3PRhwLPINPzih4CGrhQ'
    });
}

export function makeStreetMap() {
    return L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWxleHJpZ2J5IiwiYSI6ImNra3V6ZHUxdjRkdGIycHF0OWY2MmY1MGoifQ.huw3PRhwLPINPzih4CGrhQ'
    });
}

export function makeOutdoorsMap() {
    return L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 18,
        id: 'mapbox/outdoors-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWxleHJpZ2J5IiwiYSI6ImNra3V6ZHUxdjRkdGIycHF0OWY2MmY1MGoifQ.huw3PRhwLPINPzih4CGrhQ'
    });

}

export function makeOsMap() {
    return L.tileLayer('https://api.os.uk/maps/raster/v1/wmts?key=n3idbQBd2fTfGq0Adr6kNoBtSOsy7TNa', {
        maxZoom: 18,
        // id: 'mapbox/outdoors-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'n3idbQBd2fTfGq0Adr6kNoBtSOsy7TNa'
    });
}





export function onMapSelection(layers) {

    const selectedHRULayerIDs = [];
    //const selectedRiverLayerIDs = [];
    const selectedHRULanduses = [];

    layers.forEach(layer => {
        //if layer has property 'HRUS' it is a HRU
        if (layer.feature.properties.hasOwnProperty("HRUS")) {
            selectedHRULayerIDs.push(layer.feature.properties.HRUS);
            selectedHRULanduses.push(layer.feature.properties.Landuse);
            // If a layer isn't an HRU (or if it has ChannelR- for use if ), it is a river
            // } else if(layer.feature.properties.hasOwnProperty("ChannelR")) {
            //     // Do something with rivers
            //     //use Channel NOT ChannelR as the identifier for rivers 
            //     selectedRiverLayerIDs.push(layer.feature.properties.ChannelR);
        }
    });

    return {
        landuse: selectedHRULanduses,
        hrus: selectedHRULayerIDs
        // rivers: selectedRiverLayerIDs
    };
}


// const shpFileHrus = data.hrus.map(function (v) {
//     return parseInt(v);
//   })

//   //  console.log(window.catchmentData)
//   // map HRUs(from shapefile) to id's from window.catchmentData to display correct hru lu_mgt in table
//   const hruLuSelection = shpFileHrus.map(shpHru => {

//     const obj = window.catchmentData.find(record => record.id == shpHru);
//     return { ...shpHru, ...obj };
//   })



export function updateTooltips(hruData) {
    // let j = 0;

    window.map.eachLayer((layer) => {
        

        if (layer.feature?.properties?.HRUS) {

            //gets the name HRUS from the layers and uses it to select the lu_mgt but index as the layesr dont load in the same orders as the raw data
            let hru = parseInt(layer.feature.properties.HRUS)
           
            let hruLUM = hruData[hru - 1].lu_mgt.substr(0, hruData[hru-1].lu_mgt.length - 4).toUpperCase()
            layer.bindPopup(Object.keys(layer.feature.properties).map(function (k, i) {
                if (k === "Landuse") {
                    // console.log(hruData[j])
                    return k + ": " + hruLUM;

                } else {
                    return k + ": " + layer.feature.properties[k];
                }
            }).join("<br />"), {
                maxHeight: 200
            });
            // j++;
        }
    })
}


// const hruId = layer.feature.properties.HRUS
// const hruIds = hruId.forEach(el => (
//     {
//       id: el,
//     }
//   ));
// console.log(hruIds)

// const hruFileLu = hruId.map(shpHru => {
//     const obj = hruData.find(record => record.id == shpHru);
//     return { ...shpHru, ...obj };
// })


export default {
    shpToGeoJSON,
    makeSatelliteMap,
    makeStreetMap,
    onMapSelection,
    updateTooltips,
    makeOutdoorsMap,
    makeOsMap, 
}





