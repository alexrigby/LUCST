

export function shpToGeoJSON(url){
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



export default   shpToGeoJSON

 

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



