//USES LEAFLETS.SHPFILE PLUGIN TO CONVERT SHAPEFILES.ZIP TO GEOJSON 

// shpToGeoJSON("zip file url")
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


export default { 
    shpToGeoJSON
}