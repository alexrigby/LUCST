
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



// window.tempHRUS = [];
// window.map.eachLayer((layer) => {
//   if(layer.feature?.properties?.HRUS) {
//     window.tempHRUS.push(parseInt(layer.feature.properties.HRUS));
//     console.log('p', layer.getPopup().getContent())
//   }
// })





