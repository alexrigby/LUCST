
// CREATES LIST OF HRU LAYER ID'S AND LANDUSES WHEN A SELECTION IS MADE


export function onMapSelection(layers) {

    const selectedHRULayerIDs = [];
    //const selectedRiverLayerIDs = [];
    const selectedHRULanduses = [];

    layers.forEach(layer => {
        //if layer has property 'HRUS' it is a HRU
        if (layer.feature.properties.hasOwnProperty("HRUS")) {
            //creates array of HRU IDs
            selectedHRULayerIDs.push(layer.feature.properties.HRUS);
            //creates array of HRU landuses
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



export default {
    onMapSelection, 
}





