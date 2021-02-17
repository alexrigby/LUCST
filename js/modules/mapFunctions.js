
//using leaflets.shpfiles plugin to convert .shapefiles.zip to geoJSON
export function shpToGeoJSON(url) {
    return new L.Shapefile(url, {
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



export function onMapSelection(layers){

    const selectedHRULayerIDs = [];
    //const selectedRiverLayerIDs = [];
    const selectedHRULanduses =[];

    layers.forEach(layer => {
        //if layer has property 'HRUS' it is a HRU
        if(layer.feature.properties.hasOwnProperty("HRUS")) {
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
        landuse:selectedHRULanduses,
        hrus: selectedHRULayerIDs 
        // rivers: selectedRiverLayerIDs
    };
}



export default {
    shpToGeoJSON,
    makeSatelliteMap,
    makeStreetMap,
    onMapSelection,
}



//Trying to make the diffrent HRUs different colors, come back to later
// export function getColor(d) {
//     return d === PAST ? '#800026' :
//            d === RNGE  ? '#BD0026' :
//            d === RNGB  ? '#E31A1C' :
//                       '#FFEDA0';
// }

// export function style(feature) {
//     return {
//         fillColor: getColor(feature.Landuse),
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         dashArray: '3',
//         fillOpacity: 0.7
//     };
// }



